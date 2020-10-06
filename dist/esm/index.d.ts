import { BpdStateManagerConfig, StatePerformer, BpdStateAction } from "./interfaces";
import { IBpdState } from "./state/state";
export declare const VERSION_INFO = "0.1.0";
declare global {
    interface Window {
        $bdpStateManager: any;
    }
}
export declare class BpdStateManager<VStates, TActions> {
    #private;
    constructor(config?: BpdStateManagerConfig<VStates>);
    createState(name: string, initialValue: VStates, performer: StatePerformer<TActions, VStates>, config?: BpdStateManagerConfig<VStates>): void;
    removeState(name: string): void;
    getState(name: string): IBpdState<VStates, TActions> | undefined;
    perform(name: string, action: BpdStateAction<TActions>, callback?: (state: VStates) => void): void;
    subscribe(name: string, callback: (state: VStates) => void): string | undefined;
    unsubscribe(name: string, id: string): void;
    private executeIfValid;
}
export declare function createStateManager<VStates, TActions>(config?: BpdStateManagerConfig<VStates>): void;
export declare function createState<VStates, TActions>(name: string, initialValue: VStates, performer: StatePerformer<TActions, VStates>, config?: BpdStateManagerConfig<VStates>): void;
export declare function removeState<VStates, TActions>(name: string): void;
export declare function getState<VStates, TActions>(name: string): IBpdState<VStates, TActions>;
export declare function perform<VStates, TActions>(name: string, action: BpdStateAction<TActions>, callback?: (state: VStates) => void): void;
export declare function subscribe<VStates, TActions>(name: string, callback: (state: VStates) => void): string;
export declare function unsubscribe<VStates, TActions>(name: string, id: string): void;
