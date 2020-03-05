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
  chainWebpack: config => {
    if(process.argv.indexOf('--esm') !== -1) {
      config.module
        .rule('js')
        .uses.delete('babel-loader')
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}