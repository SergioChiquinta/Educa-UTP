
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules\/docx-preview/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
      {
        test: /pdf\.worker\.min\.js$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[contenthash].[ext]', // opcional, para cache busting
          },
        },
      },
    ],
  },
};
