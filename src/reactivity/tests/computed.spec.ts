/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-03-29 13:00:17
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-02 22:02:58
 */
import {computed} from '../computed'
import { reactive } from '../reactive';
describe("computed",()=>{
  it("happy path",()=>{
    const user = reactive({
      age:1
    });
    const age = computed(()=>{
      return user.age;
    })
    expect(age.value).toBe(1);
  })

  it("should compute lazily",()=>{
    const value = reactive({
      foo:1
    });
     //通过jest.fn去创建了一个fn,是因为后续我们需要对这个getter进行验证
    const getter = jest.fn(()=>{
      return value.foo;
    })
    const cValue = computed(getter);

     //lazy
    expect(getter).not.toHaveBeenCalled();

    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    // // // should not compute again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // // //should not compute until needed
    value.foo = 2;//trigger -> effect ->get 重新执行了
    expect(getter).toHaveBeenCalledTimes(1);

    // // // now it should compute
    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);
  })
})