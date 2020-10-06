import { InitStateError, IncorrectDataError } from "../helpers/errors";
import { is } from "../helpers/functions";
import { BpdStateAction, BpdStateManagerConfig, OnChangeEventType, StatePerformer } from "../interfaces";
import { ISubscriptionsManager, SubscriptionsManager } from "../subscriptions/subscriptions";
import { IBpdStateWorker, BpdStateWorker } from "../worker/worker";

export interface IBpdState<VState, PAction> {
    perform(action: BpdStateAction<PAction>, callback?: (state: VState) => void | undefined): void;
    subscribe(callback: (state: VState) => void): string | undefined;
    unsubscribe(id: string): boolean;
    getState(): VState;
}

export class BpdState<VState, PAction> implements IBpdState<VState, PAction> {
    #state: VState;
    #id: string;
    #config: BpdStateManagerConfig<VState>;
    #worker: IBpdStateWorker<PAction, VState>;
    #performer: StatePerformer<PAction, VState>;
    #subscriptionManager: ISubscriptionsManager<VState>;

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
        return this.#state;
    }

    private onWorkerChange(state: VState, action?: BpdStateAction<PAction>,) {
        if (['number', 'string', 'boolean'].includes(typeof state) || Array.isArray(state)) {
            this.#state = state;
        } else {
            this.#state = { ...state };
        }
        this.#subscriptionManager.notify(state)
            .then((result) => {
                this.reportChange('action', action ? action.action : "")
            })
            .catch(e => {
                this.reportError("action", action ? action.action : "", e)
            })
    }

    private onWorkerPerform(action: BpdStateAction<PAction>) {
        return new Promise<VState>((resolve) => {
            resolve(this.#performer(this.#state, action));
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

}