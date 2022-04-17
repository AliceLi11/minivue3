/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-08 11:28:19
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-17 12:08:52
 */
import { ShapeFlags } from "../shared/ShapeFlags";

//Symbol保证每个属性的名字都是独一无二的，这样就从根本上防止属性名的冲突
export const Fragment = Symbol("Fragment")
export const Text = Symbol("Text")

export function createVNode(type,props?,children?){
  const vnode = {
    type,
    props,
    children,
    shapeFlag:getShapeFlags(type),
    el:null
  }
  if(typeof children === 'string'){
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  }else if(Array.isArray(children)){
    vnode.shapeFlag |=  ShapeFlags.ARRAY_CHILDREN;
  }
  //SLOT_CHILDREN:组件+children是object
  if(vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
    if(typeof children === 'object'){
      vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN;
    }
  }

  return vnode;
}

function getShapeFlags(type){
  return typeof type === 'string' ? ShapeFlags.ELEMENT :ShapeFlags.STATEFUL_COMPONENT;
}

export function createTextVNode(text:string){
  return createVNode(Text,{},text)
}