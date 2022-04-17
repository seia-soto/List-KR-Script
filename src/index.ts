import * as constants from './constants.js';
import * as compiler from './compiler.js';
import * as loader from './loader.js';
import * as transform from './transform.js';
import * as utils from './utils.js';

const main = async () => {
  /**
   * Assume that there are two types of scripts:
   * - injectable scripts (ends with .inject.js)
   *    + or at specific stage (ends with .inject.[stage].js)
   *      e.g. script.inject.dev.js
   * - List-KR specific snippets (ends with .lib.js)
   */
  const files = await utils.fileSystem.readDirRecursively(constants.directories.scripts);
  const fragments = {
    pre: '',
    libraries: '',
    scripts: '',
    post: '',
  };

  for (let i = 0, l = files.length; i < l; i += 1) {
    const file = await utils.fileSystem.exportDataFromFilename(files[i]);
    const content = await utils.fileSystem.readFile(files[i]);

    /**
     * Transform and parse the script.
     */
    const transformed = await transform.auto(
      content,
      file.extension,
    );
    const snippet = await loader.read(transformed.code);

    const [type, stage] = file.data;

    switch (type) {
      case 'lib': {
        if (stage === 'independent') {
          /**
           * Independent libraries can be included by later dependent (common) libraries.
           * So, we need to put this at the top of the file.
           */
          fragments.pre += `const lib__${file.name}=${compiler.snippets.generateClosure(snippet)};\n`;
        } else {
          fragments.libraries += `const lib__${file.name}=${compiler.snippets.generateClosure(
            snippet,
            // We assume that all libraries required are type of independent library.
            compiler.snippets.getDependenciesObjectStringFromSnippet(snippet.matters),
          )};\n`;
        }

        break;
      }
      case 'inject': {
        // TODO: Add separate executor code by domain match.
        fragments.scripts += `${compiler.snippets.generateIife(
          snippet,
          compiler.snippets.getDependenciesObjectStringFromSnippet(snippet.matters),
        )};\n`;

        break;
      }
      default: {
        break;
      }
    }
  }

  console.log(
    (
      await transform.result(
        Object
          .values(fragments)
          .join('\n'),
      )
    )
      .code,
  );
};

main();
