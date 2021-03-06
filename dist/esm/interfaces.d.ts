export declare type OnChangeEventType = "action" | "lib";
export interface BpdStateOnChange<V> {
    (stateId: string, type: OnChangeEventType, detail: string, state: V): void;
}
export interface BpdStateOnError {
    (stateId: string, type: OnChangeEventType, error: Error, detail: string): void;
}
export interface BpdStateAction<T> {
    action: string;
    data?: T;
}
export interface BpdStateManagerConfig<V> {
    onChange?: BpdStateOnChange<V>;
    onError?: BpdStateOnError;
    copyMaker?: IObjectCopyMaker<V>;
}
export interface StateMutationHandler<V, P> {
    (state: P, action: BpdStateAction<V>): P;
}
export interface IObjectCopyMaker<V> {
    copy(obj: V): V;
}
