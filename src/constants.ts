import * as path from 'path';

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
