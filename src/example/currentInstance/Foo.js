/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-17 12:38:32
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-17 12:50:43
 */
import {h,getCurrentInstance} from '../../../lib/guide-mini-vue.esm.js';
export const Foo = {
  name:"Foo",
  setup(){
    //返回当前Foo组件的实例对象
    const instance = getCurrentInstance();
    console.log("Foo",instance);
  },
  render(){
    return h('div',{},"foo");
  }
}