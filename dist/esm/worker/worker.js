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
var _queue, _queuelock, _lock, _callback, _onUpdate, _onError;
import { IncorrectDataError, WorkerNotReadyError } from "../helpers/errors";
import { is } from "../helpers/functions";
export class BpdStateWorker {
    constructor() {
        _queue.set(this, void 0);
        _queuelock.set(this, void 0);
        _lock.set(this, void 0);
        _callback.set(this, void 0);
        _onUpdate.set(this, void 0);
        _onError.set(this, void 0);
        __classPrivateFieldSet(this, _queue, []);
        __classPrivateFieldSet(this, _lock, false);
        __classPrivateFieldSet(this, _queuelock, false);
        __classPrivateFieldSet(this, _onError, undefined);
        __classPrivateFieldSet(this, _callback, undefined);
        __classPrivateFieldSet(this, _onUpdate, undefined);
    }
    onPerform(callback) {
        __classPrivateFieldSet(this, _callback, callback);
    }
    onUpdate(callback) {
        __classPrivateFieldSet(this, _onUpdate, callback);
    }
    onError(callback) {
        __classPrivateFieldSet(this, _onError, callback);
    }
    perform(action) {
        if (!is(action)) {
            throw new IncorrectDataError("Inproper action object passed to worker");
        }
        if (!is(__classPrivateFieldGet(this, _callback)) || !is(__classPrivateFieldGet(this, _onUpdate))) {
            throw new WorkerNotReadyError("Callbacks are not set");
        }
        if (!this.isInQueue(action)) {
            __classPrivateFieldGet(this, _queue).push(action);
        }
        this.run();
    }
    run() {
        if (__classPrivateFieldGet(this, _queuelock) || __classPrivateFieldGet(this, _lock) || !is(__classPrivateFieldGet(this, _queue))) {
            return;
        }
        __classPrivateFieldSet(this, _lock, true);
        let current = __classPrivateFieldGet(this, _queue).shift();
        if (!current) {
            __classPrivateFieldSet(this, _lock, false);
            this.run();
        }
        if (__classPrivateFieldGet(this, _callback) && current) {
            __classPrivateFieldGet(this, _callback).call(this, current).then((state) => {
                if (__classPrivateFieldGet(this, _onUpdate)) {
                    __classPrivateFieldGet(this, _onUpdate).call(this, state, current);
                }
                __classPrivateFieldSet(this, _lock, false);
                this.run();
            }).catch(e => {
                if (__classPrivateFieldGet(this, _onError)) {
                    __classPrivateFieldGet(this, _onError).call(this, e, current);
                }
            });
        }
    }
    isInQueue(action) {
        __classPrivateFieldSet(this, _queuelock, true);
        let index = __classPrivateFieldGet(this, _queue).findIndex(value => {
            return action.action === value.action && value.data === action.data;
        });
        __classPrivateFieldSet(this, _queuelock, false);
        return index > -1;
    }
}
_queue = new WeakMap(), _queuelock = new WeakMap(), _lock = new WeakMap(), _callback = new WeakMap(), _onUpdate = new WeakMap(), _onError = new WeakMap();
