/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-11 15:20:14
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-11 16:25:08
 */
// 基于这个判断当前vnode和children是什么类型，在vnode中通过|连接type和children初始化vnode.shapeFlag，在render中通过&连接vnode.shapeFlag和ShapeFlags中的类型判断是type是component还是element,children是text还是array
export const enum ShapeFlags{
  ELEMENT = 1,//0001
  STATEFUL_COMPONENT = 1 << 1,//0010(1往左移1位)
  TEXT_CHILDREN = 1 << 2,//0100(1往左移2位)
  ARRAY_CHILDREN = 1 << 3//1000(1往左移3位)
}
