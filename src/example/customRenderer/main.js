/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-20 14:10:42
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-20 14:17:36
 */
import {createRenderer} from '../../../lib/guide-mini-vue.esm.js'
import {App} from './App.js'

console.log(PIXI);
const game = new PIXI.Application({
  width:500,
  height:500
})
document.body.append(game.view);//把game里面视图也就是canvas实例添加进来
const renderer = createRenderer({
  createElement(type){
    if(type==='rect'){
      const rect = new PIXI.Graphics();
      rect.beginFill(0xff0000);
      rect.drawRect(0,0,100,100);
      rect.endFill();

      return rect;
    }
  },
  patchProp(el,key,val){
    el[key] = val;
  },
  insert(el,parent){
    parent.addChild(el);
  }
})
renderer.createApp(App).mount(game.stage);