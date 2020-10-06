import { BpdStateAction, BpdStateManagerConfig, StatePerformer } from "../interfaces";
export interface IBpdState<VState, PAction> {
    perform(action: BpdStateAction<PAction>, callback?: (state: VState) => void | undefined): void;
    subscribe(callback: (state: VState) => void): string | undefined;
    unsubscribe(id: string): boolean;
    getState(): VState;
    undo(): void;
}
export declare class BpdState<VState, PAction> implements IBpdState<VState, PAction> {
    #private;
    constructor(id: string, init: VState, performer: StatePerformer<PAction, VState>, config?: BpdStateManagerConfig<VState>);
    perform(action: BpdStateAction<PAction>, callback?: (state: VState) => void): void;
    subscribe(callback: (state: VState) => void): string | undefined;
    unsubscribe(id: string): boolean;
    getState(): VState;
    undo(): void;
    /**
     * Callback invoked by a worker when state change perform is completed
     * Method assigns new state and calls subscription manager to notify subscribers about the change
     * @param state - new state value
     * @param action - executed action
     */
    private onWorkerChange;
    /**
     * Callback on workerk that creates a promise that executes perfromer on passed action
     * @param action action to be perfromed
     */
    private onWorkerPerform;
    private onWorkerError;
    private onSubscriberError;
    private reportError;
    private reportChange;
    private assignStateAndNotify;
}
