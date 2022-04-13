import { h } from "../../../lib/guide-mini-vue.esm.js"

/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-11 23:15:43
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-13 15:00:04
 */
/**完成以下功能：
 * 1.props可以通过setup传入过来
 * 2.Foo.js中的render可以通过this来访问到props中的count
 * 3.props是不可以被修改的,readonly的响应式对象。
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