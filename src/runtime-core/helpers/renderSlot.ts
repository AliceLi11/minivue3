import { createVNode } from "../vnode";

/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-14 16:19:35
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-14 18:05:22
 */
export function renderSlot(slots,name,props){
  const slot = slots[name];
  if(typeof slot === 'function'){
    return createVNode('div',{},slot(props));
  }
}