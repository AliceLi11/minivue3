/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-03-14 17:01:13
 * @LastEditors: suanmei
 * @LastEditTime: 2022-03-23 21:04:42
 */
import {reactive,isReactive} from '../reactive'
describe("reactive",()=>{
  it('happy path',()=>{
    const original = {foo:1};
    const observed = reactive(original);
    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);

    /**
     * 判断我们这个对象是不是reactive类型也很有用(readonly思路一致)。
     * reactive对象，实际就是返回一个代理对象。当用户去调用isReactive的时候，让他去触发get。因为createGetter里面有通过isReadonly参数区分的，知道当前触发的get操作是一个什么类型
     * 不是Proxy对象时（没用reactive函数创建）,不会去调用baseHandler里的get方法，又因为本身身上没有去挂载key的，所以必然得到undefined。所以现在只需要把undefined转换成布尔值就可以了
     */
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);
    expect(isReactive(original)).toBe(false);
  })

  test("nested",()=>{
    /**
     * 创建好的reactive它内部还有另外的一些object场景,reactive是支持这种嵌套去转换的逻辑点的。
     * 实现：直接在baseHandlers.ts的get方法中返回出去的res之前看看res是不是object，如果是，在这里再次调用reactive这个方法给他去转换就ok了。
     */
    const  original = {
      nested:{
        foo:1
      },
      array:[{bar:2}]
    }
    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
  })
})