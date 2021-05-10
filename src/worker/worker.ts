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
    private _queue: BpdStateAction<V>[];
    private _queuelock: boolean;
    private _lock: boolean;
    private _onPerform: OnPerformCallback<V, P> | undefined;
    private _onUpdate: OnUpdateCallback<V, P> | undefined;
    private _onError: OnErrorCallback<V> | undefined;
    constructor() {
        this._queue = [];
        this._lock = false;
        this._queuelock = false;
        this._onError = undefined;
        this._onPerform = undefined;
        this._onUpdate = undefined;

    }

    onPerform(callback: OnPerformCallback<V, P>) {
        this._onPerform = callback;
    }

    onUpdate(callback: OnUpdateCallback<V, P>) {
        this._onUpdate = callback;
    }

    onError(callback: OnErrorCallback<V>) {
        this._onError = callback;
    }

    perform(action: BpdStateAction<V>) {
        if (!is(action)) {
            throw new IncorrectDataError("Inproper action object passed to worker")
        }
        if (!is(this._onPerform) || !is(this._onUpdate)) {
            throw new WorkerNotReadyError("Callbacks are not set");
        }
        if (!this.isInQueue(action)) {
            this._queue.push(action);
        }
        this.run();
    }

    private run() {
        if (this._queuelock || this._lock || !is(this._queue)) {
            return;
        }
        this._lock = true;
        let current = this._queue.shift();
        if (!current) {
            this._lock = false;
            this.run();
        }
        if (this._onPerform && current) {
            this._onPerform(current).then((state: P) => {
                if (this._onUpdate) {
                    this._onUpdate(state, current);
                }
                this._lock = false;
                this.run();
            }).catch(e => {
                if (this._onError) {
                    this._onError(e, current);
                }
            });
        }
    }

    private isInQueue(action: BpdStateAction<V>) {
        this._queuelock = true;
        let index = this._queue.findIndex(value => {
            return action.action === value.action && value.data === action.data;
        })
        this._queuelock = false;
        return index > -1;
    }
}