/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-07 17:41:45
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-13 14:31:41
 */
/**
 * 1.template最终也会被编译成render函数，所以template就需要编译器
 * 2.h函数即createVNode函数作用：创建VNode
 */
import {h} from '../../../lib/guide-mini-vue.esm.js';
import {Foo} from './Foo.js'
window.self = null;
export const App = {
  name:"App",
  render(){
    window.self = this;
    return h('div',
    {
      id:"root",
      class:["red","blue"],
      /*完成注册事件功能（暂时隐藏）
      onClick(){
        console.log("click");
      },
      onMousedown(){
        console.log("mousedown");
      }
      */
    },
    [
      h('div',{},'hi,'+this.msg),
      h(Foo,{
        count:1,
        onAdd(a,b){
          console.log("onAdd",a,b);
        },
        onAddFoo(){
          console.log("onAddFoo");
        }
      })
    ]
   /* [
      h("p",{class:"red"},"hi"),
      h("p",{class:"blue"},"mini-vue"),
      //原先是通过this.setupState.msg获取的
      //现在可以通过this.msg获取是因为在instance上初始化了一个代理，触发get里面如果是setupState里的属性，返回的setupState[key]，并把proxy绑定到了render的this上
      // h("p",{},this.setupState.msg),
      h("p",{},this.msg)
    ]*/
    );
  },
  setup(){
    return {
      msg:"你好呀！"
    }
  }
}