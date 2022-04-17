import { read } from './loader';

export namespace userscript {
  /**
   * Compiles userscript header
   *
   * @param values The set of header key:value
   * @returns Compiled header content of the userscript
   */
  export const writeHeader = async (values: string[][]) => {
    const lines = [
      '==UserScript==',
    ];

    for (let i = 0, l = values.length; i < l; i += 1) {
      const [key, value] = values[i];

      lines.push(`@${key} ${value}`);
    }

    lines.push('==/UserScript==');

    return lines
      // Insert comments before lines.
      .map((line) => `// ${line}`)
      .join('\n');
  };
}

export namespace snippets {
  export type TSnippet = Awaited<ReturnType<typeof read>>

  /**
   * Generate IIFE code with arguments
   *
   * @param snippet The parsed snippet object
   * @param dependencies Additional dependencies in stringified form
   * @returns The IIFE form of code with dependencies included
   */
  export const generateIife = (snippet: TSnippet, dependencies: string = '') => {
    return `(${snippet.fn.isAsync ? 'async ' : ''}function(${snippet.fn.argument}){${snippet.fn.body}})(${dependencies})`;
  };

  /**
   * Generate closure code for variable declaration
   *
   * @param snippet The parsed snippet object
   * @param dependencies Additional dependencies in stringified form
   * @returns The string contains closure that passes dependencies as first argument
   */
  export const generateClosure = (snippet: TSnippet, dependencies: string = '') => {
    const innerDependencies = `${dependencies}${dependencies.length ? ',' : ''}...__args`;

    return `${snippet.fn.isAsync ? 'async ' : ''}function(...__args){return ${snippets.generateIife(snippet, innerDependencies)}}`;
  };

  /**
   * Generate string object code with dependency included
   *
   * @param matters The matters object extracted from comment of the script
   * @returns String representating object code containing required dependencies
   */
  export const getDependenciesObjectStringFromSnippet = (matters: TSnippet['matters']) => {
    return `{${matters
      .filter((matter) => matter[0] === 'include')
      .map((matter) => `${matter[1]}:lib__${matter[1]}`)
      .join(',')
    }}`;
  };
}
