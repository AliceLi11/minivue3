/*
 * @Descripttion: 公共的工具函数
 * @Author: suanmei
 * @Date: 2022-03-17 15:35:39
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-13 14:41:10
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

//判断val对象里面是否含有key自有属性
export const hasOwn = (val,key) => Object.prototype.hasOwnProperty.call(val,key);

//烤肉串改成驼峰
export const camelize = (str:string)=>{
  return str.replace(/-(\w)/g,(_,c:string)=>{
    return c?c.toUpperCase():"";
  })
}
//开头字母大写
export const captialize = (str:string)=>{
  return str.charAt(0).toUpperCase()+str.slice(1);
};
//处理成onXxx形式
export const toHandlerKey = (str:string)=>{
  return str?"on"+captialize(str):""
}