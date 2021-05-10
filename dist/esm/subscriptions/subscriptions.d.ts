export interface Subscriber<VState> {
    id: string;
    options?: SubscriberOptions;
    callback: (state: VState) => void;
}
export interface SubscriberOptions {
    singleRun: boolean;
}
export interface ISubscriptionsManager<VState> {
    onError(callback: (e: Error) => void): void;
    subscribe(callback: (state: VState) => void, options?: SubscriberOptions): string;
    unsubscribe(subscribtionId: string): void;
    notify(state: VState): Promise<boolean>;
    getSubscribers(): Subscriber<VState>[];
}
export declare class SubscriptionsManager<VState> implements ISubscriptionsManager<VState> {
    private _subscribers;
    private _onError;
    private _counter;
    private _id;
    constructor(id: string);
    subscribe(callback: (state: VState) => void, options?: SubscriberOptions): string;
    unsubscribe(subscribtionId: string): void;
    notify(state: VState): Promise<boolean>;
    onError(callback: (e: Error) => void): void;
    getSubscribers(): Subscriber<VState>[];
    private createSubscriber;
    private generateId;
}
