/*
 * @Description: 
 * @Author: clc
 * @Date: 2019-12-02 15:27:39
 * @LastEditors: clc
 * @LastEditTime: 2019-12-02 15:57:19
 */
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ['import', { libraryName: 'ant-design-vue', libraryDirectory: 'es', style: 'css' }]
  ]
}
