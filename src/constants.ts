import * as path from 'path';

/**
 * Shared metadata, nothing special
 */
export namespace metadata {
  export const repositoryUrl = 'https://github.com/List-KR/List-KR-Script';
}

/**
 * A set of directories
 */
export namespace directories {
  /**
   * Root directory path,
   *
   * In JavaScript module, it's unable to use `__dirname`.
   * Instead of using `__dirname`, we assume that user is
   * running the command in the root directory of the project.
   */
  export const root = path.join(process.cwd());

  /**
   * Script directory path
   */
  export const scripts = path.join(directories.root, 'scripts');
}

/**
 * A set of options applies into compiler
 */
export namespace compilerOptions {
  /**
   * Constants here are changable while compile time since properties are treated as dynamic.
   */
  export const baseUserScriptOptions = {
    grant: [
      'unsafeWindow',
      'GM_deleteValue',
      'GM_listValues',
      'GM_getValue',
      'GM_setValue',
    ],
    runAt: 'document-start',
  };

  /**
   * Constants here will be injected into the header of userscript statically.
   */
  export const defaultMatters = [
    [
      'name',
      'List-KR Script',
    ],
    [
      'encoding',
      'utf-8',
    ],
    [
      'namespace',
      metadata.repositoryUrl,
    ],
    [
      'homepageURL',
      metadata.repositoryUrl,
    ],
    [
      'supportURL',
      `${metadata.repositoryUrl}/issues/4`,
    ],
    [
      'updateURL',
      `${metadata.repositoryUrl}/raw/rel/List-KR-Script.user.js`,
    ],
    [
      'downloadURL',
      `${metadata.repositoryUrl}/raw/rel/List-KR-Script.user.js`,
    ],
    [
      'license',
      'MPL-2.0',
    ],
    [
      'description',
      'List-KR Script allows you to block complicated advertisement to block on NamuWiki, website protected by ad-shield, etc.',
    ],
    [
      'author',
      'PiQuark6046 (piquark6046@protonmail.com) and contributors',
    ],
  ];
}
