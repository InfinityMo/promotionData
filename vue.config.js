module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },
  publicPath: './',
  devServer: {
    open: true,
    compress: true,
    proxy: {
      [process.env.VUE_APP_API]: {
        // target: 'http://172.165.206.60:8000', // Leone
        target: 'http://172.165.206.134:8000',
        pathRewrite: {
          '^/api': ''
        },
        changeOrigin: true,
        logLevel: 'debug'
      }
    }
  }
}
