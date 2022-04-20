/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-20 14:13:11
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-20 14:15:45
 */
import {h} from '../../../lib/guide-mini-vue.esm.js'//因为这是利用浏览器的esm,他不会自动补全，所以要自己写完整
export const App = {
  setup(){
    return {
      x:100,
      y:100
    }
  },
  render(){
    return h('rect',{x:this.x,y:this.y})
  }
}