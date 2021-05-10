import { CommonError, CreateStateError, StateManagerShorthandError } from "./helpers/errors";
import { is } from "./helpers/functions";
import { BpdStateManagerConfig, StateMutationHandler, BpdStateAction } from "./interfaces";
import { BpdState, IBpdState } from "./state/state";

export const VERSION_INFO = "0.2.0";

export class BpdStateManagerFactory<VStates, TActions> {
    _config: BpdStateManagerConfig<VStates> | undefined;
    _states: Map<string, IBpdState<VStates, TActions>>;
    constructor(config?: BpdStateManagerConfig<VStates>) {
        this._config = config;
        this._states = new Map();
    }

    createState(name: string, initialValue: VStates, mutationHandler: StateMutationHandler<TActions, VStates>, config?: BpdStateManagerConfig<VStates>) {
        if (!is(name) || is(this._states.get(name))) {
            throw new CreateStateError("State name was not provided");
        }
        this._states.set(name, new BpdState(name, initialValue, mutationHandler, config ?? this._config));
    }

    removeState(name: string) {
        this.executeIfValid(name, "RemoveSate", (state) => {
            this._states.delete(name);
        })
    }

    getState(name: string): IBpdState<VStates, TActions> | undefined {
        let resultState = undefined;
        this.executeIfValid(name, "GetState", (state) => {
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
        let state = this._states.get(name);
        if (!is(state)) {
            throw new CommonError(methodName + "StateError", "State not found")
        }
        //@ts-ignore state must exists here
        callback(state);
    }
}

