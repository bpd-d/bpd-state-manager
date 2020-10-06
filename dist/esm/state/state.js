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
var _state, _id, _config, _worker, _performer, _subscriptionManager;
import { InitStateError, IncorrectDataError } from "../helpers/errors";
import { is } from "../helpers/functions";
import { SubscriptionsManager } from "../subscriptions/subscriptions";
import { BpdStateWorker } from "../worker/worker";
export class BpdState {
    constructor(id, init, performer, config) {
        _state.set(this, void 0);
        _id.set(this, void 0);
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
        __classPrivateFieldSet(this, _id, id);
        __classPrivateFieldSet(this, _state, init);
        __classPrivateFieldSet(this, _config, config !== null && config !== void 0 ? config : {});
        __classPrivateFieldSet(this, _performer, performer);
        __classPrivateFieldSet(this, _worker, new BpdStateWorker());
        __classPrivateFieldGet(this, _worker).onUpdate(this.onWorkerChange.bind(this));
        __classPrivateFieldGet(this, _worker).onPerform(this.onWorkerPerform.bind(this));
        __classPrivateFieldGet(this, _worker).onError(this.onWorkerError.bind(this));
        __classPrivateFieldSet(this, _subscriptionManager, new SubscriptionsManager(__classPrivateFieldGet(this, _id)));
        __classPrivateFieldGet(this, _subscriptionManager).onError(this.onSubscriberError.bind(this));
    }
    perform(action, callback) {
        if (!is(action)) {
            this.reportError("lib", "In proper action object", new IncorrectDataError("In proper action object"));
        }
        if (callback) {
            __classPrivateFieldGet(this, _subscriptionManager).subscribe(callback, {
                singleRun: true
            });
        }
        __classPrivateFieldGet(this, _worker).perform(action);
    }
    subscribe(callback) {
        if (!is(callback)) {
            this.reportError("lib", "", new IncorrectDataError("Callback has not been set"));
            return undefined;
        }
        return __classPrivateFieldGet(this, _subscriptionManager).subscribe(callback);
    }
    unsubscribe(id) {
        if (!is(id)) {
            return false;
        }
        __classPrivateFieldGet(this, _subscriptionManager).unsubscribe(id);
        return true;
    }
    getState() {
        return __classPrivateFieldGet(this, _state);
    }
    onWorkerChange(state, action) {
        if (['number', 'string', 'boolean'].includes(typeof state) || Array.isArray(state)) {
            __classPrivateFieldSet(this, _state, state);
        }
        else {
            __classPrivateFieldSet(this, _state, Object.assign({}, state));
        }
        __classPrivateFieldGet(this, _subscriptionManager).notify(state)
            .then((result) => {
            this.reportChange('action', action ? action.action : "");
        })
            .catch(e => {
            this.reportError("action", action ? action.action : "", e);
        });
    }
    onWorkerPerform(action) {
        return new Promise((resolve) => {
            resolve(__classPrivateFieldGet(this, _performer).call(this, __classPrivateFieldGet(this, _state), action));
        });
    }
    onWorkerError(e, action) {
        this.reportError('action', action ? action.action : "", e);
    }
    onSubscriberError(e) {
        this.reportError('lib', "Subscribers error", e);
    }
    reportError(type, detail, e) {
        if (__classPrivateFieldGet(this, _config) && __classPrivateFieldGet(this, _config).onError) {
            __classPrivateFieldGet(this, _config).onError(__classPrivateFieldGet(this, _id), type, e, detail);
        }
    }
    reportChange(type, detail) {
        if (__classPrivateFieldGet(this, _config) && __classPrivateFieldGet(this, _config).onChange) {
            __classPrivateFieldGet(this, _config).onChange(__classPrivateFieldGet(this, _id), type, detail, __classPrivateFieldGet(this, _state));
        }
    }
}
_state = new WeakMap(), _id = new WeakMap(), _config = new WeakMap(), _worker = new WeakMap(), _performer = new WeakMap(), _subscriptionManager = new WeakMap();
