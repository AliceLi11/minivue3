function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        shapeFlags: getShapeFlags(type),
        el: null
    };
    if (typeof children === 'string') {
        vnode.shapeFlags = vnode.shapeFlags | 4 /* TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlags = vnode.shapeFlags | 8 /* ARRAY_CHILDREN */;
    }
    return vnode;
}
function getShapeFlags(type) {
    return typeof type === 'string' ? 1 /* ELEMENT */ : 2 /* STATEFUL_COMPONENT */;
}

/*
 * @Descripttion:
 * @Author: suanmei
 * @Date: 2022-04-11 14:32:20
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-11 14:56:18
 */
//$el作为key和对应的函数，后续只需要检测对应的key在不在这个map里面，如果在调用相应的函数，以后的扩展点只需要在map里面加key和对应的value
var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; }
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        //从setupState里取值
        var setupState = instance.setupState;
        if (key in setupState) {
            return setupState[key];
        }
        //key -> $el
        // if(key==='$el'){
        //   return instance.vnode.el;
        // }
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

/*
 * @Descripttion:
 * @Author: suanmei
 * @Date: 2022-04-08 11:47:26
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-11 14:35:01
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
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
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

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    //判断是vnode是component类型还是element类型
    var shapeFlags = vnode.shapeFlags;
    if (shapeFlags & 1 /* ELEMENT */) {
        processElement(vnode, container);
    }
    else if (shapeFlags & 2 /* STATEFUL_COMPONENT */) {
        processComponent(vnode, container);
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
    //根据vnode创建组件实例，挂载很多自身的属性，比如props、slots等
    var instance = createComponentInstance(initialVNode);
    //初始化实例上的props、slots以及初始化调用setup后返回的值，其实就是初始化用户传入的配置
    setupComponent(instance);
    //调用实例上的render函数，因为render函数才会最终的去返回我们想要渲染的虚拟节点，
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    var proxy = instance.proxy;
    var subTree = instance.render.call(proxy);
    //vnode->element类型->mountElement
    patch(subTree, container);
    //patch结束之后，即所有的element这种类型都已经mount,subTree都已经初始化完成了
    initialVNode.el = subTree.el;
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
    //通过vnode.el把el存起来
    var el = (vnode.el = document.createElement(vnode.type));
    var children = vnode.children, shapeFlags = vnode.shapeFlags;
    if (shapeFlags & 4 /* TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlags & 8 /* ARRAY_CHILDREN */) {
        mountChildren(vnode, el);
    }
    var props = vnode.props;
    for (var key in props) {
        var val = props[key];
        //如果是on开头的，就是事件(匹配on开头，且下一位是大写的字母)
        var isOn = function (key) { return /^on[A-Z]/.test(key); };
        if (isOn(key)) {
            var event_1 = key.slice(2).toLowerCase();
            el.addEventListener(event_1, val);
        }
        else {
            el.setAttribute(key, val);
        }
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

export { createApp, h };
