import { h,renderSlot } from "../../../lib/guide-mini-vue.esm.js"

/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-11 23:15:43
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-14 23:01:14
 */
/**实现功能：
 * 1.基础的插槽，父组件中的children能在子组件显示(处理成用户可传单值vnode或数组都可)
 * 2.在原先的基础上实现具名插槽（通过key获取到对应的value，在想要的位置显示想要的内容）
 * 3.在原先的基础上实现作用域插槽(把value处理成函数，并接受参数，在子组件中直接拿到value的时候调用函数并传入相应的参数(可选),即实现了把Foo组件内部的变量传出去的效果)
 * 4.最后注意不是所有的组件不是都会有children，比如这里一开始的根组件App，所以不应该也进入initSlots，所以需要检测是否需要slots处理。(实现：给当前的vnode加一个Flag，叫做SLOT_CHILDREN（组件+children是object）)
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