/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-03-14 17:11:56
 * @LastEditors: suanmei
 * @LastEditTime: 2022-03-17 14:40:11
 */
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
    return this._fn();
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
}

const targetMap = new Map()
export function track(target,key){
  //target->key->dep
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

  dep.add(activeEffect);
  activeEffect.deps.push(dep);
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

let activeEffect;
export function effect(fn,options:any={}){
  //fn
  const _effect = new ReactiveEffect(fn,options.scheduler);
  _effect.onStop = options.onStop;
  _effect.run();

  const runner:any =  _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner){
  runner.effect.stop();
}