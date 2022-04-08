/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-07 17:41:45
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-08 16:34:21
 */
/**
 * 1.template最终也会被编译成render函数，所以template就需要编译器
 * 2.h函数即createVNode函数作用：创建VNode
 */
import {h} from '../../../lib/guide-mini-vue.esm.js';
export const App = {
  render(){
    return h('div',
    {
      id:"root",
      class:["red","blue"]
    },
    [h("p",{class:"red"},"hi"),h("p",{class:"blue"},"mini-vue")]);
  },
  setup(){
    return {}
  }
}