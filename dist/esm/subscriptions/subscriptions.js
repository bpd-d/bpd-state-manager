var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var _subscribers, _onError, _counter, _id;
import { IncorrectDataError } from "../helpers/errors";
import { counter, is } from "../helpers/functions";
export class SubscriptionsManager {
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
