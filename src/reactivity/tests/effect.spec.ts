/*
 * @Descripttion: 使用reactivity库的核心：创建了一个响应式对象user，用effect进行包裹，当我们的响应式制的值发生改变了，我们这边的值也会自动去更新
 * @Author: suanmei
 * @Date: 2022-03-14 16:44:28
 * @LastEditors: suanmei
 * @LastEditTime: 2022-03-20 21:31:52
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
  //obj.prop = 3; set
  obj.prop++;//obj.prop = obj.prop+1 get set因为这里又触发了get收集了依赖，导致dummy会变为3，所以需要做下边缘case处理
  /*解决：可以在去触发track动作的时候，加一个变量shouldTrack控制它应不应该收集依赖。思考一下shouldTrack该什么时候赋值呢？
  *当调用set的时候又会重新执行这个fn，又重新触发了响应式对象它的get操作，所以呢这个时候它是给他收集起来的。所以应该在class ReactiveEffect里的run的时候做一下处理
  */
  expect(dummy).toBe(2);

  //stopped effect should still be manually callable
  runner();
  expect(dummy).toBe(3);
})

it("onStop",()=>{
  /**
   * 和stop相关的功能。通过第二个参数给到它(effect)，当用户去调用stop之后，传入的onStop(第二个参数)会被执行。也就是调用stop之后的回调函数，允许用户在这边去做一些额外的处理。(和之前的scheduler差不多)
   */
  const obj = reactive({
    foo:1
  });
  const onStop = jest.fn();
  let dummy;
  const runner = effect(
    ()=>{
      dummy = obj.prop;
    },
    {
      onStop
    }
  );
  stop(runner);
  expect(onStop).toBeCalledTimes(1);
})