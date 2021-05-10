import { IStateBackup, StateBackup } from "../helpers/backup";
import { ObjectCopyMaker } from "../helpers/copy";
import { InitStateError, IncorrectDataError } from "../helpers/errors";
import { is } from "../helpers/functions";
import { BpdStateAction, BpdStateManagerConfig, IObjectCopyMaker, OnChangeEventType, StateMutationHandler } from "../interfaces";
import { ISubscriptionsManager, SubscriptionsManager } from "../subscriptions/subscriptions";
import { IBpdStateWorker, BpdStateWorker } from "../worker/worker";

const UNDO_ACTION_NAME = "$$UNDO_FROM_BACKUP";

export interface IBpdState<VState, PAction> {
    perform(action: BpdStateAction<PAction>, callback?: (state: VState) => void | undefined): void;
    subscribe(callback: (state: VState) => void): string | undefined;
    unsubscribe(id: string): boolean;
    getState(): VState;
    undo(): void;
}

export class BpdState<VState, PAction> implements IBpdState<VState, PAction> {
    private _state: VState;
    private _backup: IStateBackup<VState>;
    private _id: string;
    private _config: BpdStateManagerConfig<VState>;
    private _worker: IBpdStateWorker<PAction, VState>;
    private _mutationHandler: StateMutationHandler<PAction, VState>;
    private _subscriptionManager: ISubscriptionsManager<VState>;
    private _copyMaker: IObjectCopyMaker<VState>;

    constructor(id: string, init: VState, mutationHandler: StateMutationHandler<PAction, VState>, config?: BpdStateManagerConfig<VState>) {
        if (!is(id)) {
            throw new InitStateError("State id must be provided")
        }
        if (!is(init)) {
            throw new InitStateError("Initial value must be a valid, initialized object")
        }
        if (!is(mutationHandler)) {
            throw new InitStateError("Perfromer callback was not provided")
        }
        this._id = id;
        this._state = init;
        this._config = config ?? {};
        this._mutationHandler = mutationHandler;
        this._worker = new BpdStateWorker<PAction, VState>();
        this._worker.onUpdate(this.onWorkerChange.bind(this))
        this._worker.onPerform(this.onWorkerPerform.bind(this));
        this._worker.onError(this.onWorkerError.bind(this));
        this._subscriptionManager = new SubscriptionsManager(this._id);
        this._subscriptionManager.onError(this.onSubscriberError.bind(this));
        this._copyMaker = this._config.copyMaker ?? new ObjectCopyMaker();
        this._backup = new StateBackup();
    }

    /**
     * Performs an action on the state
     * @param action - action to be performed
     * @param callback - optional - subscription callback for one time execution
     */
    perform(action: BpdStateAction<PAction>, callback?: (state: VState) => void) {
        if (!is(action)) {
            this.reportError("lib", "In proper action object", new IncorrectDataError("In proper action object"))
        }
        if (callback) {
            this._subscriptionManager.subscribe(callback, {
                singleRun: true
            })
        }
        this._worker.perform(action);
    }

    /**
     * Attaches new subscriber to state
     * @param callback Function to be assigned to subscriber
     */
    subscribe(callback: (state: VState) => void): string | undefined {
        if (!is(callback)) {
            this.reportError("lib", "", new IncorrectDataError("Callback has not been set"))
            return undefined;
        }
        return this._subscriptionManager.subscribe(callback)
    }

    /**
     * Removes subscriber from the state
     * @param id subscription identifier
     */
    unsubscribe(id: string): boolean {
        if (!is(id)) {
            return false;
        }
        this._subscriptionManager.unsubscribe(id);
        return true;
    }

    /**
     * Returns current state
     */
    getState(): VState {
        return this._copyMaker.copy(this._state);
    }

    /**
     * Performs undo on state
     */
    undo(): void {
        this._worker.perform({ action: UNDO_ACTION_NAME });
    }

    /**
     * Callback invoked by a worker when state change perform is completed
     * Method assigns new state and calls subscription manager to notify subscribers about the change
     * @param state - new state value
     * @param action - executed action
     */
    private onWorkerChange(state: VState, action?: BpdStateAction<PAction>) {
        if (action && action.action === UNDO_ACTION_NAME) {
            this.assignStateAndNotify(state, "lib", "Undo from backup");
        } else {
            this._backup.push(this._copyMaker.copy(this._state));
            this.assignStateAndNotify(state, "action", action ? action.action : "");
        }
    }

    /**
     * Callback on workerk that creates a promise that executes perfromer on passed action
     * @param action action to be perfromed
     */
    private onWorkerPerform(action: BpdStateAction<PAction>) {
        if (action && action.action === UNDO_ACTION_NAME) {
            return new Promise<VState>((resolve) => {
                let lastValue = this._backup.undo();
                resolve(lastValue ?? this._copyMaker.copy(this._state));
            })
        }

        return new Promise<VState>((resolve) => {
            resolve(this._mutationHandler(this._copyMaker.copy(this._state), action));
        })
    }

    private onWorkerError(e: Error, action?: BpdStateAction<PAction>): void {
        this.reportError('action', action ? action.action : "", e);
    }

    private onSubscriberError(e: Error) {
        this.reportError('lib', "Subscribers error", e);
    }

    private reportError(type: OnChangeEventType, detail: string, e: Error) {
        if (this._config && this._config.onError) {
            this._config.onError(this._id, type, e, detail)
        }
    }

    private reportChange(type: OnChangeEventType, detail: string) {
        if (this._config && this._config.onChange) {
            this._config.onChange(this._id, type, detail, this._state)
        }
    }

    private assignStateAndNotify(state: VState, type: OnChangeEventType, detail: string) {
        this._state = this._copyMaker.copy(state);
        this._subscriptionManager.notify(state)
            .then((result) => {
                this.reportChange(type, detail)
            })
            .catch(e => {
                this.reportError(type, detail, e)
            })
    }

}