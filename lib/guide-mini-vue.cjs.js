'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
 * @Descripttion: 公共的工具函数
 * @Author: suanmei
 * @Date: 2022-03-17 15:35:39
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-12 09:49:57
 */
//命名extend，可读性
var extend = Object.assign;
//判断type是不是object类型
var isObject = function (val) {
    return val !== null && typeof (val) === 'object';
};
//判断val对象里面是否含有key自有属性
var hasOwn = function (val, key) { return Object.prototype.hasOwnProperty.call(val, key); };

/*
 * @Descripttion:
 * @Author: suanmei
 * @Date: 2022-03-14 17:11:56
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-02 21:36:12
 */
var targetMap = new Map();
function trigger(target, key) {
    var depsMap = targetMap.get(target);
    var dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    for (var _i = 0, dep_1 = dep; _i < dep_1.length; _i++) {
        var effect_1 = dep_1[_i];
        if (effect_1.scheduler) {
            effect_1.scheduler();
        }
        else {
            effect_1.run();
        }
    }
}

/*
 * @Descripttion:
 * @Author: suanmei
 * @Date: 2022-03-19 23:39:17
 * @LastEditors: suanmei
 * @LastEditTime: 2022-03-26 18:42:16
 */
var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly, shallow) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (shallow === void 0) { shallow = false; }
    return function get(target, key) {
        var res = Reflect.get(target, key);
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* IS_READONLY */) {
            return isReadonly;
        }
        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            //看看 res 是不是 object，是的话在这里再次调用相应的方法给他去转换
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        var res = Reflect.set(target, key, value);
        //TODO 触发依赖
        trigger(target, key);
        return res;
    };
}
var mutableHandlers = {
    get: get,
    set: set
};
var readonlyHandlers = {
    get: readonlyGet,
    set: function (target, key, value) {
        console.warn("key:".concat(key, " set\u5931\u8D25 \u56E0\u4E3Atarget\u65F6readonly\u7684"), target);
        return true;
    }
};
/*和readonlyHandlers很相似，set一样，get不同，所以可以用之前抽离出来的extend方法（即Object.assign）**/
var shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
});

/*
 * @Descripttion:
 * @Author: suanmei
 * @Date: 2022-03-14 17:04:04
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-12 10:33:07
 */
//return new Proxy(...)被称为低代码，可以利用函数来封装一下，来表达出它想要表达的意图，使代码变得可读性更高
function createReactiveObject(target, baseHandlers) {
    if (!isObject(target)) {
        console.warn("target ".concat(target, "\u5FC5\u987B\u662F\u4E00\u4E2A\u5BF9\u8C61"));
        return target;
    }
    return new Proxy(target, baseHandlers);
}
function reactive(raw) {
    return createReactiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createReactiveObject(raw, shallowReadonlyHandlers);
}

/*
 * @Descripttion:
 * @Author: suanmei
 * @Date: 2022-04-11 23:31:39
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-12 10:29:28
 */
function initProps(instance, rawProps) {
    instance.props = rawProps || {};
    //attrs
}

/*
 * @Descripttion:
 * @Author: suanmei
 * @Date: 2022-04-11 14:32:20
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-12 09:51:26
 */
//$el作为key和对应的函数，后续只需要检测对应的key在不在这个map里面，如果在调用相应的函数，以后的扩展点只需要在map里面加key和对应的value
var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; }
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        //从setupState里取值
        var setupState = instance.setupState, props = instance.props;
        // if(key in setupState){
        //   return setupState[key];
        // }
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
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
 * @LastEditTime: 2022-04-12 10:18:57
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
    initProps(instance, instance.vnode.props);
    //TODO initSlots
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance, container) {
    var Component = instance.type;
    var setup = Component.setup;
    //这个空对象一般叫ctx
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    if (setup) {
        var setupResult = setup(shallowReadonly(instance.props));
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

exports.createApp = createApp;
exports.h = h;
