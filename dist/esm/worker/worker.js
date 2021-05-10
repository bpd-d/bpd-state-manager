import { IncorrectDataError, WorkerNotReadyError } from "../helpers/errors";
import { is } from "../helpers/functions";
export class BpdStateWorker {
    constructor() {
        this._queue = [];
        this._lock = false;
        this._queuelock = false;
        this._onError = undefined;
        this._onPerform = undefined;
        this._onUpdate = undefined;
    }
    onPerform(callback) {
        this._onPerform = callback;
    }
    onUpdate(callback) {
        this._onUpdate = callback;
    }
    onError(callback) {
        this._onError = callback;
    }
    perform(action) {
        if (!is(action)) {
            throw new IncorrectDataError("Inproper action object passed to worker");
        }
        if (!is(this._onPerform) || !is(this._onUpdate)) {
            throw new WorkerNotReadyError("Callbacks are not set");
        }
        if (!this.isInQueue(action)) {
            this._queue.push(action);
        }
        this.run();
    }
    run() {
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
            this._onPerform(current).then((state) => {
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
    isInQueue(action) {
        this._queuelock = true;
        let index = this._queue.findIndex(value => {
            return action.action === value.action && value.data === action.data;
        });
        this._queuelock = false;
        return index > -1;
    }
}
