/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-03-14 17:01:13
 * @LastEditors: suanmei
 * @LastEditTime: 2022-03-14 17:10:41
 */
import {reactive} from '../reactive'
describe("reactive",()=>{
  it('happy path',()=>{
    const original = {foo:1};
    const observed = reactive(original);
    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);
  })
})