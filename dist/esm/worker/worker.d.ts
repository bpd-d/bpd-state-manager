import { BpdStateAction } from "../interfaces";
export interface OnPerformCallback<V, P> {
    (action: BpdStateAction<V>): Promise<P>;
}
export interface OnUpdateCallback<V, P> {
    (result: P, action?: BpdStateAction<V>): void;
}
export interface OnErrorCallback<V> {
    (error: Error, action?: BpdStateAction<V>): void;
}
export interface IBpdStateWorker<V, P> {
    perform(action: BpdStateAction<V>): void;
    onPerform(callback: OnPerformCallback<V, P>): void;
    onUpdate(callback: OnUpdateCallback<V, P>): void;
    onError(callback: OnErrorCallback<V>): void;
}
export declare class BpdStateWorker<V, P> implements IBpdStateWorker<V, P> {
    private _queue;
    private _queuelock;
    private _lock;
    private _onPerform;
    private _onUpdate;
    private _onError;
    constructor();
    onPerform(callback: OnPerformCallback<V, P>): void;
    onUpdate(callback: OnUpdateCallback<V, P>): void;
    onError(callback: OnErrorCallback<V>): void;
    perform(action: BpdStateAction<V>): void;
    private run;
    private isInQueue;
}
