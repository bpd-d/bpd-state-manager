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
    #subscribers: Subscriber<VState>[];
    #onError: ErrorCallback | undefined;
    #counter: Generator<number, void, unknown>;
    #id: string;
    constructor(id: string) {
        if (!is(id)) {
            throw new IncorrectDataError("Valid Id is required");
        }
        this.#subscribers = [];
        this.#id = id;
        this.#counter = counter();
        this.#onError = undefined;
    }

    subscribe(callback: (state: VState) => void, options?: SubscriberOptions): string {
        let subscriber = this.createSubscriber(callback, options);
        this.#subscribers.push(subscriber);
        return subscriber.id;
    }

    unsubscribe(subscribtionId: string): void {
        if (!is(subscribtionId)) {
            return;
        }
        let index = this.#subscribers.findIndex((subscirber: Subscriber<VState>) => {
            return subscirber.id === subscribtionId;
        })
        if (index < 0) {
            return;
        }
        this.#subscribers.splice(index, 1);
    }

    async notify(state: VState): Promise<boolean> {
        let toRemove: string[] = []
        this.#subscribers.forEach(sub => {
            if (sub.options && sub.options.singleRun) {
                toRemove.push(sub.id);
            }
            try {
                sub.callback(state);
            } catch (e) {
                toRemove.push(sub.id);
                if (this.#onError) {
                    this.#onError(e);
                }
            }
        })
        toRemove.forEach(id => this.unsubscribe(id));
        return true;
    }

    onError(callback: (e: Error) => void) {
        this.#onError = callback;
    }

    getSubscribers(): Subscriber<VState>[] {
        return [...this.#subscribers];
    }

    private createSubscriber(callback: (state: VState) => void, options?: SubscriberOptions): Subscriber<VState> {
        return {
            id: this.generateId(),
            options: options,
            callback: callback
        }
    }

    private generateId(): string {
        return `${this.#id}:${this.#counter.next().value}`;
    }
}