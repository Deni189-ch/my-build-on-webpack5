const paths = require('../paths/paths.js')

const { merge } = require('webpack-merge')
const common = require('./common/index')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default

const cssLoader = [
  MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {importLoaders: 1}
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [["postcss-preset-env"]],
      },
    },
  },
  {
    loader: 'sass-loader'
  },
];

module.exports = merge(common, {
  mode: 'production',

  entry: {
    index: {
      import: `${paths.src}/index.js`,
      dependOn: ['react']
    },
    react: ['react', 'react-dom'],
  },

  devtool: false,

  module: {
    rules: [
      {
        test: /\.(c|sa|sc)ss$/i,
        use: cssLoader
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css',
      chunkFilename: '[id].css'
    }),

    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg|webp|ico)$/i
    })
  ],

  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },

  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
})
