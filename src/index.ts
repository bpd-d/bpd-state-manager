import { CommonError, CreateStateError, StateManagerShorthandError } from "./helpers/errors";
import { is } from "./helpers/functions";
import { BpdStateManagerConfig, StatePerformer, BpdStateAction, BpdManagedStates } from "./interfaces";
import { BpdState, IBpdState } from "./state/state";

export const VERSION_INFO = "0.1.1";
declare global {
    interface Window {
        $bdpStateManager: any;
    }
}

export class BpdStateManager<VStates, TActions> {
    #config: BpdStateManagerConfig<VStates> | undefined;
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


export function createStateManager<VStates, TActions>(config?: BpdStateManagerConfig<VStates>): void {
    window.$bdpStateManager = new BpdStateManager<VStates, TActions>(config);
}

export function createState<VStates, TActions>(name: string, initialValue: VStates, performer: StatePerformer<TActions, VStates>, config?: BpdStateManagerConfig<VStates>): void {
    if (!is(window.$bdpStateManager)) {
        throw new StateManagerShorthandError("createState", "Manager must be initialized first with createStateManager")
    }
    window.$bdpStateManager.createState(name, initialValue, performer, config);
}

export function removeState<VStates, TActions>(name: string): void {
    if (!is(window.$bdpStateManager)) {
        throw new StateManagerShorthandError("removeState", "Manager must be initialized first with createStateManager")
    }
    window.$bdpStateManager.removeState(name);
}

export function getState<VStates, TActions>(name: string): IBpdState<VStates, TActions> {
    if (!is(window.$bdpStateManager)) {
        throw new StateManagerShorthandError("getState", "Manager must be initialized first with createStateManager")
    }
    return window.$bdpStateManager.getState(name);
}

export function perform<VStates, TActions>(name: string, action: BpdStateAction<TActions>, callback?: (state: VStates) => void) {
    if (!is(window.$bdpStateManager)) {
        throw new StateManagerShorthandError("perform", "Manager must be initialized first with createStateManager")
    }
    window.$bdpStateManager.perform(name, action, callback);
}

export function subscribe<VStates, TActions>(name: string, callback: (state: VStates) => void): string {
    if (!is(window.$bdpStateManager)) {
        throw new StateManagerShorthandError("subscribe", "Manager must be initialized first with createStateManager")
    }
    return window.$bdpStateManager.subscribe(name, callback);
}

export function unsubscribe<VStates, TActions>(name: string, id: string) {
    if (!is(window.$bdpStateManager)) {
        throw new StateManagerShorthandError("unsubscribe", "Manager must be initialized first with createStateManager")
    }
    window.$bdpStateManager.unsubscribe(name, id);
}

