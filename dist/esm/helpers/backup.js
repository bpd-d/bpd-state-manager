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
var _states, _maxCount;
export class StateBackup {
    constructor() {
        _states.set(this, void 0);
        _maxCount.set(this, void 0);
        __classPrivateFieldSet(this, _states, []);
        __classPrivateFieldSet(this, _maxCount, 20);
    }
    push(v) {
        if (__classPrivateFieldGet(this, _states).length >= __classPrivateFieldGet(this, _maxCount)) {
            __classPrivateFieldGet(this, _states).shift();
        }
        __classPrivateFieldGet(this, _states).push(v);
    }
    undo() {
        if (__classPrivateFieldGet(this, _states).length > 0) {
            return __classPrivateFieldGet(this, _states).pop();
        }
        return undefined;
    }
}
_states = new WeakMap(), _maxCount = new WeakMap();
