/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-08 11:28:19
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-11 15:32:51
 */
import { ShapeFlags } from "../shared/ShapeFlags";
export function createVNode(type,props?,children?){
  const vnode = {
    type,
    props,
    children,
    shapeFlags:getShapeFlags(type),
    el:null
  }
  if(typeof children === 'string'){
    vnode.shapeFlags = vnode.shapeFlags | ShapeFlags.TEXT_CHILDREN;
  }else if(Array.isArray(children)){
    vnode.shapeFlags = vnode.shapeFlags | ShapeFlags.ARRAY_CHILDREN;
  }
  return vnode;
}

function getShapeFlags(type){
  return typeof type === 'string' ? ShapeFlags.ELEMENT :ShapeFlags.STATEFUL_COMPONENT;
}