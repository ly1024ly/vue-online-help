require("babel-polyfill");
var path = require("path");
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var FaviconsWebpackPlugin = require('favicons-webpack-plugin');
module.exports = {
  entry:{
    app:["babel-polyfill","./src/main.js"],
    index:["babel-polyfill","./src/index.js"]
  },//入口文件
  output:{
    path:path.join(__dirname,"dist"),//输出的目录
    publicPath:'/dist/',
    filename:'js/[name].js',
    chunkFilename:'js/[id].chunk.js'
    //filename: 'bundle.js'//输出的文件名称
  },
  devServer:{
    contentBase:path.resolve(__dirname,"dist"),
    host:"localhost",
    port:3001,
    compress:true
  },
  devtool:"source-map",//便于调试，相当于命令行中 webpack --devtool source-map
  module: {//依赖的模块
        rules: [//模块、规则，如果在webpack旧版本中用的不是rules。用的是loaders
        {
            test: /\.vue$/,
            exclude: /node_modules/,
            loader: 'vue-loader'
        },
        {
            test: /\.js$/,
          exclude: /node_modules/,
            loader: 'babel-loader'
        },
        { 
           test: /\.css$/, 
           use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
           
          },
          {
            test: /\.less$/,
            exclude: /node_modules/,
            loader: 'style-loader!css-loader!less-loader'
        },
        {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
        },
        {//背景图片
          test:/\.(jpg|png|gif)$/,
          loader:"url-loader?limit=1024&name=img/[hash].[ext]"
        },
        {//字体文件
          test:/\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
          loader:'file-loader?name=fonts/[name].[ext]'
        }
  
        ]
   },
   plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
      new ExtractTextPlugin("css/[name].css"),
      new HtmlWebpackPlugin({
        favicon:'./src/img/favicon.ico',
        filename:'./view/home.html',
        template:'./home.html',
        hash:true,
        inject: 'body', 
        chunks:['app'],
        minify:{
          removeComments:true,
          collapseWhitespace:false       
        }
      }),
      new HtmlWebpackPlugin({
        filename:'./index.html',
        template:'./index.html',
        hash:true,
        inject: 'body', 
        chunks:['index'],
        minify:{
          removeComments:true,
          collapseWhitespace:false       
        }
      }),
   ],
   resolve: {  
        alias: {  
            'vue': 'vue/dist/vue.js'  
        }  
    }
}
