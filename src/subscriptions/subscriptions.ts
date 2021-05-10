import { IncorrectDataError } from "../helpers/errors";
import { counter, is } from "../helpers/functions";

export interface Subscriber<VState> {
    id: string,
    options?: SubscriberOptions;
    callback: (state: VState) => void;
}

export interface SubscriberOptions {
    singleRun: boolean;
}

interface ErrorCallback {
    (e: Error): void;
}

export interface ISubscriptionsManager<VState> {
    onError(callback: (e: Error) => void): void;
    subscribe(callback: (state: VState) => void, options?: SubscriberOptions): string;
    unsubscribe(subscribtionId: string): void;
    notify(state: VState): Promise<boolean>;
    getSubscribers(): Subscriber<VState>[];
}

export class SubscriptionsManager<VState> implements ISubscriptionsManager<VState>{
    private _subscribers: Subscriber<VState>[];
    private _onError: ErrorCallback | undefined;
    private _counter: Generator<number, void, unknown>;
    private _id: string;
    constructor(id: string) {
        if (!is(id)) {
            throw new IncorrectDataError("Valid Id is required");
        }
        this._subscribers = [];
        this._id = id;
        this._counter = counter();
        this._onError = undefined;
    }

    subscribe(callback: (state: VState) => void, options?: SubscriberOptions): string {
        let subscriber = this.createSubscriber(callback, options);
        this._subscribers.push(subscriber);
        return subscriber.id;
    }

    unsubscribe(subscribtionId: string): void {
        if (!is(subscribtionId)) {
            return;
        }
        let index = this._subscribers.findIndex((subscirber: Subscriber<VState>) => {
            return subscirber.id === subscribtionId;
        })
        if (index < 0) {
            return;
        }
        this._subscribers.splice(index, 1);
    }

    async notify(state: VState): Promise<boolean> {
        let toRemove: string[] = []
        this._subscribers.forEach(sub => {
            if (sub.options && sub.options.singleRun) {
                toRemove.push(sub.id);
            }
            try {
                sub.callback(state);
            } catch (e) {
                toRemove.push(sub.id);
                if (this._onError) {
                    this._onError(e);
                }
            }
        })
        toRemove.forEach(id => this.unsubscribe(id));
        return true;
    }

    onError(callback: (e: Error) => void) {
        this._onError = callback;
    }

    getSubscribers(): Subscriber<VState>[] {
        return [...this._subscribers];
    }

    private createSubscriber(callback: (state: VState) => void, options?: SubscriberOptions): Subscriber<VState> {
        return {
            id: this.generateId(),
            options: options,
            callback: callback
        }
    }

    private generateId(): string {
        return `${this._id}:${this._counter.next().value}`;
    }
}