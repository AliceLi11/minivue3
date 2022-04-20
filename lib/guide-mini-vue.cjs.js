'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

//Symbol保证每个属性的名字都是独一无二的，这样就从根本上防止属性名的冲突
var Fragment = Symbol("Fragment");
var Text = Symbol("Text");
function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        shapeFlag: getShapeFlags(type),
        el: null
    };
    if (typeof children === 'string') {
        vnode.shapeFlag |= 4 /* TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ARRAY_CHILDREN */;
    }
    //SLOT_CHILDREN:组件+children是object
    if (vnode.shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        if (typeof children === 'object') {
            vnode.shapeFlag |= 16 /* SLOT_CHILDREN */;
        }
    }
    return vnode;
}
function getShapeFlags(type) {
    return typeof type === 'string' ? 1 /* ELEMENT */ : 2 /* STATEFUL_COMPONENT */;
}
function createTextVNode(text) {
    return createVNode(Text, {}, text);
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

/*
 * @Descripttion:
 * @Author: suanmei
 * @Date: 2022-04-14 16:19:35
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-17 11:46:28
 */
function renderSlot(slots, name, props) {
    var slot = slots[name];
    if (typeof slot === 'function') {
        return createVNode(Fragment, {}, slot(props));
    }
}

/*
 * @Descripttion: 公共的工具函数
 * @Author: suanmei
 * @Date: 2022-03-17 15:35:39
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-13 14:41:10
 */
//命名extend，可读性
var extend = Object.assign;
//判断type是不是object类型
var isObject = function (val) {
    return val !== null && typeof (val) === 'object';
};
//判断val对象里面是否含有key自有属性
var hasOwn = function (val, key) { return Object.prototype.hasOwnProperty.call(val, key); };
//烤肉串改成驼峰
var camelize = function (str) {
    return str.replace(/-(\w)/g, function (_, c) {
        return c ? c.toUpperCase() : "";
    });
};
//开头字母大写
var captialize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
//处理成onXxx形式
var toHandlerKey = function (str) {
    return str ? "on" + captialize(str) : "";
};

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
 * @Date: 2022-04-12 14:23:02
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-17 21:55:01
 */
function emit(instance, event) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    console.log("emit", event);
    var props = instance.props;
    var handlerName = toHandlerKey(camelize(event));
    var handler = props[handlerName];
    handler && handler.apply(void 0, args);
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
 * @LastEditTime: 2022-04-14 16:12:06
 */
//$el作为key和对应的函数，后续只需要检测对应的key在不在这个map里面，如果在调用相应的函数，以后的扩展点只需要在map里面加key和对应的value
var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; },
    $slots: function (i) { return i.slots; }
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
 * @Date: 2022-04-14 15:12:05
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-14 22:42:51
 */
function initSlots(instance, children) {
    // instance.slots = Array.isArray(children)?children:[children];
    var vnode = instance.vnode;
    if (vnode.shapeFlag & 16 /* SLOT_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}
function normalizeObjectSlots(children, slots) {
    var _loop_1 = function (key) {
        var value = children[key];
        slots[key] = function (props) { return normalizeSlotValue(value(props)); };
    };
    for (var key in children) {
        _loop_1(key);
    }
}

/*
 * @Descripttion:
 * @Author: suanmei
 * @Date: 2022-04-08 11:47:26
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-17 22:58:12
 */
function createComponentInstance(vnode, parent) {
    console.log("createComponentInstance", parent); //为了安全起见，这里打印一下
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
        slots: {},
        provides: parent ? parent.provides : {},
        parent: parent,
        emit: function () { }
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance, container) {
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance, container) {
    var Component = instance.type;
    var setup = Component.setup;
    //这个空对象一般叫ctx
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    if (setup) {
        setCurrentInstance(instance);
        var setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit });
        setCurrentInstance(null);
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
var currentInstance;
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}

/*
 * @Descripttion:
 * @Author: suanmei
 * @Date: 2022-04-17 18:24:58
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-17 23:57:02
 */
function provide(key, value) {
    //存
    var currentInstance = getCurrentInstance();
    if (currentInstance) {
        var provides = currentInstance.provides;
        var parentProvides = currentInstance.parent.provides;
        //init 时机：因为createComponentInstance中provides:parent?parent.provides:{},所以provides === parentProvides
        //重写当前实例的provides，其原型指向它的父级的provides。注意只能执行一次，在初始化的时候，不然setup中有2个provide,就会调用2次，使provides以原型创建后一直是{}，所以会覆盖,provides最终都是当前组件里最后一次调用时赋的值。
        if (provides === parentProvides) {
            provides = currentInstance.provides = Object.create(parentProvides);
        }
        provides[key] = value;
    }
}
function inject(key, defaultValue) {
    //取
    var currentInstance = getCurrentInstance();
    if (currentInstance) {
        var parentProvides = currentInstance.parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
        }
        else if (defaultValue) {
            if (typeof defaultValue === 'function') {
                return defaultValue();
            }
            return defaultValue;
        }
    }
}

/*
 * @Descripttion:
 * @Author: suanmei
 * @Date: 2022-04-08 11:24:23
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-20 14:06:07
 */
// import { render } from "./renderer";
function createAppAPI(render) {
    return function createApp(rootComponent) {
        return {
            mount: function (rootContainer) {
                //所有的逻辑操作 都会基于 vnode 做处理
                //component -> vnode
                var vnode = createVNode(rootComponent);
                render(vnode, rootContainer);
            }
        };
    };
}

function createRenderer(options) {
    var createElement = options.createElement, patchProp = options.patchProp, insert = options.insert;
    function render(vnode, container) {
        patch(vnode, container, null);
    }
    function patch(vnode, container, parentComponent) {
        //判断是vnode是component类型还是element类型
        var type = vnode.type, shapeFlag = vnode.shapeFlag;
        switch (type) {
            case Fragment:
                processFragment(vnode, container, parentComponent);
                break;
            case Text:
                processText(vnode, container);
                break;
            default:
                if (shapeFlag & 1 /* ELEMENT */) {
                    processElement(vnode, container, parentComponent);
                }
                else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
                    processComponent(vnode, container, parentComponent);
                }
        }
    }
    function processComponent(vnode, container, parentComponent) {
        mountComponent(vnode, container, parentComponent);
    }
    function mountComponent(initialVNode, container, parentComponent) {
        //根据vnode创建组件实例，挂载很多自身的属性，比如props、slots等
        var instance = createComponentInstance(initialVNode, parentComponent);
        //初始化实例上的props、slots以及初始化调用setup后返回的值，其实就是初始化用户传入的配置
        setupComponent(instance);
        //调用实例上的render函数，因为render函数才会最终的去返回我们想要渲染的虚拟节点，
        setupRenderEffect(instance, initialVNode, container);
    }
    function setupRenderEffect(instance, initialVNode, container) {
        var proxy = instance.proxy;
        var subTree = instance.render.call(proxy);
        //vnode->element类型->mountElement
        patch(subTree, container, instance);
        //patch结束之后，即所有的element这种类型都已经mount,subTree都已经初始化完成了
        initialVNode.el = subTree.el;
    }
    function processElement(vnode, container, parentComponent) {
        mountElement(vnode, container, parentComponent);
    }
    function mountElement(vnode, container, parentComponent) {
        /**正常添加一个dom元素
         * const el = document.createElement('div');
         * el.textContent = 'hi,mini-vue';
         * el.setAttribute('id','root');
         * document.body.append(el);
         */
        /**转换过来 const vnode = {type,props,children},children可能是string｜array */
        //通过vnode.el把el存起来
        var el = (vnode.el = createElement(vnode.type));
        var children = vnode.children, shapeFlag = vnode.shapeFlag;
        if (shapeFlag & 4 /* TEXT_CHILDREN */) {
            el.textContent = children;
        }
        else if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
            mountChildren(vnode, el, parentComponent);
        }
        var props = vnode.props;
        for (var key in props) {
            var val = props[key];
            patchProp(el, key, val);
        }
        insert(el, container);
    }
    function mountChildren(vnode, container, parentComponent) {
        vnode.children.forEach(function (v) {
            patch(v, container, parentComponent);
        });
    }
    function processFragment(vnode, container, parentComponent) {
        //把所有的children渲染出来
        mountChildren(vnode, container, parentComponent);
    }
    function processText(vnode, container) {
        var children = vnode.children;
        var textNode = (vnode.el = document.createTextNode(children));
        container.append(textNode);
    }
    return {
        createApp: createAppAPI(render)
    };
}

/*
 * @Descripttion: 实现用户传入的基于DOM的接口实现
 * @Author: suanmei
 * @Date: 2022-04-20 10:34:31
 * @LastEditors: suanmei
 * @LastEditTime: 2022-04-20 14:18:19
 */
function createElement(type) {
    console.log("createElement-------------------");
    return document.createElement(type);
}
function patchProp(el, key, val) {
    console.log("patchProp-------------------");
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
function insert(el, parent) {
    console.log("insert-------------------");
    parent.append(el);
}
var renderer = createRenderer({
    createElement: createElement,
    patchProp: patchProp,
    insert: insert
});
function createApp() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return renderer.createApp.apply(renderer, args);
}

exports.createApp = createApp;
exports.createRenderer = createRenderer;
exports.createTextVNode = createTextVNode;
exports.getCurrentInstance = getCurrentInstance;
exports.h = h;
exports.inject = inject;
exports.provide = provide;
exports.renderSlot = renderSlot;
