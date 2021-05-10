import { CommonError, CreateStateError } from "./helpers/errors";
import { is } from "./helpers/functions";
import { BpdState } from "./state/state";
export const VERSION_INFO = "0.2.0";
export class BpdStateManagerFactory {
    constructor(config) {
        this._config = config;
        this._states = new Map();
    }
    createState(name, initialValue, mutationHandler, config) {
        if (!is(name) || is(this._states.get(name))) {
            throw new CreateStateError("State name was not provided");
        }
        this._states.set(name, new BpdState(name, initialValue, mutationHandler, config !== null && config !== void 0 ? config : this._config));
    }
    removeState(name) {
        this.executeIfValid(name, "RemoveSate", (state) => {
            this._states.delete(name);
        });
    }
    getState(name) {
        let resultState = undefined;
        this.executeIfValid(name, "GetState", (state) => {
            resultState = state;
        });
        return resultState;
    }
    perform(name, action, callback) {
        this.executeIfValid(name, "Perform", (state) => {
            state.perform(action, callback);
        });
    }
    subscribe(name, callback) {
        let id = undefined;
        this.executeIfValid(name, "Subscribe", (state) => {
            id = state.subscribe(callback);
        });
        return id;
    }
    unsubscribe(name, id) {
        this.executeIfValid(name, "Unsubscribe", (state) => {
            state.unsubscribe(id);
        });
    }
    undo(name) {
        this.executeIfValid(name, "Undo", (state) => {
            state.undo();
        });
    }
    executeIfValid(name, methodName, callback) {
        if (!is(name)) {
            throw new CommonError(methodName + "Error", "State name is not provided");
        }
        let state = this._states.get(name);
        if (!is(state)) {
            throw new CommonError(methodName + "StateError", "State not found");
        }
        //@ts-ignore state must exists here
        callback(state);
    }
}
