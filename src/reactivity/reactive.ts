/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-03-14 17:04:04
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-12 10:33:07
 */

import { isObject } from "../shared/index";
import { mutableHandlers,readonlyHandlers,shallowReadonlyHandlers } from "./baseHandlers";

export const enum ReactiveFlags{
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY="__v_isReadonly"
}
//return new Proxy(...)被称为低代码，可以利用函数来封装一下，来表达出它想要表达的意图，使代码变得可读性更高
function createReactiveObject(target,baseHandlers){
  if(!isObject(target)){
    console.warn(`target ${target}必须是一个对象`)
    return target;
  }
  return new Proxy(target,baseHandlers)
}
export function reactive(raw){
  return createReactiveObject(raw,mutableHandlers)
}

export function readonly(raw){
  return createReactiveObject(raw,readonlyHandlers)
}


export function shallowReadonly(raw){
  return createReactiveObject(raw,shallowReadonlyHandlers);
}


/**检查对象是否是由 `reactive` 或 `readonly` 创建的 proxy */
export function isProxy(value){
  return isReactive(value) || isReadonly(value);
}

export function isReactive(value){
  return !!value[ReactiveFlags.IS_REACTIVE];
}
export function isReadonly(value){
  return !!value[ReactiveFlags.IS_READONLY];
}
