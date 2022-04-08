/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-08 11:28:19
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-08 11:29:07
 */
export function createVNode(type,props?,children?){
  const vnode = {
    type,
    props,
    children
  }
  return vnode;
}