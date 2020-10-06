import { CommonError, CreateStateError, StateManagerShorthandError } from "./helpers/errors";
import { is } from "./helpers/functions";
import { BpdStateManagerConfig, StateMutationHandler, BpdStateAction, BpdManagedStates } from "./interfaces";
import { BpdState, IBpdState } from "./state/state";

export const VERSION_INFO = "0.1.4";
declare global {
    interface Window {
        $bdpStateManager: any;
    }
}

export class BpdStateManagerFactory<VStates, TActions> {
    #config: BpdStateManagerConfig<VStates> | undefined;
    #states: BpdManagedStates<VStates, TActions>;
    constructor(config?: BpdStateManagerConfig<VStates>) {
        this.#config = config;
        this.#states = {};
    }

    createState(name: string, initialValue: VStates, mutationHandler: StateMutationHandler<TActions, VStates>, config?: BpdStateManagerConfig<VStates>) {
        if (!is(name)) {
            throw new CreateStateError("State name was not provided");
        }
        this.#states[name] = new BpdState(name, initialValue, mutationHandler, config ?? this.#config);
    }

    removeState(name: string) {
        this.executeIfValid(name, "Perform", (state) => {
            delete this.#states[name];
        })
    }

    getState(name: string): IBpdState<VStates, TActions> | undefined {
        let resultState = undefined;
        this.executeIfValid(name, "Perform", (state) => {
            resultState = state;
        })
        return resultState;
    }

    perform(name: string, action: BpdStateAction<TActions>, callback?: (state: VStates) => void) {
        this.executeIfValid(name, "Perform", (state) => {
            state.perform(action, callback);
        })
    }

    subscribe(name: string, callback: (state: VStates) => void): string | undefined {
        let id = undefined;
        this.executeIfValid(name, "Subscribe", (state) => {
            id = state.subscribe(callback);
        })
        return id;
    }

    unsubscribe(name: string, id: string) {
        this.executeIfValid(name, "Unsubscribe", (state) => {
            state.unsubscribe(id);
        })
    }

    undo(name: string) {
        this.executeIfValid(name, "Undo", (state) => {
            state.undo();
        })
    }

    private executeIfValid(name: string, methodName: string, callback: (state: IBpdState<VStates, TActions>) => void) {
        if (!is(name)) {
            throw new CommonError(methodName + "Error", "State name is not provided")
        }
        let state = this.#states[name];
        if (!is(state)) {
            throw new CommonError(methodName + "StateError", "State not found")
        }
        callback(state);
    }
}

export class BpdStateManager {
    static createStateManager<VStates, TActions>(config?: BpdStateManagerConfig<VStates>): void {
        window.$bdpStateManager = new BpdStateManagerFactory<VStates, TActions>(config);
    }

    static createState<VStates, TActions>(name: string, initialValue: VStates, mutationHandler: StateMutationHandler<TActions, VStates>, config?: BpdStateManagerConfig<VStates>): void {
        if (!is(window.$bdpStateManager)) {
            throw new StateManagerShorthandError("createState", "Manager must be initialized first with createStateManager")
        }
        window.$bdpStateManager.createState(name, initialValue, mutationHandler, config);
    }

    static removeState<VStates, TActions>(name: string): void {
        if (!is(window.$bdpStateManager)) {
            throw new StateManagerShorthandError("removeState", "Manager must be initialized first with createStateManager")
        }
        window.$bdpStateManager.removeState(name);
    }

    static getState<VStates, TActions>(name: string): IBpdState<VStates, TActions> {
        if (!is(window.$bdpStateManager)) {
            throw new StateManagerShorthandError("getState", "Manager must be initialized first with createStateManager")
        }
        return window.$bdpStateManager.getState(name);
    }

    static performStateAction<VStates, TActions>(name: string, action: BpdStateAction<TActions>, callback?: (state: VStates) => void) {
        if (!is(window.$bdpStateManager)) {
            throw new StateManagerShorthandError("perform", "Manager must be initialized first with createStateManager")
        }
        window.$bdpStateManager.perform(name, action, callback);
    }

    static subscribeToState<VStates, TActions>(name: string, callback: (state: VStates) => void): string {
        if (!is(window.$bdpStateManager)) {
            throw new StateManagerShorthandError("subscribe", "Manager must be initialized first with createStateManager")
        }
        return window.$bdpStateManager.subscribe(name, callback);
    }

    static unsubscribeFromState<VStates, TActions>(name: string, id: string) {
        if (!is(window.$bdpStateManager)) {
            throw new StateManagerShorthandError("unsubscribe", "Manager must be initialized first with createStateManager")
        }
        window.$bdpStateManager.unsubscribe(name, id);
    }

    static undoState(name: string) {
        if (!is(window.$bdpStateManager)) {
            throw new StateManagerShorthandError("unsubscribe", "Manager must be initialized first with createStateManager")
        }
        window.$bdpStateManager.undo(name);
    }
}