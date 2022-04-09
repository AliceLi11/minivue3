'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*
 * @Descripttion:
 * @Author: suanmei
 * @Date: 2022-04-08 11:28:19
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-08 11:29:07
 */
function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children
    };
    return vnode;
}

/*
 * @Descripttion:
 * @Author: suanmei
 * @Date: 2022-04-08 11:47:26
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-09 15:26:13
 */
function createComponentInstance(vnode, container) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {}
    };
    return component;
}
function setupComponent(instance, container) {
    //TODO initProps
    //TODO initSlots
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance, container) {
    var Component = instance.type;
    var setup = Component.setup;
    //这个空对象一般叫ctx
    instance.proxy = new Proxy({}, {
        get: function (target, key) {
            //从setupState里取值
            var setupState = instance.setupState;
            if (key in setupState) {
                return setupState[key];
            }
        }
    });
    if (setup) {
        var setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    //function =>是组件的render函数
    //object => 注入到当前组件的上下文中，即把值赋值到实例上
    //TODO function
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

/*
 * @Descripttion:
 * @Author: suanmei
 * @Date: 2022-04-08 11:30:23
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-09 15:27:10
 */
function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    //判断是vnode是component类型还是element类型
    //TODO processElement()
    if (typeof (vnode.type) === 'object') {
        processComponent(vnode, container);
    }
    else {
        processElement(vnode, container);
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    //根据vnode创建组件实例，挂载很多自身的属性，比如props、slots等
    var instance = createComponentInstance(vnode);
    //初始化实例上的props、slots以及初始化调用setup后返回的值，其实就是初始化用户传入的配置
    setupComponent(instance);
    //调用实例上的render函数，因为render函数才会最终的去返回我们想要渲染的虚拟节点，
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    var proxy = instance.proxy;
    var subTree = instance.render.call(proxy);
    //vnode->element类型->mountElement
    patch(subTree, container);
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    /**正常添加一个dom元素
     * const el = document.createElement('div');
     * el.textContent = 'hi,mini-vue';
     * el.setAttribute('id','root');
     * document.body.append(el);
     */
    /**转换过来 const vnode = {type,props,children},children可能是string｜array */
    var el = document.createElement(vnode.type);
    var children = vnode.children;
    if (typeof (children) === 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(vnode, el);
    }
    var props = vnode.props;
    for (var key in props) {
        var val = props[key];
        el.setAttribute(key, val);
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(function (v) {
        patch(v, container);
    });
}

/*
 * @Descripttion:
 * @Author: suanmei
 * @Date: 2022-04-08 11:24:23
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-08 15:42:05
 */
function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            //所有的逻辑操作 都会基于 vnode 做处理
            //component -> vnode
            var vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

/*
 * @Descripttion:
 * @Author: suanmei
 * @Date: 2022-04-08 15:10:46
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-08 15:13:23
 */
function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
