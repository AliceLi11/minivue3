
/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-08 11:24:23
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-08 15:42:05
 */
import { createVNode } from "./vnode";
import { render } from "./renderer";


export function createApp(rootComponent){
  return {
    mount(rootContainer){
      //所有的逻辑操作 都会基于 vnode 做处理
      //component -> vnode
      const vnode = createVNode(rootComponent);
      
      render(vnode,rootContainer);
    }
  }
}