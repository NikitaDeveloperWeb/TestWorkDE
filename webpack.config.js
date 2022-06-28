const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// vars
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const PATHS = {
  src: path.join(__dirname, './src'),
  dist: path.join(__dirname, './dist'),
};

const PAGES_DIR = `${PATHS.src}/pug/pages/`;
const PAGES = fs.readdirSync(PAGES_DIR).filter((fileName) => fileName.endsWith('.pug'));
const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);
// optimization
const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };
  if (isProd) {
    config.minimizer = [new OptimizeCssAssetsWebpackPlugin(), new TerserWebpackPlugin()];
  }
  return config;
};
// css loaders
const cssLoader = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {},
    },
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            [
              'autoprefixer',
              {
                sourceMap: true,
                config: { path: `./postcss.config.js` },
              },
            ],
          ],
        },
      },
    },
  ]; //rigth to left
  if (extra) {
    loaders.push(extra);
  }
  return loaders;
};
module.exports = {
  mode: 'development',
  optimization: optimization(),
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, './dist'),
    },
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },
  devtool: isDev ? 'source-map' : '',
  entry: {
    main: path.resolve(__dirname, './src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({ filename: filename('.css') }),
    new CopyWebpackPlugin({
      patterns: [],
    }),
    ...PAGES.map(
      (page) =>
        new HtmlWebpackPlugin({
          template: `${PAGES_DIR}/${page}`,
          filename: `./${page.replace(/\.pug/, '.html')}`,
        }),
    ),
  ],
  module: {
    rules: [
      // JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      // img
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      // шрифты и SVG
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },

      // CSS, Sass
      //styles
      {
        test: /\.css$/,
        use: cssLoader(),
      },
      // pug
      {
        test: /\.pug$/,
        use: ['pug-loader'],
      },
      {
        test: /\.scss$/,
        use: cssLoader('sass-loader'),
      },
    ],
  },
};
