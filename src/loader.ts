import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import { TSnippetMatter } from './types.js';
import * as utils from './utils.js';

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
  BlockStatement = 'BlockStatement',
  ExportNamedDeclaration = 'ExportNamedDeclaration'
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

export interface IExportNamedDeclarationNode extends IGeneralNode {
  type: ENodeTypes.ExportNamedDeclaration
}

export type TNode =
  IIdentifierNode |
  IBlockStatementNode |
  IExportNamedDeclarationNode |
  IGeneralNode

export type Node = TNode

export const getFunctionProperties = async (code: string, name: string = 'script') => {
  const fn = {
    declaration: {
      startExport: 0,
      startDeclaration: 0,
      start: 0,
      end: 0,
    },
    body: {
      start: 0,
      end: 0,
    },
    isIdentifierFound: false,
  };

  const tree = acorn.parse(code, {
    ecmaVersion: 'latest',
    sourceType: 'module',
  });

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
        case ENodeTypes.ExportNamedDeclaration: {
          const aNode = node as IExportNamedDeclarationNode;

          if (!fn.declaration.start) {
            // The original start point.
            fn.declaration.startExport = aNode.start;
            // The start point after: export
            fn.declaration.startDeclaration = aNode.start + 'export '.length;
            // The start point after: export [var|let|const] =
            fn.declaration.start = code.indexOf('=', aNode.start) + 1;
            fn.declaration.end = aNode.end;
          }

          /**
           * The ExportNamedDeclaration comes last.
           */
          return true;
        }
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
          if (aNode.name === name) {
            fn.isIdentifierFound = true;
          }

          return false;
        }
        case ENodeTypes.BlockStatement: {
          const aNode = node as IBlockStatementNode;

          /**
           * Assume when we have the flag set.
           */
          if (!fn.isIdentifierFound) {
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
          fn.body.start = aNode.start + 1;
          fn.body.end = aNode.end - 1;

          return false;
        }
        default: {
          break;
        }
      }

      return false;
    },
  );

  return fn;
};

export const getScriptMatters = async (code: string): Promise<TSnippetMatter[]> => {
  const matters: [string, string][] = [];

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
  const fn = await getFunctionProperties(
    code,
    utils.snippets.findMatterByName(matters, 'name')[0],
  );

  return {
    code,
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
