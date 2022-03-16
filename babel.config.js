/*
 * @Descripttion:
 * @Author: suanmei
 * @Date: 2022-03-14 16:30:32
 * @LastEditors: suanmei
 * @LastEditTime: 2022-03-14 16:38:22
 */
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}], //告诉vue以我当前node版本为基础作为一个转换
    '@babel/preset-typescript',
  ],
};