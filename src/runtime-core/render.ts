import { createComponentInstance, setupComponent } from "./component";

/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-08 11:30:23
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-09 15:27:10
 */
export function render(vnode,container){
  patch(vnode,container);
}

function patch(vnode,container){
  //判断是vnode是component类型还是element类型
  //TODO processElement()
  if(typeof(vnode.type) === 'object'){
    processComponent(vnode,container);
  }else{
    processElement(vnode,container);
  }
}

function processComponent(vnode,container){
  mountComponent(vnode,container);
}

function mountComponent(vnode,container){
  //根据vnode创建组件实例，挂载很多自身的属性，比如props、slots等
  const instance = createComponentInstance(vnode,container);
  //初始化实例上的props、slots以及初始化调用setup后返回的值，其实就是初始化用户传入的配置
  setupComponent(instance,container);
  //调用实例上的render函数，因为render函数才会最终的去返回我们想要渲染的虚拟节点，
  setupRenderEffect(instance,container);
}

function setupRenderEffect(instance,container){
  const {proxy} = instance;
  const subTree = instance.render.call(proxy);

  //vnode->element类型->mountElement
  patch(subTree,container);
}


function processElement(vnode,container){
  mountElement(vnode,container);
}
function mountElement(vnode,container){
  /**正常添加一个dom元素
   * const el = document.createElement('div');
   * el.textContent = 'hi,mini-vue';
   * el.setAttribute('id','root');
   * document.body.append(el);
   */
  /**转换过来 const vnode = {type,props,children},children可能是string｜array */
  const el = document.createElement(vnode.type);
  const {children} = vnode;
  if(typeof(children)==='string'){
    el.textContent = children;
  }else if(Array.isArray(children)){
    mountChildren(vnode,el);
  }

  const {props} = vnode;
  for(const key in props){
    const val = props[key];
    el.setAttribute(key,val);
  }

  container.append(el);
}

function mountChildren(vnode,container){
  vnode.children.forEach(v=>{
    patch(v,container);
  })
}

