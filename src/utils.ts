import * as fs from 'fs/promises';
import * as path from 'path';

export namespace fileSystem {
  /**
   * Reads a targeted directory content recursively
   *
   * @param startFrom The path to the directory to start searching
   * @returns An array of full path string to the files
   */
  export const readDirRecursively = async (startFrom: string): Promise<string[]> => {
    const contents = await fs.readdir(startFrom);
    const results: string[] = [];

    for (let i = 0, l = contents.length; i < l; i += 1) {
      const fullpath = path.join(startFrom, contents[i]);

      if ((await fs.stat(fullpath)).isDirectory()) {
        /**
         * Run the function recursively if the directory found.
         *
         * It's not the best practice in heavily-stressed case,
         * as the function fills up engine's callstack fast.
         * However, in this case, this is enough.
         */
        results.push(...(await readDirRecursively(fullpath)));
      } else {
        results.push(fullpath);
      }
    }

    return results;
  };

  /**
   * Reads a file and returns its content
   *
   * @param location The location of the file
   * @returns The content of the file
   */
  export const readFile = async (location: string) => {
    const buffer = await fs.readFile(location);
    const content = buffer.toString();

    return content;
  };

  /**
   * Exports available data from filename
   *
   * @param location The location of the file
   * @returns The name, extension, and data separated by dot
   */
  export const exportDataFromFilename = async (location: string) => {
    // Logically, the variables `type` and `extension` are ensured.
    const [name, ...data] = path.basename(location).split('.');
    const extension = data[data.length - 1];

    return {
      name,
      extension,
      data,
    };
  };
}
