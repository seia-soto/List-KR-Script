import * as acorn from 'acorn';
import * as utils from './utils.js';

export const getFunctionProperties = async (code: string) => {
  const pattern = /(async\s*?)?(?:function[\w\s ]*?\(([\s\w ,:]*?)\)|\(([\s\w ,:]*?)\)[\s ]*?=>)[\s ]*?{([\s\S]*?)};?\s*?$/gi;
  const result = pattern.exec(code);

  if (!result) {
    return {
      argument: '',
      body: '',
      isAsync: false,
    };
  }

  return {
    argument: result[2] || result[3],
    body: result[4].trim(),
    isAsync: !!result[1],
  };
};

export const getScriptMatters = async (code: string) => {
  const matters: string[][] = [];

  acorn.parse(code, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    onComment: (isBlock, text) => {
      /**
       * The comment should be opened with block style,
       * not double-slash prefixed line style.
       */
      if (!isBlock) {
        return;
      }

      const lines = text
        .split('\n')
        .map((line) => ({
          keyStart: line.indexOf('@'),
          text: line,
        }))
        /**
         * Let's use lines only have '@' character.
         */
        .filter((line) => line.keyStart >= 0);

      for (let i = 0, l = lines.length; i < l; i += 1) {
        const line = lines[i];

        const [_key, ..._parts] = line.text
          .slice(line.keyStart)
          .split(' ')
          /**
           * Trim function removes useless spaces.
           */
          .map((part) => part.trim());
        const key = _key.slice(1);
        const value = _parts.join(' ');

        /**
         * Grab the config value.
         */
        matters.push([
          key, value,
        ]);
      }
    },
  });

  return matters;
};

/**
 * Reads the metadata and an actual script content
 *
 * @param code The content of the script file
 */
export const read = async (code: string) => {
  const matters = await getScriptMatters(code);
  const fn = await getFunctionProperties(code);

  return {
    matters,
    fn,
  };
};

/**
 * Reads the metadata and an actual script content from file
 *
 * @param location The location of the script file
 */
export const readAt = async (location: string) => {
  const content = await utils.fileSystem.readFile(location);
  const result = await read(content);

  return result;
};
