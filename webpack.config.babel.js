import HtmlWebpackPlugin from 'html-webpack-plugin'
import { HotModuleReplacementPlugin, DefinePlugin } from 'webpack'
import dotenv from 'dotenv-override-true'

const mainConfig = {
  target: 'web',
  mode: 'development',
  entry: {
    index: './main.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            'presets': [
              [
                '@babel/preset-env',
                {
                  'targets': [
                    'last 2 Chrome versions'
                  ]
                }
              ],
              '@babel/preset-react'
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new HotModuleReplacementPlugin(),
    new DefinePlugin({
      'process.env': JSON.stringify(dotenv.config().parsed)
    })
  ]
}

export default [mainConfig]
