import { BpdStateManagerFactory } from "./core";
import { StateManagerShorthandError } from "./helpers/errors";
import { is } from "./helpers/functions";
import { BpdStateManagerConfig, StateMutationHandler, BpdStateAction } from "./interfaces";
import { IBpdState } from "./state/state";

let bdpStateManagerFactory: any = undefined;

function getGlobaStateManager<VStates, TActions>(): BpdStateManagerFactory<VStates, TActions> {
    if (!is(bdpStateManagerFactory)) {
        throw new StateManagerShorthandError("createState", "Manager must be initialized first with createStateManager")
    }
    return bdpStateManagerFactory;
}

export function createStateManager<VStates, TActions>(config?: BpdStateManagerConfig<VStates>): void {
    if (is(bdpStateManagerFactory)) {
        throw new StateManagerShorthandError("createStateManager", "Manager was already initialized")
    }
    bdpStateManagerFactory = new BpdStateManagerFactory<VStates, TActions>(config);
}

export function createState<VStates, TActions>(name: string, initialValue: VStates, mutationHandler: StateMutationHandler<TActions, VStates>, config?: BpdStateManagerConfig<VStates>): void {
    getGlobaStateManager<VStates, TActions>().createState(name, initialValue, mutationHandler, config);
}

export function removeState<VStates, TActions>(name: string): void {
    getGlobaStateManager<VStates, TActions>().removeState(name);
}

export function getState<VStates, TActions>(name: string): IBpdState<VStates, TActions> | undefined {
    return getGlobaStateManager<VStates, TActions>().getState(name);
}

export function performStateAction<VStates, TActions>(name: string, action: BpdStateAction<TActions>, callback?: (state: VStates) => void) {
    getGlobaStateManager<VStates, TActions>().perform(name, action, callback);
}

export function subscribeToState<VStates, TActions>(name: string, callback: (state: VStates) => void): string | undefined {
    return getGlobaStateManager<VStates, TActions>().subscribe(name, callback);
}

export function unsubscribeFromState<VStates, TActions>(name: string, id: string) {
    getGlobaStateManager<VStates, TActions>().unsubscribe(name, id);
}

export function undoState<VStates, TActions>(name: string) {
    getGlobaStateManager<VStates, TActions>().undo(name);
}