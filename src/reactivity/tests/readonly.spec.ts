/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-03-19 23:24:56
 * @LastEditors: suanmei
 * @LastEditTime: 2022-03-26 18:56:21
 */
import {readonly,isReadonly,isProxy} from '../reactive'
describe("readonly",()=>{
  /**
   * 其实和reactive没什么区别，但是它not set，不可以被更改只能读，即不可以触发依赖即不用做依赖收集。
   */
  it("happy path",()=>{
    //not set
    const original = {foo:1,bar:{baz:2}};
    const wrapped = readonly(original)//其实就是reactive功能的只读方法
    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1)

    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(original)).toBe(false);

    expect(isReadonly(wrapped.bar)).toBe(true);
    expect(isReadonly(original.bar)).toBe(false);

    expect(isProxy(wrapped)).toBe(true);
  }),
  it("warn when call set",()=>{
    console.warn = jest.fn();
    const foo = readonly({
      age:10
    })
    foo.age = 11;
    expect(console.warn).toBeCalled()
  })
})