/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-11 14:32:20
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-14 16:12:06
 */

import { hasOwn } from "../shared/index";

//$el作为key和对应的函数，后续只需要检测对应的key在不在这个map里面，如果在调用相应的函数，以后的扩展点只需要在map里面加key和对应的value
const publicPropertiesMap = {
  $el:(i)=>i.vnode.el,
  $slots:(i)=>i.slots
}
export const PublicInstanceProxyHandlers = {
  get({_:instance},key){
    //从setupState里取值
    const {setupState,props} = instance;
    // if(key in setupState){
    //   return setupState[key];
    // }
    if(hasOwn(setupState,key)){
      return setupState[key];
    }else if(hasOwn(props,key)){
      return props[key];
    }
    //key -> $el
    // if(key==='$el'){
    //   return instance.vnode.el;
    // }
    const publicGetter = publicPropertiesMap[key];
    if(publicGetter){
      return publicGetter(instance);
    }
  }
}