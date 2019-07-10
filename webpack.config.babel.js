import HtmlWebpackPlugin from 'html-webpack-plugin'
import { HotModuleReplacementPlugin, DefinePlugin } from 'webpack'
import dotenv from 'dotenv-override-true'
import path from 'path'

const mainConfig = {
  target: 'web',
  mode: 'development',
  entry: {
    index: './index.js'
  },
  output: {
    path: path.join(process.cwd(), 'docs')
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  'targets': [
                    'last 2 Chrome versions'
                  ]
                }
              ],
              '@babel/preset-react'
            ],
            plugins: [
              ['import', { 'libraryName': 'antd', 'libraryDirectory': 'es', 'style': 'css' }] // `style: true` for less
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
