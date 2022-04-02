import swc from '@swc/core';

export const typescript = async (code: string) => {
  const output = await swc
    .transform(code, {
      sourceMaps: true,
      isModule: true,
      jsc: {
        parser: {
          syntax: 'typescript',
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
        target: 'es5',
        keepClassNames: true,
        loose: true,
      },
      module: {
        type: 'es6',
      },
    });

  return output;
};

export const auto = async (code: string, extension: string) => {
  let result = { code };

  switch (extension) {
    case 'ts': {
      result = await typescript(code);

      break;
    }
    default: {
      break;
    }
  }

  return result;
};
