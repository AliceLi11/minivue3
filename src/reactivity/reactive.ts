/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-03-14 17:04:04
 * @LastEditors: suanmei
 * @LastEditTime: 2022-03-19 23:53:47
 */

import { mutableHandlers,readonlyHandlers } from "./baseHandlers";
//return new Proxy(...)被称为低代码，可以利用函数来封装一下，来表达出它想要表达的意图，使代码变得可读性更高
function createActiveObject(raw:any,baseHandlers){
  return new Proxy(raw,baseHandlers)
}
export function reactive(raw){
  return createActiveObject(raw,mutableHandlers)
}

export function readonly(raw){
  return createActiveObject(raw,readonlyHandlers)
}