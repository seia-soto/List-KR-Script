import * as fs from 'fs/promises';
import * as constants from './constants.js';
import * as loader from './loader.js';
import * as transform from './transform.js';

const main = async () => {
  /**
   * Assume that there are two types of scripts:
   * - injectable scripts (ends with .inject.js)
   *    + or at specific stage (ends with .inject.[stage].js)
   *      e.g. script.inject.dev.js
   * - List-KR specific snippets (ends with .lib.js)
   */
  const files = await loader.utils.readDirRecursively(constants.directories.scripts);

  for (let i = 0, l = files.length; i < l; i += 1) {
    /**
     * Logically, the variables `type` and `extension` are ensured.
     */
    const file = files[i];
    const [type, ...data] = file.split('/').pop()?.split('.').slice(1) ?? [];
    // Note that .pop() function removes the item from original array.
    const buffer = await fs.readFile(file);
    const content = buffer.toString();
    const extension = data.pop() ?? '';

    /**
     * Transform and parse the script.
     */
    const transformed = await transform.auto(
      content,
      extension,
    );
    const snippet = await loader.readScript(transformed.code);

    console.log(snippet);
    console.log(
      transformed.code.slice(snippet.fn.declaration.start, snippet.fn.declaration.end),
    );

    switch (type) {
      /**
       * In case of injectable script.
       */
      case 'inject': {
        // In case of parsing additional data contained in extension.
        if (data.length) {
          const [stage] = data;

          console.log(`stage: ${stage}`);
        }

        break;
      }
      default: {
        console.warn(`We found an unknown script file at ${file}`);

        break;
      }
    }
  }
};

main();
