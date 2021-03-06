import { createComponentInstance, setupComponent } from "./component";

/*
 * @Descripttion: 
 * @Author: suanmei
 * @Date: 2022-04-08 11:30:23
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-20 14:30:37
 */
import { ShapeFlags } from "../shared/ShapeFlags";
import { Fragment,Text } from "./vnode";
import { createAppAPI } from "./createApp";

export function createRenderer(options){
  const {
    createElement:hostCreateElement,
    patchProp:hostPatchProp,
    insert:hostInsert
  } = options;

  function render(vnode,container){
    patch(vnode,container,null);
  }

  function patch(vnode,container,parentComponent){
    //判断是vnode是component类型还是element类型
    const {type,shapeFlag} = vnode;
    switch(type){
      case Fragment:
        processFragment(vnode,container,parentComponent);
        break;
      case Text:
        processText(vnode,container);
        break;
      default:
        if(shapeFlag & ShapeFlags.ELEMENT){
          processElement(vnode,container,parentComponent);
        }else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
          processComponent(vnode,container,parentComponent);
        }
      }
    }

  function processComponent(vnode,container,parentComponent){
    mountComponent(vnode,container,parentComponent);
  }

  function mountComponent(initialVNode,container,parentComponent){
    //根据vnode创建组件实例，挂载很多自身的属性，比如props、slots等
    const instance = createComponentInstance(initialVNode,parentComponent);
    //初始化实例上的props、slots以及初始化调用setup后返回的值，其实就是初始化用户传入的配置
    setupComponent(instance,container);
    //调用实例上的render函数，因为render函数才会最终的去返回我们想要渲染的虚拟节点，
    setupRenderEffect(instance,initialVNode,container);
  }

  function setupRenderEffect(instance,initialVNode,container){
    const {proxy} = instance;
    const subTree = instance.render.call(proxy);

    //vnode->element类型->mountElement
    patch(subTree,container,instance);
    //patch结束之后，即所有的element这种类型都已经mount,subTree都已经初始化完成了
    initialVNode.el = subTree.el;
  }


  function processElement(vnode,container,parentComponent){
    mountElement(vnode,container,parentComponent);
  }
  function mountElement(vnode,container,parentComponent){
    /**正常添加一个dom元素
     * const el = document.createElement('div');
     * el.textContent = 'hi,mini-vue';
     * el.setAttribute('id','root');
     * document.body.append(el);
     */
    /**转换过来 const vnode = {type,props,children},children可能是string｜array */
    //通过vnode.el把el存起来
    const el = (vnode.el=hostCreateElement(vnode.type));
    const {children,shapeFlag} = vnode;
    if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
      el.textContent = children;
    }else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
      mountChildren(vnode,el,parentComponent);
    }

    const {props} = vnode;
    for(const key in props){
      const val = props[key];
      hostPatchProp(el,key,val);
    }

    hostInsert(el,container);
  }

  function mountChildren(vnode,container,parentComponent){
    vnode.children.forEach(v=>{
      patch(v,container,parentComponent);
    })
  }


  function processFragment(vnode,container,parentComponent){
    //把所有的children渲染出来
    mountChildren(vnode,container,parentComponent);
  }

  function processText(vnode,container){
    const {children} = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
  }

  return {
    createApp:createAppAPI(render)
  }
}