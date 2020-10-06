import { IncorrectDataError, WorkerNotReadyError } from "../helpers/errors";
import { is } from "../helpers/functions";
import { BpdStateAction } from "../interfaces";

export interface OnPerformCallback<V, P> {
    (action: BpdStateAction<V>): Promise<P>;
}

export interface OnUpdateCallback<V, P> {
    (result: P, action?: BpdStateAction<V>): void;
}

export interface OnErrorCallback<V> {
    (error: Error, action?: BpdStateAction<V>): void;
}

export interface IBpdStateWorker<V, P> {
    perform(action: BpdStateAction<V>): void
    onPerform(callback: OnPerformCallback<V, P>): void;
    onUpdate(callback: OnUpdateCallback<V, P>): void;
    onError(callback: OnErrorCallback<V>): void;
}

export class BpdStateWorker<V, P> implements IBpdStateWorker<V, P> {
    #queue: BpdStateAction<V>[];
    #queuelock: boolean;
    #lock: boolean;
    #onPerform: OnPerformCallback<V, P> | undefined;
    #onUpdate: OnUpdateCallback<V, P> | undefined;
    #onError: OnErrorCallback<V> | undefined;
    constructor() {
        this.#queue = [];
        this.#lock = false;
        this.#queuelock = false;
        this.#onError = undefined;
        this.#onPerform = undefined;
        this.#onUpdate = undefined;

    }

    onPerform(callback: OnPerformCallback<V, P>) {
        this.#onPerform = callback;
    }

    onUpdate(callback: OnUpdateCallback<V, P>) {
        this.#onUpdate = callback;
    }

    onError(callback: OnErrorCallback<V>) {
        this.#onError = callback;
    }

    perform(action: BpdStateAction<V>) {
        if (!is(action)) {
            throw new IncorrectDataError("Inproper action object passed to worker")
        }
        if (!is(this.#onPerform) || !is(this.#onUpdate)) {
            throw new WorkerNotReadyError("Callbacks are not set");
        }
        if (!this.isInQueue(action)) {
            this.#queue.push(action);
        }
        this.run();
    }

    private run() {
        if (this.#queuelock || this.#lock || !is(this.#queue)) {
            return;
        }
        this.#lock = true;
        let current = this.#queue.shift();
        if (!current) {
            this.#lock = false;
            this.run();
        }
        if (this.#onPerform && current) {
            this.#onPerform(current).then((state: P) => {
                if (this.#onUpdate) {
                    this.#onUpdate(state, current);
                }
                this.#lock = false;
                this.run();
            }).catch(e => {
                if (this.#onError) {
                    this.#onError(e, current);
                }
            });
        }
    }

    private isInQueue(action: BpdStateAction<V>) {
        this.#queuelock = true;
        let index = this.#queue.findIndex(value => {
            return action.action === value.action && value.data === action.data;
        })
        this.#queuelock = false;
        return index > -1;
    }
}