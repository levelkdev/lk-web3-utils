'use strict'

const fs = require('fs')
const rimraf = require('rimraf')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const pkg = require('../package.json')

const bundles = [
  {
    format: 'cjs',
    plugins: [],
    babelPresets: [],
    babelPlugins: [
      'transform-es2015-destructuring',
      'transform-es2015-function-name',
      'transform-es2015-parameters'
    ]
  }
]

let promise = Promise.resolve()

// Clean up the output directory
rimraf('dist/*', () => {
  // Compile source code into a distributable format with Babel and Rollup
  for (const config of bundles) {
    promise = promise.then(() => rollup.rollup({
      entry: 'src/main.js',
      external: Object.keys(pkg.dependencies),
      plugins: [
        babel({
          babelrc: false,
          exclude: 'node_modules/**',
          presets: config.babelPresets,
          plugins: config.babelPlugins
        })
      ].concat(config.plugins)
    }).then(bundle => bundle.write({
      dest: 'dist/main.js',
      format: config.format,
      sourceMap: true
    })))
  }

  promise.catch(err => console.error(err.stack))

})