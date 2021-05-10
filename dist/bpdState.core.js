(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("bpdState", [], factory);
	else if(typeof exports === 'object')
		exports["bpdState"] = factory();
	else
		root["bpdState"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return is; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return counter; });
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


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export ErrorBase */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return IncorrectDataError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return WorkerNotReadyError; });
/* unused harmony export PerformerError */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return CreateStateError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return InitStateError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CommonError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return StateManagerShorthandError; });
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


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "VERSION_INFO", function() { return /* binding */ VERSION_INFO; });
__webpack_require__.d(__webpack_exports__, "BpdStateManagerFactory", function() { return /* binding */ core_BpdStateManagerFactory; });

// EXTERNAL MODULE: ./src/helpers/errors.ts
var errors = __webpack_require__(1);

// EXTERNAL MODULE: ./src/helpers/functions.ts
var functions = __webpack_require__(0);

// CONCATENATED MODULE: ./src/helpers/backup.ts
class StateBackup {
    constructor() {
        this._states = [];
        this._maxCount = 20;
    }
    push(v) {
        if (this._states.length >= this._maxCount) {
            this._states.shift();
        }
        this._states.push(v);
    }
    undo() {
        if (this._states.length > 0) {
            return this._states.pop();
        }
        return undefined;
    }
    length() {
        return this._states.length;
    }
}

// CONCATENATED MODULE: ./src/helpers/copy.ts
class ObjectCopyMaker {
    copy(obj) {
        if (typeof obj === 'undefined' || obj === null) {
            return obj;
        }
        let newOne = null;
        if (['number', 'string', 'boolean'].includes(typeof obj) || Array.isArray(obj)) {
            newOne = obj;
        }
        else {
            newOne = Object.assign({}, obj);
        }
        return newOne;
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


class subscriptions_SubscriptionsManager {
    constructor(id) {
        if (!Object(functions["b" /* is */])(id)) {
            throw new errors["c" /* IncorrectDataError */]("Valid Id is required");
        }
        this._subscribers = [];
        this._id = id;
        this._counter = Object(functions["a" /* counter */])();
        this._onError = undefined;
    }
    subscribe(callback, options) {
        let subscriber = this.createSubscriber(callback, options);
        this._subscribers.push(subscriber);
        return subscriber.id;
    }
    unsubscribe(subscribtionId) {
        if (!Object(functions["b" /* is */])(subscribtionId)) {
            return;
        }
        let index = this._subscribers.findIndex((subscirber) => {
            return subscirber.id === subscribtionId;
        });
        if (index < 0) {
            return;
        }
        this._subscribers.splice(index, 1);
    }
    notify(state) {
        return __awaiter(this, void 0, void 0, function* () {
            let toRemove = [];
            this._subscribers.forEach(sub => {
                if (sub.options && sub.options.singleRun) {
                    toRemove.push(sub.id);
                }
                try {
                    sub.callback(state);
                }
                catch (e) {
                    toRemove.push(sub.id);
                    if (this._onError) {
                        this._onError(e);
                    }
                }
            });
            toRemove.forEach(id => this.unsubscribe(id));
            return true;
        });
    }
    onError(callback) {
        this._onError = callback;
    }
    getSubscribers() {
        return [...this._subscribers];
    }
    createSubscriber(callback, options) {
        return {
            id: this.generateId(),
            options: options,
            callback: callback
        };
    }
    generateId() {
        return `${this._id}:${this._counter.next().value}`;
    }
}

// CONCATENATED MODULE: ./src/worker/worker.ts


class worker_BpdStateWorker {
    constructor() {
        this._queue = [];
        this._lock = false;
        this._queuelock = false;
        this._onError = undefined;
        this._onPerform = undefined;
        this._onUpdate = undefined;
    }
    onPerform(callback) {
        this._onPerform = callback;
    }
    onUpdate(callback) {
        this._onUpdate = callback;
    }
    onError(callback) {
        this._onError = callback;
    }
    perform(action) {
        if (!Object(functions["b" /* is */])(action)) {
            throw new errors["c" /* IncorrectDataError */]("Inproper action object passed to worker");
        }
        if (!Object(functions["b" /* is */])(this._onPerform) || !Object(functions["b" /* is */])(this._onUpdate)) {
            throw new errors["f" /* WorkerNotReadyError */]("Callbacks are not set");
        }
        if (!this.isInQueue(action)) {
            this._queue.push(action);
        }
        this.run();
    }
    run() {
        if (this._queuelock || this._lock || !Object(functions["b" /* is */])(this._queue)) {
            return;
        }
        this._lock = true;
        let current = this._queue.shift();
        if (!current) {
            this._lock = false;
            this.run();
        }
        if (this._onPerform && current) {
            this._onPerform(current).then((state) => {
                if (this._onUpdate) {
                    this._onUpdate(state, current);
                }
                this._lock = false;
                this.run();
            }).catch(e => {
                if (this._onError) {
                    this._onError(e, current);
                }
            });
        }
    }
    isInQueue(action) {
        this._queuelock = true;
        let index = this._queue.findIndex(value => {
            return action.action === value.action && value.data === action.data;
        });
        this._queuelock = false;
        return index > -1;
    }
}

// CONCATENATED MODULE: ./src/state/state.ts






const UNDO_ACTION_NAME = "$$UNDO_FROM_BACKUP";
class state_BpdState {
    constructor(id, init, mutationHandler, config) {
        var _a;
        if (!Object(functions["b" /* is */])(id)) {
            throw new errors["d" /* InitStateError */]("State id must be provided");
        }
        if (!Object(functions["b" /* is */])(init)) {
            throw new errors["d" /* InitStateError */]("Initial value must be a valid, initialized object");
        }
        if (!Object(functions["b" /* is */])(mutationHandler)) {
            throw new errors["d" /* InitStateError */]("Perfromer callback was not provided");
        }
        this._id = id;
        this._state = init;
        this._config = config !== null && config !== void 0 ? config : {};
        this._mutationHandler = mutationHandler;
        this._worker = new worker_BpdStateWorker();
        this._worker.onUpdate(this.onWorkerChange.bind(this));
        this._worker.onPerform(this.onWorkerPerform.bind(this));
        this._worker.onError(this.onWorkerError.bind(this));
        this._subscriptionManager = new subscriptions_SubscriptionsManager(this._id);
        this._subscriptionManager.onError(this.onSubscriberError.bind(this));
        this._copyMaker = (_a = this._config.copyMaker) !== null && _a !== void 0 ? _a : new ObjectCopyMaker();
        this._backup = new StateBackup();
    }
    /**
     * Performs an action on the state
     * @param action - action to be performed
     * @param callback - optional - subscription callback for one time execution
     */
    perform(action, callback) {
        if (!Object(functions["b" /* is */])(action)) {
            this.reportError("lib", "In proper action object", new errors["c" /* IncorrectDataError */]("In proper action object"));
        }
        if (callback) {
            this._subscriptionManager.subscribe(callback, {
                singleRun: true
            });
        }
        this._worker.perform(action);
    }
    /**
     * Attaches new subscriber to state
     * @param callback Function to be assigned to subscriber
     */
    subscribe(callback) {
        if (!Object(functions["b" /* is */])(callback)) {
            this.reportError("lib", "", new errors["c" /* IncorrectDataError */]("Callback has not been set"));
            return undefined;
        }
        return this._subscriptionManager.subscribe(callback);
    }
    /**
     * Removes subscriber from the state
     * @param id subscription identifier
     */
    unsubscribe(id) {
        if (!Object(functions["b" /* is */])(id)) {
            return false;
        }
        this._subscriptionManager.unsubscribe(id);
        return true;
    }
    /**
     * Returns current state
     */
    getState() {
        return this._copyMaker.copy(this._state);
    }
    /**
     * Performs undo on state
     */
    undo() {
        this._worker.perform({ action: UNDO_ACTION_NAME });
    }
    /**
     * Callback invoked by a worker when state change perform is completed
     * Method assigns new state and calls subscription manager to notify subscribers about the change
     * @param state - new state value
     * @param action - executed action
     */
    onWorkerChange(state, action) {
        if (action && action.action === UNDO_ACTION_NAME) {
            this.assignStateAndNotify(state, "lib", "Undo from backup");
        }
        else {
            this._backup.push(this._copyMaker.copy(this._state));
            this.assignStateAndNotify(state, "action", action ? action.action : "");
        }
    }
    /**
     * Callback on workerk that creates a promise that executes perfromer on passed action
     * @param action action to be perfromed
     */
    onWorkerPerform(action) {
        if (action && action.action === UNDO_ACTION_NAME) {
            return new Promise((resolve) => {
                let lastValue = this._backup.undo();
                resolve(lastValue !== null && lastValue !== void 0 ? lastValue : this._copyMaker.copy(this._state));
            });
        }
        return new Promise((resolve) => {
            resolve(this._mutationHandler(this._copyMaker.copy(this._state), action));
        });
    }
    onWorkerError(e, action) {
        this.reportError('action', action ? action.action : "", e);
    }
    onSubscriberError(e) {
        this.reportError('lib', "Subscribers error", e);
    }
    reportError(type, detail, e) {
        if (this._config && this._config.onError) {
            this._config.onError(this._id, type, e, detail);
        }
    }
    reportChange(type, detail) {
        if (this._config && this._config.onChange) {
            this._config.onChange(this._id, type, detail, this._state);
        }
    }
    assignStateAndNotify(state, type, detail) {
        this._state = this._copyMaker.copy(state);
        this._subscriptionManager.notify(state)
            .then((result) => {
            this.reportChange(type, detail);
        })
            .catch(e => {
            this.reportError(type, detail, e);
        });
    }
}

// CONCATENATED MODULE: ./src/core.ts



const VERSION_INFO = "0.2.0";
class core_BpdStateManagerFactory {
    constructor(config) {
        this._config = config;
        this._states = new Map();
    }
    createState(name, initialValue, mutationHandler, config) {
        if (!Object(functions["b" /* is */])(name) || Object(functions["b" /* is */])(this._states.get(name))) {
            throw new errors["b" /* CreateStateError */]("State name was not provided");
        }
        this._states.set(name, new state_BpdState(name, initialValue, mutationHandler, config !== null && config !== void 0 ? config : this._config));
    }
    removeState(name) {
        this.executeIfValid(name, "RemoveSate", (state) => {
            this._states.delete(name);
        });
    }
    getState(name) {
        let resultState = undefined;
        this.executeIfValid(name, "GetState", (state) => {
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
    undo(name) {
        this.executeIfValid(name, "Undo", (state) => {
            state.undo();
        });
    }
    executeIfValid(name, methodName, callback) {
        if (!Object(functions["b" /* is */])(name)) {
            throw new errors["a" /* CommonError */](methodName + "Error", "State name is not provided");
        }
        let state = this._states.get(name);
        if (!Object(functions["b" /* is */])(state)) {
            throw new errors["a" /* CommonError */](methodName + "StateError", "State not found");
        }
        //@ts-ignore state must exists here
        callback(state);
    }
}


/***/ })
/******/ ]);
});
//# sourceMappingURL=bpdState.core.js.map