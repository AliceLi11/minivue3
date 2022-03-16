/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-03-14 17:04:04
 * @LastEditors: suanmei
 * @LastEditTime: 2022-03-15 12:49:45
 */
/**
 * Reflect.get方法查找并返回target对象的name属性，如果没有该属性，则返回undefined。
 * Reflect.set方法设置target对象的name属性等于value。
 */
import {track,trigger} from './effect'
export function reactive(raw){
  return new Proxy(raw,{
    get(target,key){
      const res = Reflect.get(target,key);

      //TODO 依赖收集
      track(target,key);
      return res;
    },
    set(target,key,value){
      const res = Reflect.set(target,key,value);

      //TODO 触发依赖
      trigger(target,key);
      return res;
    }
  })
}