/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-17 12:37:28
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-17 12:50:19
 */
import {h,getCurrentInstance} from '../../../lib/guide-mini-vue.esm.js';
import {Foo} from './Foo.js';

export const App = {
  name:"App",
  render(){
    return h("div",{},[h("p",{},"currentInstance demo"),h(Foo)]);
  },
 setup(){
   //返回当前App组件的实例对象
   //这个instance后续再去写业务逻辑的时候，可以基于它上面的数据来做不同的处理，比如获取到vnode.type做不同的处理。通过这种方式我们可以访问到当前组件实例上的一些数据。
   const instance = getCurrentInstance();
   console.log("App",instance);
 }
};