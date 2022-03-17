/*
 * @Descripttion: 使用reactivity库的核心：创建了一个响应式对象user，用effect进行包裹，当我们的响应式制的值发生改变了，我们这边的值也会自动去更新
 * @Author: suanmei
 * @Date: 2022-03-14 16:44:28
 * @LastEditors: suanmei
 * @LastEditTime: 2022-03-17 11:53:23
 */
import {reactive} from '../reactive'
import {effect,stop} from '../effect'
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
    2. 当effect 第一次执行的时候 还会执行 fn（effect的第一个参数）
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

it("stop",()=>{
  /**实现功能：
   * 给stop函数传入参数（runner函数），后续更新响应式的值后，值就停止更新了。当调用runner之后，这个值就又会发生更新。
   * （之前当我们触发set，需要去更新的时候，他会遍历收集到的所有effect(trigger函数)。如果不想让他去通知的话，只需要把相应的effect删除掉，即当调用stop的时候，把effect从deps中删除。）
   */
  let dummy;
  const obj = reactive({prop:1});
  const runner = effect(()=>{
    dummy = obj.prop;
  })
  obj.prop = 2;
  expect(dummy).toBe(2);
  stop(runner);
  obj.prop = 3;
  expect(dummy).toBe(2);

  //stopped effect should still be manually callable
  runner();
  expect(dummy).toBe(3);
})