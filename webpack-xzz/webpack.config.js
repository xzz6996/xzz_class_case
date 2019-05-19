const path = require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const CleanWebpackPlugin=require('clean-webpack-plugin');

module.exports={
    //entry:"./src/index.js",
    entry:{
        app:"./src/index.js",
        //print:"./src/print.js"
    },
    output:{
        path:path.resolve(__dirname,"dist"),
        filename:"[name].bundle.js"
    },
    devtool: 'inline-source-map',
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude:/nodule_modules/,
                use:{
                    loader:"babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test:/\.css$/,
                use:["style-loader","css-loader"]
            },
            {
                test:/\.(png|jpg|svg|gif)$/,
                use:["file-loader"]
            },    
            {
                test:/\.(woff|woff2|eot|ttf|otf)$/,
                use:["file-loader"]
            }
        ]
    },
    devServer:{
        contentBase: './dist',
        hot: true
    },
    plugins:[
        new HtmlWebpackPlugin({
            title:"webpck is everyone Go",
            template:"index.html"
        }),
        new CleanWebpackPlugin()
    ]
}   