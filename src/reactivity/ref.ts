/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-03-26 22:02:48
 * @LastEditors: suanmei
 * @LastEditTime: 2022-03-27 17:16:15
 */
import { hasChanged, isObject } from '../shared';
import {trackEffect,isTracking,triggerEffects} from './effect'
import { reactive } from './reactive';

class RefImpl{
  private _value:any;
  public dep;
  private _rawValue:any;
  constructor(value){
    this._rawValue = value;
    this._value=convert(value);
    this.dep = new Set();
  }
  get value(){
    if(isTracking()){
      trackEffect(this.dep);
    }
    return this._value
  }
  set value(newValue){
    //一定先去修改了value的值再进行通知
    if(hasChanged(newValue,this._rawValue)){
      this._rawValue = convert(newValue);
      this._value = isObject(newValue)?reactive(newValue):newValue;
      triggerEffects(this.dep);
    }
    
  }
}
function convert(value){
  return isObject(value)?reactive(value):value;
}

export function ref(value){
  return new RefImpl(value);
} 