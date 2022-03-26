/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-03-26 18:31:46
 * @LastEditors: suanmei
 * @LastEditTime: 2022-03-26 18:41:43
 */
import {shallowReadonly} from '../reactive'
describe("shallowReadonly",()=>{
  /**shallow是表层的意思，结合起来表层是readonly,而嵌套的object是普通的。 */
  test("should not make none-reactive properties reactive",()=>{
    const props = shallowReadonly({n:{foo:1}})；
  })

  it("should call console.warn when set",()=>{
    console.warn = jest.fn();
    const user = shallowReadonly({
      age:10
    })
    user.age = 1;;
    expect(console.warn).toHaveBeenCalled();
  })
})