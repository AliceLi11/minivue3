
/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-12 14:23:02
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-13 14:58:40
 */
import { camelize, toHandlerKey } from "../shared/index";

export function emit(instance,event,...args){
  debugger;
  console.log("emit",event)

  const {props} = instance;

  const handlerName = toHandlerKey(camelize(event));
  const handler = props[handlerName];
  handler && handler(...args);
}