/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-08 11:28:19
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-11 09:39:37
 */
export function createVNode(type,props?,children?){
  const vnode = {
    type,
    props,
    children,
    el:null
  }
  return vnode;
}