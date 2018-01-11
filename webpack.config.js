var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var componentType='JqueryMobile';
module.exports = {
    entry: __dirname+'/js/Component/'+componentType+'/CustomFrom.js',
    output: {
        path: __dirname+'/built',
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