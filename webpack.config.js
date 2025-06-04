
module.exports = {
  // ... otras configuraciones
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules\/docx-preview/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  },
};