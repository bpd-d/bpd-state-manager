import { IncorrectDataError, PerformerError, WorkerNotReadyError } from "./helpers/errors";
import { is } from "./helpers/functions";
import { BpdStateAction } from "./index";

export interface OnPerformCallback<V, P> {
    (action: BpdStateAction<V>): Promise<P>;
}

export interface OnUpdateCallback<V, P> {
    (action: BpdStateAction<V>, result: P): void;
}

export interface OnErrorCallback<V> {
    (action: BpdStateAction<V>, error: Error): void;
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
    #callback: OnPerformCallback<V, P>;
    #onUpdate: OnUpdateCallback<V, P>;
    #onError: OnErrorCallback<V>;
    constructor() {
        this.#queue = [];
        this.#lock = false;
        this.#queuelock = false;

    }

    onPerform(callback: OnPerformCallback<V, P>) {
        this.#callback = callback;
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
        if (!is(this.#callback) || !is(this.#onUpdate)) {
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
        this.#callback(current).then((state: P) => {
            this.#onUpdate(current, state);
            this.#lock = false;
            this.run();
        }).catch(e => {
            if (this.#onError) {
                this.#onError(current, e);
            }
        });
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