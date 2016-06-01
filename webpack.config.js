'use strict';


module.exports = {
  //main entry point
  entry: ['./app/src/index.js', './app/src/services/auth/index.js'],

  // output configuration
  output: {
    path: __dirname + '/build/',
    publicPath: 'build/',
    filename: 'build.js'
  },

  module: {
    loaders: [
      // process *.vue files using the Vue loader
      { test: /\.vue$/, loader: 'vue' },

      // process *.js files using babel loader
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },

      // process image files using the file loader
      { test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/, loader: 'file' }
    ]
  },

  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  }
}
