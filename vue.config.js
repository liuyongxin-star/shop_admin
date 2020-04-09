const CompressionPlugin = require('compression-webpack-plugin')
const Timestamp = new Date().getTime();//获取时间戳
module.exports = {
    configureWebpack: {
        devtool: 'source-map'
      },
    publicPath: './',
    assetsDir: 'static',
    outputDir: 'dist',
    devServer: {
        https: false,
        open: true, // 自动开启浏览器
        compress: true, // 开启压缩
        overlay: {
            warnings: true,
            errors: true
        },
        proxy: {
          [process.env.VUE_APP_BASE_API]: {
            target: process.env.VUE_APP_SERVICE_URL,
            changeOrigin: true,
            ws: true,
            secure: false,
            pathRewrite: {
              ['^' + process.env.VUE_APP_BASE_API]: ''
            }
          }
        }
    },
    configureWebpack: {//这里是添加的部分
        externals:{
          'vue': 'Vue',
          'vue-router': 'VueRouter',
          'vuex': 'Vuex',
          'element-ui': 'ELEMENT',
          'axios': 'axios',
        },
        output: { // 输出重构  打包编译后的 文件名称  【添加 =》模块名称.版本号.时间戳】
            filename: `[name].${process.env.VUE_APP_Version}.${Timestamp}.js`,
            chunkFilename: `[name].${process.env.VUE_APP_Version}.${Timestamp}.js`
          },
        devtool:'source-map' //debug for chrome
      },   
    chainWebpack: (config) => {   
     config.plugins.delete('prefetch')
  
        /* 添加分析工具*/
        if (process.env.NODE_ENV === 'production') {
            if (process.env.npm_config_report) {
                config
                    .plugin('webpack-bundle-analyzer')
                    .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin).end();
                config.plugins.delete('prefetch')
            }
            config.mode = 'production'
            return {
                plugins: [new CompressionPlugin({
                    test: /.js$|.html$|.css/, //匹配文件名
                    threshold: 10240, //对超过10k的数据进行压缩
                    deleteOriginalAssets: false //是否删除原文件
                })]
            }
        }
    },
    productionSourceMap: false, //不生成.map文件
}