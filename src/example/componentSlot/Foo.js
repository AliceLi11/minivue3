import { h,renderSlot } from "../../../lib/guide-mini-vue.esm.js"

/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-11 23:15:43
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-14 17:49:08
 */
/**实现功能：
 * 1.基础的插槽，父组件中的children能在子组件显示(处理成用户可传单值vnode或数组都可)
 * 2.在原先的基础上实现具名插槽（通过key获取到对应的value，在想要的位置显示想要的内容）
 * 3.在原先的基础上实现作用域插槽
 */
export const Foo = {
  name:'Foo',
  render(){
   const foo = h('p',{},'foo');
   console.log(this.$slots)
   //children->vnode
  // return h('div',{},[foo,this.$slots]);
  // return h('div',{},[foo,h('div',{},this.$slots)])//提取renderSlots函数去处理传过来的slots
    //  return h('div',{},[renderSlot(this.$slots,"header"),foo,renderSlot(this.$slots,"footer")]);//具名插槽
    const age = 18;
    return h('div',{},[renderSlot(this.$slots,"header",{age}),foo,renderSlot(this.$slots,"footer")]);
  },
  setup(){
   return {

   }
  }
}