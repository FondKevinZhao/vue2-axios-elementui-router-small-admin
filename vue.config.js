module.exports = {
  lintOnSave: false,
  devServer: {
    // 指定运行的端口号
    port: 3000,
    // 自动打开浏览器
    open: true,
    // 解决接口跨域
    proxy: 'https://www.escook.cn'
  }
}