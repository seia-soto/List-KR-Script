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
        target: 'es2022',
        keepClassNames: true,
        loose: false,
      },
    });

  return output;
};

export const javascript = async (code: string) => {
  const output = await swc
    .transform(code, {
      sourceMaps: true,
      isModule: true,
      jsc: {
        parser: {
          syntax: 'ecmascript',
        },
        transform: {},
        target: 'es2022',
        keepClassNames: true,
        loose: false,
      },
    });

  return output;
};

export const result = async (code: string) => {
  const output = await swc
    .transform(code, {
      sourceMaps: true,
      isModule: true,
      minify: true,
      jsc: {
        parser: {
          syntax: 'ecmascript',
        },
        transform: {},
        minify: {
          compress: {
            unused: true,
          },
          mangle: true,
        },
        target: 'es2015',
        keepClassNames: true,
        loose: false,
      },
    });

  return output;
};

export const auto = async (code: string, extension: string) => {
  let result = {
    provider: 'none',
    code,
  };

  switch (extension) {
    case 'js': {
      result = {
        provider: 'javascript',
        ...await javascript(code),
      };

      break;
    }
    case 'ts': {
      result = {
        provider: 'typescript',
        ...await typescript(code),
      };

      break;
    }
    default: {
      break;
    }
  }

  return result;
};
