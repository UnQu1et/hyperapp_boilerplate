'use strict';

const env = process.env.BABEL_ENV || process.env.NODE_ENV;

function create() {
  if (env !== 'development' && env !== 'test' && env !== 'production') {
    throw new Error(
      'Using `babel-preset-react-app` requires that you specify `NODE_ENV` or ' +
        '`BABEL_ENV` environment variables. Valid values are "development", ' +
        '"test", and "production". Instead, received: ' +
        JSON.stringify(env) +
        '.'
    );
  }

  const plugins = [
    require.resolve('babel-plugin-transform-es2015-destructuring'),
    require.resolve('babel-plugin-syntax-jsx'),
    [
      require.resolve('babel-plugin-transform-object-rest-spread'),
      {
        useBuiltIns: true,
      },
    ],
    // Transforms JSX
    [
      require.resolve('babel-plugin-transform-react-jsx'),
      {
        pragma: 'h',
        useBuiltIns: true,
      },
    ],
    // Polyfills the runtime needed for async/await and generators
    [
      require.resolve('babel-plugin-transform-runtime'),
      {
        helpers: false,
        polyfill: false,
        regenerator: true,
      },
    ],
  ];

  if (env === 'test') {
    return {
      presets: [
        // ES features necessary for user's Node version
        [
          require('babel-preset-env').default,
          {
            targets: {
              node: 'current',
            },
          },
        ]
      ],
      plugins: plugins.concat([
        // Compiles import() to a deferred require()
        require.resolve('babel-plugin-dynamic-import-node'),
      ]),
    };
  } else {
    return {
      presets: [
        // Latest stable ECMAScript features
        [
          require.resolve('babel-preset-env'),
          {
            targets: {
              // React parses on ie 9, so we should too
              ie: 9,
              // We currently minify with uglify
              // Remove after https://github.com/mishoo/UglifyJS2/issues/448
              uglify: true,
            },
            // Disable polyfill transforms
            useBuiltIns: false,
            // Do not transform modules to CJS
            modules: false,
          },
        ]
      ],
      plugins: plugins.concat([
        // function* () { yield 42; yield 43; }
        [
          require.resolve('babel-plugin-transform-regenerator'),
          {
            // Async functions are converted to generators by babel-preset-env
            async: false,
          },
        ],
        // Adds syntax support for import()
        require.resolve('babel-plugin-syntax-dynamic-import'),
      ]),
    };

    if (env === 'production') {
      // Optimization: hoist JSX that never changes out of render()
      // Disabled because of issues: https://github.com/facebookincubator/create-react-app/issues/553
      // TODO: Enable again when these issues are resolved.
      // plugins.push.apply(plugins, [
      //   require.resolve('babel-plugin-transform-react-constant-elements')
      // ]);
    }
  }
};

module.exports = create();