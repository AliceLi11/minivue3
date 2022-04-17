import { h,provide,inject } from "../../../lib/guide-mini-vue.esm.js";

/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-17 18:13:47
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-18 00:05:49
 */
const Provider = {
  name:"Provider",
  setup(){
    provide('foo','fooVal'),
    provide('bar','barVal')
  },
  render(){
    return h('div',{},[h('p',{},"Provider"),h(ProviderTwo)])
  }
}

const ProviderTwo = {
  name:"ProviderTwo",
  setup(){
    provide("foo","fooTwo");
    const foo = inject("foo");
    return {
      foo
    }
  },
  render(){
    return h("div",{},[h("p",{},`ProviderTwo-${this.foo}`),h(Consumer)])
  }
}

const Consumer = {
  name:"Consumer",
  setup(){
    //Consumer组件取到的foo是ProviderTwo中设置的foo,bar取到的是Provider中设置的bar（在写provide方法的时候用到了原型链的思想）
    const foo = inject('foo');
    const bar = inject('bar');
    //用户通过inject去取baz，而baz没有对应的父级组件去提供。这时候用户希望我可以给它一个默认值（可以直接是一个字符串，也可以是一个函数）
    const baz = inject("baz","bazDefault");
    const baz2 = inject("baz",()=>"bazDefault");
    return {
      foo,
      bar,
      baz,
      baz2
    }
  },
  render(){
    return h("div",{},`Consumer: - ${this.foo} - ${this.bar} - ${this.baz} - ${this.baz2}`);
  }
}

export default{
  name:"App",
  setup(){
  },
  render(){
    return h('div',{},[h('p',{},'apiInject'),h(Provider)]);
  }
}