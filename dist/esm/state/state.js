import { StateBackup } from "../helpers/backup";
import { ObjectCopyMaker } from "../helpers/copy";
import { InitStateError, IncorrectDataError } from "../helpers/errors";
import { is } from "../helpers/functions";
import { SubscriptionsManager } from "../subscriptions/subscriptions";
import { BpdStateWorker } from "../worker/worker";
const UNDO_ACTION_NAME = "$$UNDO_FROM_BACKUP";
export class BpdState {
    constructor(id, init, mutationHandler, config) {
        var _a;
        if (!is(id)) {
            throw new InitStateError("State id must be provided");
        }
        if (!is(init)) {
            throw new InitStateError("Initial value must be a valid, initialized object");
        }
        if (!is(mutationHandler)) {
            throw new InitStateError("Perfromer callback was not provided");
        }
        this._id = id;
        this._state = init;
        this._config = config !== null && config !== void 0 ? config : {};
        this._mutationHandler = mutationHandler;
        this._worker = new BpdStateWorker();
        this._worker.onUpdate(this.onWorkerChange.bind(this));
        this._worker.onPerform(this.onWorkerPerform.bind(this));
        this._worker.onError(this.onWorkerError.bind(this));
        this._subscriptionManager = new SubscriptionsManager(this._id);
        this._subscriptionManager.onError(this.onSubscriberError.bind(this));
        this._copyMaker = (_a = this._config.copyMaker) !== null && _a !== void 0 ? _a : new ObjectCopyMaker();
        this._backup = new StateBackup();
    }
    /**
     * Performs an action on the state
     * @param action - action to be performed
     * @param callback - optional - subscription callback for one time execution
     */
    perform(action, callback) {
        if (!is(action)) {
            this.reportError("lib", "In proper action object", new IncorrectDataError("In proper action object"));
        }
        if (callback) {
            this._subscriptionManager.subscribe(callback, {
                singleRun: true
            });
        }
        this._worker.perform(action);
    }
    /**
     * Attaches new subscriber to state
     * @param callback Function to be assigned to subscriber
     */
    subscribe(callback) {
        if (!is(callback)) {
            this.reportError("lib", "", new IncorrectDataError("Callback has not been set"));
            return undefined;
        }
        return this._subscriptionManager.subscribe(callback);
    }
    /**
     * Removes subscriber from the state
     * @param id subscription identifier
     */
    unsubscribe(id) {
        if (!is(id)) {
            return false;
        }
        this._subscriptionManager.unsubscribe(id);
        return true;
    }
    /**
     * Returns current state
     */
    getState() {
        return this._copyMaker.copy(this._state);
    }
    /**
     * Performs undo on state
     */
    undo() {
        this._worker.perform({ action: UNDO_ACTION_NAME });
    }
    /**
     * Callback invoked by a worker when state change perform is completed
     * Method assigns new state and calls subscription manager to notify subscribers about the change
     * @param state - new state value
     * @param action - executed action
     */
    onWorkerChange(state, action) {
        if (action && action.action === UNDO_ACTION_NAME) {
            this.assignStateAndNotify(state, "lib", "Undo from backup");
        }
        else {
            this._backup.push(this._copyMaker.copy(this._state));
            this.assignStateAndNotify(state, "action", action ? action.action : "");
        }
    }
    /**
     * Callback on workerk that creates a promise that executes perfromer on passed action
     * @param action action to be perfromed
     */
    onWorkerPerform(action) {
        if (action && action.action === UNDO_ACTION_NAME) {
            return new Promise((resolve) => {
                let lastValue = this._backup.undo();
                resolve(lastValue !== null && lastValue !== void 0 ? lastValue : this._copyMaker.copy(this._state));
            });
        }
        return new Promise((resolve) => {
            resolve(this._mutationHandler(this._copyMaker.copy(this._state), action));
        });
    }
    onWorkerError(e, action) {
        this.reportError('action', action ? action.action : "", e);
    }
    onSubscriberError(e) {
        this.reportError('lib', "Subscribers error", e);
    }
    reportError(type, detail, e) {
        if (this._config && this._config.onError) {
            this._config.onError(this._id, type, e, detail);
        }
    }
    reportChange(type, detail) {
        if (this._config && this._config.onChange) {
            this._config.onChange(this._id, type, detail, this._state);
        }
    }
    assignStateAndNotify(state, type, detail) {
        this._state = this._copyMaker.copy(state);
        this._subscriptionManager.notify(state)
            .then((result) => {
            this.reportChange(type, detail);
        })
            .catch(e => {
            this.reportError(type, detail, e);
        });
    }
}
