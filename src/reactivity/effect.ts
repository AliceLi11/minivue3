/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-03-14 17:11:56
 * @LastEditors: suanmei
 * @LastEditTime: 2022-03-20 21:29:39
 */
import { extend } from "../shared";

let activeEffect;
let shouldTrack = false;
class ReactiveEffect {
  private _fn:any;
  deps = [];
  active=true;
  onStop?:()=>void;
  constructor(fn,public scheduler?){
    this._fn = fn;
  }
  run(){
    activeEffect = this;
    //1.会收集依赖
    //这个时候可以用shouldTrack来做区分(stop状态active为false,不是stop状态就把shouldTrack打开，最后一定要记得reset一下这个变量)
    if(!this.active){
      return this._fn();
    }
    shouldTrack = true;
    const result = this._fn();
    //reset
    shouldTrack=false;;
    return result;
  }
  stop(){
    if(this.active){
      if(this.onStop){
        this.onStop();
      }
      cleanupEffect(this);
      this.active = false;
    }
    
  }
}
function cleanupEffect(effect){
  effect.deps.forEach((dep:any)=>{
    dep.delete(effect);
  })
  effect.deps.length = 0;
}

const targetMap = new Map()
export function track(target,key){
  //target->key->dep
  if(!isTracking()) return;
  let depsMap = targetMap.get(target);
  if(!depsMap){
    depsMap = new Map();
    targetMap.set(target,depsMap);
  }

  let dep = depsMap.get(key);
  if(!dep){
    dep = new Set();
    depsMap.set(key,dep);
  }

  if(dep.has(activeEffect)) return;
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

function isTracking(){
  return shouldTrack && activeEffect!==undefined;
}

export function trigger(target,key){
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);

  for(const effect of dep){
    if(effect.scheduler){
      effect.scheduler();
    }else{
      effect.run();
    }
  }
}


export function effect(fn,options:any={}){
  //fn
  const _effect = new ReactiveEffect(fn,options.scheduler);
  // options 
  //_effect.onStop = options.onStop;因为接下去有很多的options选项，所以这里可以用Object.assign()优化
  //extend
  extend(_effect,options);
  _effect.run();

  const runner:any =  _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner){
  runner.effect.stop();
}