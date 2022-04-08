/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-08 11:47:26
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-08 11:48:01
 */
export function createComponentInstance(vnode,container){
  const component = {
    vnode
  }
  return component;
}

export function setupComponent(instance,container){
  //TODO initProps
  //TODO initSlots

  setupStatefulComponent(instance,container);
}

function setupStatefulComponent(instance,container){
  const Component = instance.vnode.type;
  const {setup} = Component;
  if(setup){
    const setupResult = setup();
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
  const Component = instance.vnode.type;
  if(Component.render){
    instance.render = Component.render;
  }
}