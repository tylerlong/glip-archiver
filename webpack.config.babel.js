import HtmlWebpackPlugin from 'html-webpack-plugin'
import { HotModuleReplacementPlugin, DefinePlugin } from 'webpack'
import dotenv from 'dotenv-override-true'
import path from 'path'

// dotenv.config({ path: path.join(__dirname, '.env') })
// console.log(dotenv.parsed)

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
      'process.env': JSON.stringify(dotenv.config({ path: path.join(__dirname, '.env') }).parsed)
    })
  ]
}

export default [mainConfig]
