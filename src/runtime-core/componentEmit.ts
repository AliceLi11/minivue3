
/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-12 14:23:02
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-17 21:55:01
 */
import { camelize, toHandlerKey } from "../shared/index";

export function emit(instance,event,...args){
  console.log("emit",event)

  const {props} = instance;

  const handlerName = toHandlerKey(camelize(event));
  const handler = props[handlerName];
  handler && handler(...args);
}