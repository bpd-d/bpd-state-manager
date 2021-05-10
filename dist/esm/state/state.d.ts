import { BpdStateAction, BpdStateManagerConfig, StateMutationHandler } from "../interfaces";
export interface IBpdState<VState, PAction> {
    perform(action: BpdStateAction<PAction>, callback?: (state: VState) => void | undefined): void;
    subscribe(callback: (state: VState) => void): string | undefined;
    unsubscribe(id: string): boolean;
    getState(): VState;
    undo(): void;
}
export declare class BpdState<VState, PAction> implements IBpdState<VState, PAction> {
    private _state;
    private _backup;
    private _id;
    private _config;
    private _worker;
    private _mutationHandler;
    private _subscriptionManager;
    private _copyMaker;
    constructor(id: string, init: VState, mutationHandler: StateMutationHandler<PAction, VState>, config?: BpdStateManagerConfig<VState>);
    /**
     * Performs an action on the state
     * @param action - action to be performed
     * @param callback - optional - subscription callback for one time execution
     */
    perform(action: BpdStateAction<PAction>, callback?: (state: VState) => void): void;
    /**
     * Attaches new subscriber to state
     * @param callback Function to be assigned to subscriber
     */
    subscribe(callback: (state: VState) => void): string | undefined;
    /**
     * Removes subscriber from the state
     * @param id subscription identifier
     */
    unsubscribe(id: string): boolean;
    /**
     * Returns current state
     */
    getState(): VState;
    /**
     * Performs undo on state
     */
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
