import { createComponentInstance, setupComponent } from "./component";

/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-08 11:30:23
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-11 11:57:14
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

function mountComponent(initialVNode,container){
  //根据vnode创建组件实例，挂载很多自身的属性，比如props、slots等
  const instance = createComponentInstance(initialVNode,container);
  //初始化实例上的props、slots以及初始化调用setup后返回的值，其实就是初始化用户传入的配置
  setupComponent(instance,container);
  //调用实例上的render函数，因为render函数才会最终的去返回我们想要渲染的虚拟节点，
  setupRenderEffect(instance,initialVNode,container);
}

function setupRenderEffect(instance,initialVNode,container){
  const {proxy} = instance;
  const subTree = instance.render.call(proxy);

  //vnode->element类型->mountElement
  patch(subTree,container);
  //patch结束之后，即所有的element这种类型都已经mount,subTree都已经初始化完成了
  initialVNode.el = subTree.el;
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
  //通过vnode.el把el存起来
  const el = (vnode.el=document.createElement(vnode.type));
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

