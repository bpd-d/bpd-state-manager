import { is } from "./helpers/functions";

export const VERSION_INFO = "0.1.0";

export type OnChangeEventType = "action" | "lib";

export interface BpdStateOnChange<V> {
    (stateId: string, type: OnChangeEventType, detail: string, state: V): void;
}

export interface BpdStateOnError {
    (stateId: string, type: OnChangeEventType, error: Error, detail: string): void;
}

export interface BpdStateAction<T> {
    action: string;
    data: T;
}

export interface IBpdState<V> { 
    
}

export interface StateManager<V> {
    [stateId: string]: V;
}

export interface BpdStateManagerConfig<V> {
    onChange?: BpdStateOnChange<V>;
    onError?: BpdStateOnError;
}

export class BpdState<V> {
    #state: V;
    #id: string;
    #config: BpdStateManagerConfig<V>;

    constructor(id: string, init: V, config?: BpdStateManagerConfig<V>) {
        this.#id = id;
        this.#state = init;
        this.#config = config ?? {};
    }

    private reportError(type: OnChangeEventType, detail: string, e: Error) {
        if (is(this.#config.onError)) {
            this.#config.onError(this.#id, type, e, detail)
        }
    }

    private reportChange(type: OnChangeEventType, detail: string) {
        if (is(this.#config.onChange)) {
            this.#config.onChange(this.#id, type, detail, this.#state)
        }
    }
}

