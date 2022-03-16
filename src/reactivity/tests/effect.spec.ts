/*
 * @Descripttion: 使用reactivity库的核心：创建了一个响应式对象user，用effect进行包裹，当我们的响应式制的值发生改变了，我们这边的值也会自动去更新
 * @Author: suanmei
 * @Date: 2022-03-14 16:44:28
 * @LastEditors: suanmei
 * @LastEditTime: 2022-03-15 11:27:40
 */
import {reactive} from '../reactive'
import {effect} from '../effect'
describe('effect',()=>{
  it('happy path',()=>{
     //init
    const user = reactive({
      age:10
    })

    let nextAge;
    effect(()=>{
      nextAge = user.age+1;//当它触发get的时候，它会收集依赖
    });
    
    expect(nextAge).toBe(11);

    //update
    user.age++;//当它触发set的时候，它会触发依赖
    expect(nextAge).toBe(12);
  })
})

it('should return runner when call effect',()=>{
  //1.effect -> function(runner) -> fn ->return
  let foo = 10;
  const runner = effect(()=>{
    foo++;
    return 'foo';
  })

  expect(foo).toBe(11);
  const r = runner();
  expect(foo).toBe(12);
  expect(r).toBe("foo");
})