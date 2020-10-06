import { BpdStateManagerConfig, StateMutationHandler, BpdStateAction } from "./interfaces";
import { IBpdState } from "./state/state";
export declare const VERSION_INFO = "0.1.3";
declare global {
    interface Window {
        $bdpStateManager: any;
    }
}
export declare class BpdStateManagerFactory<VStates, TActions> {
    #private;
    constructor(config?: BpdStateManagerConfig<VStates>);
    createState(name: string, initialValue: VStates, mutationHandler: StateMutationHandler<TActions, VStates>, config?: BpdStateManagerConfig<VStates>): void;
    removeState(name: string): void;
    getState(name: string): IBpdState<VStates, TActions> | undefined;
    perform(name: string, action: BpdStateAction<TActions>, callback?: (state: VStates) => void): void;
    subscribe(name: string, callback: (state: VStates) => void): string | undefined;
    unsubscribe(name: string, id: string): void;
    undo(name: string): void;
    private executeIfValid;
}
export declare class BpdStateManager {
    static createStateManager<VStates, TActions>(config?: BpdStateManagerConfig<VStates>): void;
    static createState<VStates, TActions>(name: string, initialValue: VStates, mutationHandler: StateMutationHandler<TActions, VStates>, config?: BpdStateManagerConfig<VStates>): void;
    static removeState<VStates, TActions>(name: string): void;
    static getState<VStates, TActions>(name: string): IBpdState<VStates, TActions>;
    static performStateAction<VStates, TActions>(name: string, action: BpdStateAction<TActions>, callback?: (state: VStates) => void): void;
    static subscribeToState<VStates, TActions>(name: string, callback: (state: VStates) => void): string;
    static unsubscribeFromState<VStates, TActions>(name: string, id: string): void;
    static undoState(name: string): void;
}
