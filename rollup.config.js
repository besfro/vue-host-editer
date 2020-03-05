const path = require('path') 
import resolve from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias'
import vuePlugin from 'rollup-plugin-vue'

export default {
  input: 'src/main.js',
  output: {
    name: 'vue-host-editer',
    file: 'dist/vue-host-editer.esm.js',
    format: 'es'
  },
  plugins: [
    alias({
      entries: [
        { find: '@', replacement: path.join(__dirname, 'src') },
      ]
    }),
    resolve({
      mainFields: ['module', 'main', 'browser'],
      extensions: ['.vue', '.js']
    }),
    vuePlugin({
      css: true
    })
  ]
}