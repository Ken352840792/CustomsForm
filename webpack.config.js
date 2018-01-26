var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var componentType='JqueryMobile';
var path = require('path');
 
module.exports = {
    entry: __dirname+'/js/Component/'+componentType+'/CustomFrom.js',
    output: {
        path: __dirname+'/built',
        //path:'D:\\项目\\NewProject\\Sy.UI\\Areas\\App\\Scripts',
        filename: 'bundle.js'
    }, 
    // plugins:[
    //     // 每个成员代表一个插件
    //     new UglifyJsPlugin()
    // ],
    module: {    
        loaders: [{    
            test: /\.js$/,    
            exclude: /node_modules/,    
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            } 
        }]    
    }    
};