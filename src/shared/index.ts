/*
 * @Descripttion: 公共的工具函数
 * @Author: suanmei
 * @Date: 2022-03-17 15:35:39
 * @LastEditors: suanmei
 * @LastEditTime: 2022-03-27 16:44:38
 */

//命名extend，可读性
export const extend = Object.assign;

//判断type是不是object类型
export const isObject = (val) =>{
  return val !== null && typeof(val) === 'object'
}

//判断两个值是否为同一个值抽离出来
export const hasChanged = (val,newVal)=>{
  return !Object.is(val,newVal);
}