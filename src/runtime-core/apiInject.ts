import { getCurrentInstance } from "./component";

/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-17 18:24:58
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-17 23:57:02
 */
export function provide(key,value){
  //存
  const currentInstance = getCurrentInstance();
  if(currentInstance){
    let {provides} = currentInstance;
    const parentProvides = currentInstance.parent.provides;
     //init 时机：因为createComponentInstance中provides:parent?parent.provides:{},所以provides === parentProvides
    //重写当前实例的provides，其原型指向它的父级的provides。注意只能执行一次，在初始化的时候，不然setup中有2个provide,就会调用2次，使provides以原型创建后一直是{}，所以会覆盖,provides最终都是当前组件里最后一次调用时赋的值。
    if(provides === parentProvides){
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}

export function inject(key,defaultValue){
  //取
  const currentInstance = getCurrentInstance();
  if(currentInstance){
    const parentProvides = currentInstance.parent.provides;
    if(key in parentProvides){
      return parentProvides[key];
    }else if(defaultValue){
      if(typeof defaultValue === 'function'){
        return defaultValue();
      }
      return defaultValue;
    }
  }
}