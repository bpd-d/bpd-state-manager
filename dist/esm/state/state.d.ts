import { BpdStateAction, BpdStateManagerConfig, StatePerformer } from "../interfaces";
export interface IBpdState<VState, PAction> {
    perform(action: BpdStateAction<PAction>, callback?: (state: VState) => void | undefined): void;
    subscribe(callback: (state: VState) => void): string | undefined;
    unsubscribe(id: string): boolean;
    getState(): VState;
}
export declare class BpdState<VState, PAction> implements IBpdState<VState, PAction> {
    #private;
    constructor(id: string, init: VState, performer: StatePerformer<PAction, VState>, config?: BpdStateManagerConfig<VState>);
    perform(action: BpdStateAction<PAction>, callback?: (state: VState) => void): void;
    subscribe(callback: (state: VState) => void): string | undefined;
    unsubscribe(id: string): boolean;
    getState(): VState;
    private onWorkerChange;
    private onWorkerPerform;
    private onWorkerError;
    private onSubscriberError;
    private reportError;
    private reportChange;
}
