import { CreateStateError, IncorrectDataError, InitStateError } from "./helpers/errors";
import { counter, is } from "./helpers/functions";
import { ISubscriptionsManager, SubscriptionsManager } from "./subscriptions/subscriptions";
import { BpdStateWorker, IBpdStateWorker } from "./worker";

export const VERSION_INFO = "0.1.0";

export type OnChangeEventType = "action" | "lib";

export interface BpdStateOnChange<V> {
    (stateId: string, type: OnChangeEventType, detail: string, state: V): void;
}

export interface BpdStateOnError {
    (stateId: string, type: OnChangeEventType, error: Error, detail: string): void;
}

export interface BpdStateAction<T> {
    action: string;
    data: T;
}

export interface StateManager<V> {
    [stateId: string]: V;
}

export interface BpdStateManagerConfig<V> {
    onChange?: BpdStateOnChange<V>;
    onError?: BpdStateOnError;
}

export interface StatePerformer<V, P> {
    (state: P, action: BpdStateAction<V>): P;
}

export interface BpdManagedStates<VStates, TActions> {
    [id: string]: IBpdState<VStates, TActions>;
}

export interface IBpdState<VState, PAction> {
    perform(action: BpdStateAction<PAction>, callback?: (state: VState) => void): void;
    subscribe(callback: (state: VState) => void): string;
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
        if (is(callback)) {
            this.#subscriptionManager.subscribe(callback, {
                singleRun: true
            })
        }
        this.#worker.perform(action);
    }

    subscribe(callback: (state: VState) => void): string {
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

    private onWorkerChange(action: BpdStateAction<PAction>, state: VState) {
        if (['number', 'string', 'boolean'].includes(typeof state) || Array.isArray(state)) {
            this.#state = state;
        } else {
            this.#state = { ...state };
        }
        this.#subscriptionManager.notify(state)
            .then((result) => {
                this.reportChange('action', action.action)
            })
            .catch(e => {
                this.reportError("action", action.action, e)
            })
    }

    private onWorkerPerform(action: BpdStateAction<PAction>) {
        return new Promise<VState>((resolve) => {
            resolve(this.#performer(this.#state, action));
        })
    }

    private onWorkerError(action: BpdStateAction<PAction>, e: Error): void {
        this.reportError('action', action.action, e);
    }

    private onSubscriberError(e: Error) {
        this.reportError('lib', "Subscribers error", e);
    }

    private reportError(type: OnChangeEventType, detail: string, e: Error) {
        if (is(this.#config.onError)) {
            this.#config.onError(this.#id, type, e, detail)
        }
    }

    private reportChange(type: OnChangeEventType, detail: string) {
        if (is(this.#config.onChange)) {
            this.#config.onChange(this.#id, type, detail, this.#state)
        }
    }

}

export class BpdStateManager<VStates, TActions> {
    #config: BpdStateManagerConfig<VStates>;
    #states: BpdManagedStates<VStates, TActions>;
    constructor(config?: BpdStateManagerConfig<VStates>) {
        this.#config = config;
        this.#states = {};
    }

    createState(name: string, initialValue: VStates, performer: StatePerformer<TActions, VStates>, config?: BpdStateManagerConfig<VStates>) {
        if (!is(name)) {
            throw new CreateStateError("State name was not provided");
        }
        this.#states[name] = new BpdState(name, initialValue, performer, config ?? this.#config);
    }

    removeState(name: string) {
        let state = this.#states[name];
        if (is(state)) {
            delete this.#states[name];
        }
    }

    getState(name: string) {
        return this.#states[name]?.getState();
    }

    perform(name: string, action: BpdStateAction<TActions>, callback?: (state: VStates) => void) {
        this.#states[name]?.perform(action, callback);
    }

    subscribe(name: string, callback: (state: VStates) => void): string {
        return this.#states[name]?.subscribe(callback);
    }

    unsubscribe(name: string, id: string) {
        this.#states[name]?.unsubscribe(id);
    }
}