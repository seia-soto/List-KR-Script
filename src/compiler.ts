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
