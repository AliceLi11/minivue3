/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-14 14:48:01
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-14 17:54:22
 */
import {h} from '../../../lib/guide-mini-vue.esm.js';
import {Foo} from './Foo.js'
export const App = {
  name:"App",
  render(){
    const app = h('div',{},'App');
    //children 单值vnode
    // const foo = h(Foo,{},h('p',{},'123'));
    //children 数组 兼容的做法：需要去initSlots中处理判断是否为数组，不是数组就处理成数组。在Foo子组件中再在children中为div，把slots中的数据放在div里面
    // const foo = h(Foo,{},[h('p',{},'123'),h('p',{},'456')]);
    //需要处理成具名的时候，数组就不适用了，用对象数据结构，通过key精确取到数据，这个时候还是要在initSlot中把key对应的数据既要传过去的vnode处理成数组(上一步的兼容做法)
    // const foo = h(Foo,{},{
    //   "header":h('p',{},"header"),
    //   "footer":h('p',{},'footer')
    // })
    //需要处理成作用域插槽，就需要把一个个value处理成函数，并接受参数，在子组件中直接拿到value的时候调用函数并传入相应的参数(可选)，即实现了把Foo组件内部的变量传出去的效果
    const foo = h(Foo,{},{
      "header":({age})=>h('p',{},"header"+age),
      "footer":()=>h('p',{},'footer')
    })
    return h('div',{},[app,foo]);
  },
  setup(){
    return {

    }
  }
}