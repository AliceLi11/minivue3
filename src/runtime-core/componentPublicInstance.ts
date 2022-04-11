/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-11 14:32:20
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-11 14:56:18
 */
//$el作为key和对应的函数，后续只需要检测对应的key在不在这个map里面，如果在调用相应的函数，以后的扩展点只需要在map里面加key和对应的value
const publicPropertiesMap = {
  $el:(i)=>i.vnode.el
}
export const PublicInstanceProxyHandlers = {
  get({_:instance},key){
    //从setupState里取值
    const {setupState} = instance;
    if(key in setupState){
      return setupState[key];
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