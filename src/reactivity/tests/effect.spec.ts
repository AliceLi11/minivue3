/*
 * @Descripttion: 使用reactivity库的核心：创建了一个响应式对象user，用effect进行包裹，当我们的响应式制的值发生改变了，我们这边的值也会自动去更新
 * @Author: suanmei
 * @Date: 2022-03-14 16:44:28
 * @LastEditors: suanmei
 * @LastEditTime: 2022-03-16 17:18:36
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

it('scheduler',()=>{
  /*实现功能：
    1. 通过 effect 的第二个参数给定的一个 scheduler 的 fn
    2. effect 第一次执行的时候 还会执行 fn（effect的第一个参数）
    3. 当响应式对象 set update的时候不会执行fn 而是执行 scheduler
    4. 如果说当执行 runner的时候，会再次的执行fn（effect的第一个参数）
*/
  let dummy;
  let run:any;
  const scheduler = jest.fn(()=>{
    run = runner;
  });
  const obj = reactive({foo:1});
  const runner = effect(
    ()=>{
      dummy = obj.foo;
    },
    {scheduler}
  )
  expect(scheduler).not.toHaveBeenCalled();//scheduler这个函数一开始不会被调用
  expect(dummy).toBe(1);
  //should be called on first trigger
  obj.foo++;
  expect(scheduler).toHaveBeenCalledTimes(1);
  // // should not run yet
  expect(dummy).toBe(1);
  // // manually run
  run();
  // //should have run
  expect(dummy).toBe(2);
  
})