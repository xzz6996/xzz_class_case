1   vue-cli 配置webpack去除console输出日志
    build.prod.js 
    new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: config.build.productionSourceMap,
        uglifyOptions: {
          warnings: false,
          compress: {
            warnings: false,
            drop_debugger: true, //自动删除debugger
            drop_console: true //自动删除console.log
          },
        }, 
      })