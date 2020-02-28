/*
 * @Description: 
 * @Author: clc
 * @Date: 2019-12-03 10:54:06
 * @LastEditors: clc
 * @LastEditTime: 2019-12-04 18:21:54
 */

const path = require('path') 
const resolve = dir => path.join(__dirname, dir)

module.exports = {
  outputDir: 'dist',
  publicPath: '',
  productionSourceMap: false,
  css: {
    extract: false
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}