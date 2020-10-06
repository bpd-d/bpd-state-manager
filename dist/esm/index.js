var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _config, _states;
import { CommonError, CreateStateError, StateManagerShorthandError } from "./helpers/errors";
import { is } from "./helpers/functions";
import { BpdState } from "./state/state";
export const VERSION_INFO = "0.1.1";
export class BpdStateManagerFactory {
    constructor(config) {
        _config.set(this, void 0);
        _states.set(this, void 0);
        __classPrivateFieldSet(this, _config, config);
        __classPrivateFieldSet(this, _states, {});
    }
    createState(name, initialValue, performer, config) {
        if (!is(name)) {
            throw new CreateStateError("State name was not provided");
        }
        __classPrivateFieldGet(this, _states)[name] = new BpdState(name, initialValue, performer, config !== null && config !== void 0 ? config : __classPrivateFieldGet(this, _config));
    }
    removeState(name) {
        this.executeIfValid(name, "Perform", (state) => {
            delete __classPrivateFieldGet(this, _states)[name];
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
    undo(name) {
        this.executeIfValid(name, "Undo", (state) => {
            state.undo();
        });
    }
    executeIfValid(name, methodName, callback) {
        if (!is(name)) {
            throw new CommonError(methodName + "Error", "State name is not provided");
        }
        let state = __classPrivateFieldGet(this, _states)[name];
        if (!is(state)) {
            throw new CommonError(methodName + "StateError", "State not found");
        }
        callback(state);
    }
}
_config = new WeakMap(), _states = new WeakMap();
export class BpdStateManager {
    static createStateManager(config) {
        window.$bdpStateManager = new BpdStateManagerFactory(config);
    }
    static createState(name, initialValue, performer, config) {
        if (!is(window.$bdpStateManager)) {
            throw new StateManagerShorthandError("createState", "Manager must be initialized first with createStateManager");
        }
        window.$bdpStateManager.createState(name, initialValue, performer, config);
    }
    static removeState(name) {
        if (!is(window.$bdpStateManager)) {
            throw new StateManagerShorthandError("removeState", "Manager must be initialized first with createStateManager");
        }
        window.$bdpStateManager.removeState(name);
    }
    static getState(name) {
        if (!is(window.$bdpStateManager)) {
            throw new StateManagerShorthandError("getState", "Manager must be initialized first with createStateManager");
        }
        return window.$bdpStateManager.getState(name);
    }
    static performStateAction(name, action, callback) {
        if (!is(window.$bdpStateManager)) {
            throw new StateManagerShorthandError("perform", "Manager must be initialized first with createStateManager");
        }
        window.$bdpStateManager.perform(name, action, callback);
    }
    static subscribeToState(name, callback) {
        if (!is(window.$bdpStateManager)) {
            throw new StateManagerShorthandError("subscribe", "Manager must be initialized first with createStateManager");
        }
        return window.$bdpStateManager.subscribe(name, callback);
    }
    static unsubscribeFromState(name, id) {
        if (!is(window.$bdpStateManager)) {
            throw new StateManagerShorthandError("unsubscribe", "Manager must be initialized first with createStateManager");
        }
        window.$bdpStateManager.unsubscribe(name, id);
    }
    static undoState(name) {
        if (!is(window.$bdpStateManager)) {
            throw new StateManagerShorthandError("unsubscribe", "Manager must be initialized first with createStateManager");
        }
        window.$bdpStateManager.undo(name);
    }
}
