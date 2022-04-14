import { ShapeFlags } from "../shared/ShapeFlags";

/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-14 15:12:05
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-14 22:42:51
 */
export function initSlots(instance,children){
  // instance.slots = Array.isArray(children)?children:[children];
  const {vnode} = instance;
  if(vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN){
    normalizeObjectSlots(children,instance.slots)
  }
}

function normalizeSlotValue(value){
  return Array.isArray(value)?value:[value];
}
function normalizeObjectSlots(children:any,slots:any){
  for(const key in children){
    const value = children[key];
    slots[key] = (props)=>normalizeSlotValue(value(props));
  }
}