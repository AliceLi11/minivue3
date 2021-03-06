/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-03-26 22:01:18
 * @LastEditors: suanmei
 * @LastEditTime: 2022-03-27 19:57:51
 */
/**
 * ref和reactive的区别是什么?
 * ref过来的都是一个单值，比如说1、true、'1',那这个东西怎么知道它被get了或者set了，用之前的proxy就不行了，因为它只针对于一个对象，而这只是一个值类型。
 * 所以要通过对象来进行包裹(RefImpl类)，类里面可以有个value值、get、set，这样就能知道它是在什么时候会触发get、set。
 * 这两点知道后，我们就能做依赖收集和触发依赖了。其实这个点也是为什么值类型需要用ref进行包裹，为什么我们内部需要.value这样的程序设计(get value(){},set value(){})。
 */
import { effect } from '../effect';
import { reactive } from '../reactive';
import {isRef, proxyRefs, ref, unRef} from '../ref'
describe("ref",()=>{
  it("happy path",()=>{
    /**
     * 通过单元测试来分析，ref返回的应该是个对象，里面有个value值
     */
    const a = ref(1);
    expect(a.value).toBe(1);
  })

  it("should be reactive",()=>{
    /**响应式，依赖收集和触发依赖，并且触发set相同时，不要触发依赖 */
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(()=>{
      calls++;
      dummy = a.value;
    })
    expect(calls).toBe(1);
    expect(dummy).toBe(1);

    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);

    //same value should not trigger
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  })

  it("should make nested properties reactive",()=>{
    /**ref可以接收一个对象 */
    const a = ref({
      count:1
    })
    let dummy;
    effect(()=>{
      dummy = a.value.count;
    })
    expect(dummy).toBe(1);
    a.value.count = 2;
    expect(dummy).toBe(2);
  });

  it("isRef",()=>{
    /**检查值是否为一个ref对象 */
    const a = ref(1);
    const user = reactive({
      age:10
    })
    expect(isRef(a)).toBe(true);
    expect(isRef(1)).toBe(false);
    expect(isRef(user)).toBe(false);
  });

  it("unRef",()=>{
    /**val = isRef(val) ? val.value : val的语法糖函数 */
    const a = ref(1);
    expect(unRef(a)).toBe(1);
    expect(unRef(1)).toBe(1);
  });

  it("proxyRefs",()=>{
    /**
     * 处理get，如果访问的是age(ref类型)，那么就给它返回.value，如果not ref，就返回本身的值。
     * 处理set，如果这个属性是一个ref类型并且新给到的值不是ref类型，那么去修改它的.value。如果赋的是一个ref类型，直接替换掉。
     */
    const user = {
      age:ref(10),
      name:"xiaohong"
    };
    const proxyUser = proxyRefs(user);

    //get
    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);
    expect(proxyUser.name).toBe("xiaohong");

    //set
    proxyUser.age = 20;
    proxyUser.name="zhangsan";
    expect(proxyUser.age).toBe(20);
    expect(user.age.value).toBe(20);
    expect(proxyUser.name).toBe("zhangsan");
    expect(user.name).toBe("zhangsan");
    
    proxyUser.age = ref(30);
    expect(proxyUser.age).toBe(30);
    expect(user.age.value).toBe(30);
  })
  
})