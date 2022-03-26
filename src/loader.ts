import * as fs from 'fs/promises';
import * as path from 'path';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import { existsSync } from 'fs';

export namespace utils {
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
}

/**
 * You might think declaring the module should be better than inline typing.
 * However, technologies are not ready yet.
 *
 * - esbuild ignores the typings such as enum in type declarations.
 * - due to the lack of acorn types, it's dirty to solve the issue.
 *
 * For now, I believe that this is the most simple approach.
 */
/* eslint-disable no-unused-vars */
export enum ENodeTypes {
  Identifier = 'Identifier',
  BlockStatement = 'BlockStatement'
}
/* eslint-enable no-unused-vars */

export interface IGeneralNode extends acorn.Node {
  type: ENodeTypes
}

export interface IIdentifierNode extends IGeneralNode {
  type: ENodeTypes.Identifier,
  name: string
}

export interface IBlockStatementNode extends IGeneralNode {
  type: ENodeTypes.BlockStatement
}

export type TNode =
  IIdentifierNode |
  IBlockStatementNode |
  IGeneralNode

export type Node = TNode

/**
 * Reads the metadata and an actual script content
 *
 * @param location The location of the script file
 */
export const readScriptAt = async (location: string) => {
  if (!existsSync(location)) {
    throw new Error(`Loader failed to read the script file at location: ${location}`);
  }

  const buffer = await fs.readFile(location);
  const content = buffer.toString();

  const matters: string[][] = [];

  const tree = acorn.parse(content, {
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

  /**
   * Instead of defining two variable using `let`,
   * it's better to have a form for cleaner code.
   */
  const innerFunction = {
    start: 0,
    end: 0,
    isIdentifierFound: false,
  };

  /**
   * Use of findNodeAt function instead of other walker functions is
   * to break the walker loop when we grab all information that we need.
   *
   * Returning constant `true` will break the loop.
   */
  walk.findNodeAt<TNode>(
    tree,
    undefined,
    undefined,
    /**
     * The actual finder function of the node.
     * We'll find the following form in this case.
     *
     * > export const "script" = () => { console.log('sample') }
     *
     * @param nodeType The type of ESTree node
     * @param node The node object
     * @returns True if wanted node found
     */
    (nodeType, node) => {
      switch (node.type) {
        case ENodeTypes.Identifier: {
          /**
           * Additional work is required for better approach than current one.
           *
           * At this time, acorn: the abstract tree parser,
           * doesn't fully typed the ESTree specification.
           *
           * Hint for future works:
           *  - enum
           *  - class
           */
          const aNode = node as IIdentifierNode;

          /**
           * Find where the declaration name is `script`.
           *
           * e.g. export const "script" = () => {}
           */
          if (aNode.name === 'script') {
            innerFunction.isIdentifierFound = true;
          }

          return false;
        }
        case ENodeTypes.BlockStatement: {
          const aNode = node as IBlockStatementNode;

          /**
           * Assume when we have the flag set.
           */
          if (!innerFunction.isIdentifierFound) {
            return false;
          }

          /**
           * As we have brakets, cutting the start and end is required.
           *
           * export const "script" = () => { console.log('sample') }
           *
           * By doing + 1 and - 1 will result to extract:
           * export const "script" = () => {" console.log('sample') "}
           */
          innerFunction.start = aNode.start + 1;
          innerFunction.end = aNode.end - 1;

          return true;
        }
        default: {
          return false;
        }
      }
    },
  );

  return {
    matters,
    script: content.slice(innerFunction.start, innerFunction.end),
    innerFunction,
  };
};
