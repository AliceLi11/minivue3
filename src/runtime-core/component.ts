/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-08 11:47:26
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-17 22:58:12
 */
import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";
export function createComponentInstance(vnode,parent){
  console.log("createComponentInstance",parent);//为了安全起见，这里打印一下
  const component = {
    vnode,
    type:vnode.type,
    setupState:{},
    slots:{},
    provides:parent?parent.provides:{},
    parent,
    emit:()=>{}
  }
  component.emit = emit.bind(null,component) as any;
  return component;
}

export function setupComponent(instance,container){
  initProps(instance,instance.vnode.props);
  initSlots(instance,instance.vnode.children)

  setupStatefulComponent(instance,container);
}

function setupStatefulComponent(instance,container){
  const Component = instance.type;
  const {setup} = Component;
   //这个空对象一般叫ctx
   instance.proxy = new Proxy({_:instance},PublicInstanceProxyHandlers)
  if(setup){
    setCurrentInstance(instance)
    const setupResult = setup(shallowReadonly(instance.props),{emit:instance.emit});
    setCurrentInstance(null)
    handleSetupResult(instance,setupResult);
  }
}

function handleSetupResult(instance,setupResult){
  //function =>是组件的render函数
  //object => 注入到当前组件的上下文中，即把值赋值到实例上
  
  //TODO function
  if(typeof setupResult === 'object'){
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance){
  const Component = instance.type;
  if(Component.render){
    instance.render = Component.render;
  }
}

let currentInstance;
export function getCurrentInstance(){
  return currentInstance;
}

export function setCurrentInstance(instance){
  currentInstance = instance;
}