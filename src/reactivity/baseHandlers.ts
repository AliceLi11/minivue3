/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-03-19 23:39:17
 * @LastEditors: suanmei
 * @LastEditTime: 2022-03-23 21:06:08
 */
/**
 * Reflect.get方法查找并返回target对象的name属性，如果没有该属性，则返回undefined。
 * Reflect.set方法设置target对象的name属性等于value。
 */
//代码公共部分抽取+优化
import {track,trigger} from './effect'
import {reactive, ReactiveFlags,readonly} from './reactive'
import {isObject} from '../shared/index'
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

function createGetter(isReadonly=false){
  return function get(target,key){
    const res = Reflect.get(target,key);
    
    if(key===ReactiveFlags.IS_REACTIVE){
      return !isReadonly;
    }else if(key===ReactiveFlags.IS_READONLY){
      return isReadonly;
    }

    if(isObject(res)){
      //看看 res 是不是 object，是的话在这里再次调用相应的方法给他去转换
      return isReadonly?readonly(res):reactive(res);
    }
    
    //TODO 依赖收集
    if(!isReadonly){
      track(target,key);
    }
    return res;
  }
}
function createSetter(){
  return function set(target,key,value){
    const res = Reflect.set(target,key,value);

    //TODO 触发依赖
    trigger(target,key);
    return res;
  }
}

export const mutableHandlers={
  get,
  set
}
export const readonlyHandlers={
  get:readonlyGet,
  set(target,key,value){
    console.warn(`key:${key} set失败 因为target时readonly的`,target)
    return true;
  }
}