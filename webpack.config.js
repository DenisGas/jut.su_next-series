const fs = require('fs');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ArchivePlugin = require('./webpack/archivePlugin');
const modifyManifest = require('./webpack/modifyManifest');
const getCopyPatterns = require('./webpack/copyPatterns');

module.exports = (env = {}) => {
  const browserDir = path.resolve(
    __dirname,
    'dist',
    process.env.BROWSER || 'chrome'
  );

  if (!fs.existsSync(browserDir)) {
    fs.mkdirSync(browserDir, { recursive: true });
  }

  const manifest = modifyManifest(process.env.BROWSER || 'chrome');
  const manifestPath = path.resolve(browserDir, 'manifest.json');
  fs.writeFileSync(manifestPath, manifest);

  const shouldClean = env.clean === 'true';

  return {
    mode: process.env.NODE_ENV || 'development',
    entry: {
      background: './src/scripts/background.js',
      settings: './src/scripts/settings.js',
      popup: './src/scripts/popup.js',
      content: './src/scripts/content.js',
    },
    output: {
      path: path.resolve(browserDir, 'scripts'),
      filename: '[name].js',
      clean: shouldClean,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: getCopyPatterns(browserDir, manifestPath),
      }),
      new MiniCssExtractPlugin({
        filename: '../styles/[name].css',
      }),
      new ArchivePlugin(),
    ],
    devtool: 'source-map',
  };
};
