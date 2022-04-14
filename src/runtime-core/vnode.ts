/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-08 11:28:19
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-14 22:53:49
 */
import { ShapeFlags } from "../shared/ShapeFlags";
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