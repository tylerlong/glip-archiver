import HtmlWebpackPlugin from 'html-webpack-plugin'

const mainConfig = {
  target: 'web',
  mode: 'development',
  entry: {
    index: './main.js'
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
}

export default [mainConfig]
