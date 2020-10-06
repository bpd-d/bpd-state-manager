(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("bpd-toolkit", [], factory);
	else if(typeof exports === 'object')
		exports["bpd-toolkit"] = factory();
	else
		root["bpd-toolkit"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "VERSION_INFO", function() { return /* binding */ VERSION_INFO; });
__webpack_require__.d(__webpack_exports__, "BpdStateManager", function() { return /* binding */ src_BpdStateManager; });
__webpack_require__.d(__webpack_exports__, "createStateManager", function() { return /* binding */ createStateManager; });
__webpack_require__.d(__webpack_exports__, "createState", function() { return /* binding */ createState; });
__webpack_require__.d(__webpack_exports__, "removeState", function() { return /* binding */ removeState; });
__webpack_require__.d(__webpack_exports__, "getState", function() { return /* binding */ getState; });
__webpack_require__.d(__webpack_exports__, "perform", function() { return /* binding */ perform; });
__webpack_require__.d(__webpack_exports__, "subscribe", function() { return /* binding */ subscribe; });
__webpack_require__.d(__webpack_exports__, "unsubscribe", function() { return /* binding */ unsubscribe; });

// CONCATENATED MODULE: ./src/helpers/errors.ts
class ErrorBase extends Error {
    constructor(name, message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
    }
}
class IncorrectDataError extends ErrorBase {
    constructor(message) {
        super("IncorrectDataError", message);
    }
}
class WorkerNotReadyError extends ErrorBase {
    constructor(message) {
        super("WorkerNotReadyError", message);
    }
}
class PerformerError extends ErrorBase {
    constructor(base) {
        super("PerformerError:" + base.name, base.message);
        this.stack = base.stack;
    }
}
class CreateStateError extends ErrorBase {
    constructor(message) {
        super("CreateStateError", message);
    }
}
class InitStateError extends ErrorBase {
    constructor(message) {
        super("InitStateError", message);
    }
}
class CommonError extends ErrorBase {
    constructor(type, message) {
        super(type, message);
    }
}
class StateManagerShorthandError extends ErrorBase {
    constructor(type, message) {
        super("StateManagerShorthandError", type + ":" + message);
    }
}

// CONCATENATED MODULE: ./src/helpers/functions.ts
function is(obj) {
    if (typeof obj === 'undefined' || obj === null) {
        return false;
    }
    if (Array.isArray(obj) && obj.length === 0) {
        return false;
    }
    if (typeof obj === 'string' && obj.length === 0) {
        false;
    }
    return true;
}
function* counter() {
    let idx = 0;
    while (true) {
        let reset = yield idx++;
        if (reset || idx > 200000) {
            idx = 0;
        }
    }
}

// CONCATENATED MODULE: ./src/subscriptions/subscriptions.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _subscribers, _onError, _counter, _id;


class subscriptions_SubscriptionsManager {
    constructor(id) {
        _subscribers.set(this, void 0);
        _onError.set(this, void 0);
        _counter.set(this, void 0);
        _id.set(this, void 0);
        if (!is(id)) {
            throw new IncorrectDataError("Valid Id is required");
        }
        __classPrivateFieldSet(this, _subscribers, []);
        __classPrivateFieldSet(this, _id, id);
        __classPrivateFieldSet(this, _counter, counter());
        __classPrivateFieldSet(this, _onError, undefined);
    }
    subscribe(callback, options) {
        let subscriber = this.createSubscriber(callback, options);
        __classPrivateFieldGet(this, _subscribers).push(subscriber);
        return subscriber.id;
    }
    unsubscribe(subscribtionId) {
        if (!is(subscribtionId)) {
            return;
        }
        let index = __classPrivateFieldGet(this, _subscribers).findIndex((subscirber) => {
            return subscirber.id === subscribtionId;
        });
        if (index < 0) {
            return;
        }
        __classPrivateFieldGet(this, _subscribers).splice(index, 1);
    }
    notify(state) {
        return __awaiter(this, void 0, void 0, function* () {
            let toRemove = [];
            __classPrivateFieldGet(this, _subscribers).forEach(sub => {
                if (sub.options && sub.options.singleRun) {
                    toRemove.push(sub.id);
                }
                try {
                    sub.callback(state);
                }
                catch (e) {
                    toRemove.push(sub.id);
                    if (__classPrivateFieldGet(this, _onError)) {
                        __classPrivateFieldGet(this, _onError).call(this, e);
                    }
                }
            });
            toRemove.forEach(id => this.unsubscribe(id));
            return true;
        });
    }
    onError(callback) {
        __classPrivateFieldSet(this, _onError, callback);
    }
    getSubscribers() {
        return [...__classPrivateFieldGet(this, _subscribers)];
    }
    createSubscriber(callback, options) {
        return {
            id: this.generateId(),
            options: options,
            callback: callback
        };
    }
    generateId() {
        return `${__classPrivateFieldGet(this, _id)}:${__classPrivateFieldGet(this, _counter).next().value}`;
    }
}
_subscribers = new WeakMap(), _onError = new WeakMap(), _counter = new WeakMap(), _id = new WeakMap();

// CONCATENATED MODULE: ./src/worker/worker.ts
var worker_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var worker_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _queue, _queuelock, _lock, _callback, _onUpdate, worker_onError;


class worker_BpdStateWorker {
    constructor() {
        _queue.set(this, void 0);
        _queuelock.set(this, void 0);
        _lock.set(this, void 0);
        _callback.set(this, void 0);
        _onUpdate.set(this, void 0);
        worker_onError.set(this, void 0);
        worker_classPrivateFieldSet(this, _queue, []);
        worker_classPrivateFieldSet(this, _lock, false);
        worker_classPrivateFieldSet(this, _queuelock, false);
        worker_classPrivateFieldSet(this, worker_onError, undefined);
        worker_classPrivateFieldSet(this, _callback, undefined);
        worker_classPrivateFieldSet(this, _onUpdate, undefined);
    }
    onPerform(callback) {
        worker_classPrivateFieldSet(this, _callback, callback);
    }
    onUpdate(callback) {
        worker_classPrivateFieldSet(this, _onUpdate, callback);
    }
    onError(callback) {
        worker_classPrivateFieldSet(this, worker_onError, callback);
    }
    perform(action) {
        if (!is(action)) {
            throw new IncorrectDataError("Inproper action object passed to worker");
        }
        if (!is(worker_classPrivateFieldGet(this, _callback)) || !is(worker_classPrivateFieldGet(this, _onUpdate))) {
            throw new WorkerNotReadyError("Callbacks are not set");
        }
        if (!this.isInQueue(action)) {
            worker_classPrivateFieldGet(this, _queue).push(action);
        }
        this.run();
    }
    run() {
        if (worker_classPrivateFieldGet(this, _queuelock) || worker_classPrivateFieldGet(this, _lock) || !is(worker_classPrivateFieldGet(this, _queue))) {
            return;
        }
        worker_classPrivateFieldSet(this, _lock, true);
        let current = worker_classPrivateFieldGet(this, _queue).shift();
        if (!current) {
            worker_classPrivateFieldSet(this, _lock, false);
            this.run();
        }
        if (worker_classPrivateFieldGet(this, _callback) && current) {
            worker_classPrivateFieldGet(this, _callback).call(this, current).then((state) => {
                if (worker_classPrivateFieldGet(this, _onUpdate)) {
                    worker_classPrivateFieldGet(this, _onUpdate).call(this, state, current);
                }
                worker_classPrivateFieldSet(this, _lock, false);
                this.run();
            }).catch(e => {
                if (worker_classPrivateFieldGet(this, worker_onError)) {
                    worker_classPrivateFieldGet(this, worker_onError).call(this, e, current);
                }
            });
        }
    }
    isInQueue(action) {
        worker_classPrivateFieldSet(this, _queuelock, true);
        let index = worker_classPrivateFieldGet(this, _queue).findIndex(value => {
            return action.action === value.action && value.data === action.data;
        });
        worker_classPrivateFieldSet(this, _queuelock, false);
        return index > -1;
    }
}
_queue = new WeakMap(), _queuelock = new WeakMap(), _lock = new WeakMap(), _callback = new WeakMap(), _onUpdate = new WeakMap(), worker_onError = new WeakMap();

// CONCATENATED MODULE: ./src/state/state.ts
var state_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var state_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _state, state_id, _config, _worker, _performer, _subscriptionManager;




class state_BpdState {
    constructor(id, init, performer, config) {
        _state.set(this, void 0);
        state_id.set(this, void 0);
        _config.set(this, void 0);
        _worker.set(this, void 0);
        _performer.set(this, void 0);
        _subscriptionManager.set(this, void 0);
        if (!is(id)) {
            throw new InitStateError("State id must be provided");
        }
        if (!is(init)) {
            throw new InitStateError("Initial value must be a valid, initialized object");
        }
        if (!is(performer)) {
            throw new InitStateError("Perfromer callback was not provided");
        }
        state_classPrivateFieldSet(this, state_id, id);
        state_classPrivateFieldSet(this, _state, init);
        state_classPrivateFieldSet(this, _config, config !== null && config !== void 0 ? config : {});
        state_classPrivateFieldSet(this, _performer, performer);
        state_classPrivateFieldSet(this, _worker, new worker_BpdStateWorker());
        state_classPrivateFieldGet(this, _worker).onUpdate(this.onWorkerChange.bind(this));
        state_classPrivateFieldGet(this, _worker).onPerform(this.onWorkerPerform.bind(this));
        state_classPrivateFieldGet(this, _worker).onError(this.onWorkerError.bind(this));
        state_classPrivateFieldSet(this, _subscriptionManager, new subscriptions_SubscriptionsManager(state_classPrivateFieldGet(this, state_id)));
        state_classPrivateFieldGet(this, _subscriptionManager).onError(this.onSubscriberError.bind(this));
    }
    perform(action, callback) {
        if (!is(action)) {
            this.reportError("lib", "In proper action object", new IncorrectDataError("In proper action object"));
        }
        if (callback) {
            state_classPrivateFieldGet(this, _subscriptionManager).subscribe(callback, {
                singleRun: true
            });
        }
        state_classPrivateFieldGet(this, _worker).perform(action);
    }
    subscribe(callback) {
        if (!is(callback)) {
            this.reportError("lib", "", new IncorrectDataError("Callback has not been set"));
            return undefined;
        }
        return state_classPrivateFieldGet(this, _subscriptionManager).subscribe(callback);
    }
    unsubscribe(id) {
        if (!is(id)) {
            return false;
        }
        state_classPrivateFieldGet(this, _subscriptionManager).unsubscribe(id);
        return true;
    }
    getState() {
        return state_classPrivateFieldGet(this, _state);
    }
    onWorkerChange(state, action) {
        if (['number', 'string', 'boolean'].includes(typeof state) || Array.isArray(state)) {
            state_classPrivateFieldSet(this, _state, state);
        }
        else {
            state_classPrivateFieldSet(this, _state, Object.assign({}, state));
        }
        state_classPrivateFieldGet(this, _subscriptionManager).notify(state)
            .then((result) => {
            this.reportChange('action', action ? action.action : "");
        })
            .catch(e => {
            this.reportError("action", action ? action.action : "", e);
        });
    }
    onWorkerPerform(action) {
        return new Promise((resolve) => {
            resolve(state_classPrivateFieldGet(this, _performer).call(this, state_classPrivateFieldGet(this, _state), action));
        });
    }
    onWorkerError(e, action) {
        this.reportError('action', action ? action.action : "", e);
    }
    onSubscriberError(e) {
        this.reportError('lib', "Subscribers error", e);
    }
    reportError(type, detail, e) {
        if (state_classPrivateFieldGet(this, _config) && state_classPrivateFieldGet(this, _config).onError) {
            state_classPrivateFieldGet(this, _config).onError(state_classPrivateFieldGet(this, state_id), type, e, detail);
        }
    }
    reportChange(type, detail) {
        if (state_classPrivateFieldGet(this, _config) && state_classPrivateFieldGet(this, _config).onChange) {
            state_classPrivateFieldGet(this, _config).onChange(state_classPrivateFieldGet(this, state_id), type, detail, state_classPrivateFieldGet(this, _state));
        }
    }
}
_state = new WeakMap(), state_id = new WeakMap(), _config = new WeakMap(), _worker = new WeakMap(), _performer = new WeakMap(), _subscriptionManager = new WeakMap();

// CONCATENATED MODULE: ./src/index.ts
var src_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var src_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var src_config, _states;



const VERSION_INFO = "0.1.0";
class src_BpdStateManager {
    constructor(config) {
        src_config.set(this, void 0);
        _states.set(this, void 0);
        src_classPrivateFieldSet(this, src_config, config);
        src_classPrivateFieldSet(this, _states, {});
    }
    createState(name, initialValue, performer, config) {
        if (!is(name)) {
            throw new CreateStateError("State name was not provided");
        }
        src_classPrivateFieldGet(this, _states)[name] = new state_BpdState(name, initialValue, performer, config !== null && config !== void 0 ? config : src_classPrivateFieldGet(this, src_config));
    }
    removeState(name) {
        this.executeIfValid(name, "Perform", (state) => {
            delete src_classPrivateFieldGet(this, _states)[name];
        });
    }
    getState(name) {
        let resultState = undefined;
        this.executeIfValid(name, "Perform", (state) => {
            resultState = state;
        });
        return resultState;
    }
    perform(name, action, callback) {
        this.executeIfValid(name, "Perform", (state) => {
            state.perform(action, callback);
        });
    }
    subscribe(name, callback) {
        let id = undefined;
        this.executeIfValid(name, "Subscribe", (state) => {
            id = state.subscribe(callback);
        });
        return id;
    }
    unsubscribe(name, id) {
        this.executeIfValid(name, "Unsubscribe", (state) => {
            state.unsubscribe(id);
        });
    }
    executeIfValid(name, methodName, callback) {
        if (!is(name)) {
            throw new CommonError(methodName + "Error", "State name is not provided");
        }
        let state = src_classPrivateFieldGet(this, _states)[name];
        if (!is(state)) {
            throw new CommonError(methodName + "StateError", "State not found");
        }
        callback(state);
    }
}
src_config = new WeakMap(), _states = new WeakMap();
function createStateManager(config) {
    window.$bdpStateManager = new src_BpdStateManager(config);
}
function createState(name, initialValue, performer, config) {
    if (!is(window.$bdpStateManager)) {
        throw new StateManagerShorthandError("createState", "Manager must be initialized first with createStateManager");
    }
    window.$bdpStateManager.createState(name, initialValue, performer, config);
}
function removeState(name) {
    if (!is(window.$bdpStateManager)) {
        throw new StateManagerShorthandError("removeState", "Manager must be initialized first with createStateManager");
    }
    window.$bdpStateManager.removeState(name);
}
function getState(name) {
    if (!is(window.$bdpStateManager)) {
        throw new StateManagerShorthandError("getState", "Manager must be initialized first with createStateManager");
    }
    return window.$bdpStateManager.getState(name);
}
function perform(name, action, callback) {
    if (!is(window.$bdpStateManager)) {
        throw new StateManagerShorthandError("perform", "Manager must be initialized first with createStateManager");
    }
    window.$bdpStateManager.perform(name, action, callback);
}
function subscribe(name, callback) {
    if (!is(window.$bdpStateManager)) {
        throw new StateManagerShorthandError("subscribe", "Manager must be initialized first with createStateManager");
    }
    return window.$bdpStateManager.subscribe(name, callback);
}
function unsubscribe(name, id) {
    if (!is(window.$bdpStateManager)) {
        throw new StateManagerShorthandError("unsubscribe", "Manager must be initialized first with createStateManager");
    }
    window.$bdpStateManager.unsubscribe(name, id);
}


/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map