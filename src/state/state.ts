import { IStateBackup, StateBackup } from "../helpers/backup";
import { ObjectCopyMaker } from "../helpers/copy";
import { InitStateError, IncorrectDataError } from "../helpers/errors";
import { is } from "../helpers/functions";
import { BpdStateAction, BpdStateManagerConfig, IObjectCopyMaker, OnChangeEventType, StatePerformer } from "../interfaces";
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
    #state: VState;
    #backup: IStateBackup<VState>;
    #id: string;
    #config: BpdStateManagerConfig<VState>;
    #worker: IBpdStateWorker<PAction, VState>;
    #performer: StatePerformer<PAction, VState>;
    #subscriptionManager: ISubscriptionsManager<VState>;
    #copyMaker: IObjectCopyMaker<VState>;

    constructor(id: string, init: VState, performer: StatePerformer<PAction, VState>, config?: BpdStateManagerConfig<VState>) {
        if (!is(id)) {
            throw new InitStateError("State id must be provided")
        }
        if (!is(init)) {
            throw new InitStateError("Initial value must be a valid, initialized object")
        }
        if (!is(performer)) {
            throw new InitStateError("Perfromer callback was not provided")
        }
        this.#id = id;
        this.#state = init;
        this.#config = config ?? {};
        this.#performer = performer;
        this.#worker = new BpdStateWorker<PAction, VState>();
        this.#worker.onUpdate(this.onWorkerChange.bind(this))
        this.#worker.onPerform(this.onWorkerPerform.bind(this));
        this.#worker.onError(this.onWorkerError.bind(this));
        this.#subscriptionManager = new SubscriptionsManager(this.#id);
        this.#subscriptionManager.onError(this.onSubscriberError.bind(this));
        this.#copyMaker = this.#config.copyMaker ?? new ObjectCopyMaker();
        this.#backup = new StateBackup();
    }

    perform(action: BpdStateAction<PAction>, callback?: (state: VState) => void) {
        if (!is(action)) {
            this.reportError("lib", "In proper action object", new IncorrectDataError("In proper action object"))
        }
        if (callback) {
            this.#subscriptionManager.subscribe(callback, {
                singleRun: true
            })
        }
        this.#worker.perform(action);
    }

    subscribe(callback: (state: VState) => void): string | undefined {
        if (!is(callback)) {
            this.reportError("lib", "", new IncorrectDataError("Callback has not been set"))
            return undefined;
        }
        return this.#subscriptionManager.subscribe(callback)
    }

    unsubscribe(id: string): boolean {
        if (!is(id)) {
            return false;
        }
        this.#subscriptionManager.unsubscribe(id);
        return true;
    }

    getState(): VState {
        return this.#copyMaker.copy(this.#state);
    }

    undo(): void {
        this.#worker.perform({ action: UNDO_ACTION_NAME});
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
            this.#backup.push(this.#copyMaker.copy(this.#state));
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
                let lastValue = this.#backup.undo();
                resolve(lastValue ?? this.#copyMaker.copy(this.#state));
            })
        }

        return new Promise<VState>((resolve) => {
            resolve(this.#performer(this.#copyMaker.copy(this.#state), action));
        })
    }

    private onWorkerError(e: Error, action?: BpdStateAction<PAction>): void {
        this.reportError('action', action ? action.action : "", e);
    }

    private onSubscriberError(e: Error) {
        this.reportError('lib', "Subscribers error", e);
    }

    private reportError(type: OnChangeEventType, detail: string, e: Error) {
        if (this.#config && this.#config.onError) {
            this.#config.onError(this.#id, type, e, detail)
        }
    }

    private reportChange(type: OnChangeEventType, detail: string) {
        if (this.#config && this.#config.onChange) {
            this.#config.onChange(this.#id, type, detail, this.#state)
        }
    }

    private assignStateAndNotify(state: VState, type: OnChangeEventType, detail: string) {
        this.#state = this.#copyMaker.copy(state);
        this.#subscriptionManager.notify(state)
            .then((result) => {
                this.reportChange(type, detail)
            })
            .catch(e => {
                this.reportError(type, detail, e)
            })
    }

}