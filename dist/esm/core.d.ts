import { BpdStateManagerConfig, StateMutationHandler, BpdStateAction } from "./interfaces";
import { IBpdState } from "./state/state";
export declare const VERSION_INFO = "0.2.0";
export declare class BpdStateManagerFactory<VStates, TActions> {
    _config: BpdStateManagerConfig<VStates> | undefined;
    _states: Map<string, IBpdState<VStates, TActions>>;
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
