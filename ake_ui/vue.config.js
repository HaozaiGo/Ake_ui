/*
 * @Author: xiaoHao
 */
const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  configureWebpack:(config)=>{
    config.devtool='source-map'
  },
  lintOnSave: false,
  pages:{
    index:{
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    }
  },
  chainWebpack:config=>{
    config.resolve.alias.set('~',path.resolve('plugins'))
    config.module.rule('js').include.add(path.resolve('plugins')).end().use('babel').loader('babel-loader')
  },
  
  transpileDependencies: true
})
