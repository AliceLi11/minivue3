/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-08 15:10:46
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-08 15:13:23
 */
//创建h
import { createVNode } from "./vnode";
export function h(type,props?,children?){
  return createVNode(type,props,children);
}