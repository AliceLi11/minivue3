/*
 * @Descripttion: 实现用户传入的基于DOM的接口实现
 * @Author: suanmei
 * @Date: 2022-04-20 10:34:31
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-20 14:18:19
 */

import { createRenderer } from "../runtime-core/index";

function createElement(type){
  console.log("createElement-------------------");
  return document.createElement(type);
}

function patchProp(el,key,val){
  console.log("patchProp-------------------");
  //如果是on开头的，就是事件(匹配on开头，且下一位是大写的字母)
  const isOn = (key:string)=>/^on[A-Z]/.test(key);
  if(isOn(key)){
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event,val);
  }else{
    el.setAttribute(key,val);
  }
}

function insert(el,parent){
  console.log("insert-------------------");
  parent.append(el);
}

const renderer:any = createRenderer({
  createElement,
  patchProp,
  insert
})

export function createApp(...args){
  return renderer.createApp(...args);
}

export * from '../runtime-core/index';