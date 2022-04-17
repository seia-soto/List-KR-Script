export type TSnippetMatter = [string, string]

export interface ISnippetFunctionProperties {
  declaration: {
    startExport: number,
    startDeclaration: number,
    start: number,
    end: number,
  },
  body: {
    start: number,
    end: number,
  },
  isIdentifierFound: boolean,
}

export interface ISnippet {
  code: string,
  matters: TSnippetMatter[],
  fn: ISnippetFunctionProperties
}
