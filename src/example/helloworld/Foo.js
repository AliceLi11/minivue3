import { h } from "../../../lib/guide-mini-vue.esm.js"

/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-11 23:15:43
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-12 10:17:25
 */
/**完成以下功能：
 * 1.props可以通过setup传入过来
 * 2.Foo.js中的render可以通过this来访问到props中的count
 * 3.props是不可以被修改的,readonly的响应式对象。
 */
export const Foo = {
  render(){
    return h('div',{},"foo: " + this.count)
  },
  setup(props){
    //props.count
    console.log(props)

    //readonly
    props.count++;
    console.log(props);//{count:2}发生了改变
  }
}