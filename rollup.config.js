/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-08 14:03:15
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-08 15:07:14
 */
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'
export default {
  //配置打包入口（整个minivue的出口）
  input:"./src/index.ts",
  //配置出口，可以配置多个，因为库一般会打包几种类型。
  output:[
    //1.cjs ->commonjs规范
    //2.esm ->标准化模块规范
    {
      format:"cjs",
      file:pkg.main
    },
    {
      format:"es",
      file:pkg.module
    }
  ],
  //配置plugins,因为我们这边的代码用ts写的，需要编译一下。@rollup/plugin-typescript
  plugins:[
    typescript()
  ]
};