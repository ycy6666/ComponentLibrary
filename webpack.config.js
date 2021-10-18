//用于运行test测试
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin'); //
const HtmlWebpackPluginConfig = {
  title: 'train',
  filename: path.resolve(__dirname, './test/index.html'),
  template: './test/index.html',
  inject: true
}
module.exports = {
  entry: './test/index.jsx',
  output: {
    path: path.resolve(__dirname, './test'),
    filename: 'bundle.js'
  },
  plugins: [new HtmlWebpackPlugin(HtmlWebpackPluginConfig)], 
  devServer: {
    contentBase: path.resolve(__dirname, "./test"),
    port: 9000,
    hot: true,
    open: true,
    index: 'index.html',
  },
  resolve: {
    extensions: ['.ts','.tsx','.js', '.jsx','.json']
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitWarning: true, // 控制台输出warning
          emitError: true, // 控制台输出error
          fix: true // 是否自动修复
        }
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,//一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
        exclude: /node_modules/,//屏蔽不需要处理的文件（文件夹）（可选）
        loader: 'babel-loader',//loader的名称（必须）
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader', // 创建 <style></style>
          },
          {
            loader: 'css-loader',  // 转换css
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader', // 编译 Less -> CSS
          },
        ],
      },
    ]
  }
}