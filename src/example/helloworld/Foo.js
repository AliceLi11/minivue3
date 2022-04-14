import { h } from "../../../lib/guide-mini-vue.esm.js"

/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-11 23:15:43
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-14 18:14:28
 */
/**完成以下功能：
 * 1.props可以通过setup传入过来
 * 2.Foo.js中的render可以通过this来访问到props中的count
 * 3.props是不可以被修改的,readonly的响应式对象。
 * 4.最后注意不是所有的组件不是都会有children，比如这里一开始的根组件App，所以不应该也进入initSlots，所以需要检测是否需要slots处理。实现：给当前的vnode加一个Flag，叫做SLOT_CHILDREN（组件+children是object）
 */
export const Foo = {
  name:'Foo',
  render(){
    const btn = h('button',{onClick:this.emitAdd},"emitAdd");
    const p = h('div',{},"foo: " + this.count);
    return h('div',{},[btn,p]);
  },
  setup(props,{emit}){
    //props.count
    console.log(props)

    //readonly
    props.count++;
    console.log(props);
    const emitAdd = ()=>{
      console.log('emit add');
      emit("add",1,2);
      emit("add-foo");
    }
    return {
      emitAdd
    }
  }
}