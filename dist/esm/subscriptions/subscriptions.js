var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { IncorrectDataError } from "../helpers/errors";
import { counter, is } from "../helpers/functions";
export class SubscriptionsManager {
    constructor(id) {
        if (!is(id)) {
            throw new IncorrectDataError("Valid Id is required");
        }
        this._subscribers = [];
        this._id = id;
        this._counter = counter();
        this._onError = undefined;
    }
    subscribe(callback, options) {
        let subscriber = this.createSubscriber(callback, options);
        this._subscribers.push(subscriber);
        return subscriber.id;
    }
    unsubscribe(subscribtionId) {
        if (!is(subscribtionId)) {
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
