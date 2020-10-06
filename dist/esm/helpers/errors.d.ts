export declare class ErrorBase extends Error {
    constructor(name: string, message?: string);
}
export declare class IncorrectDataError extends ErrorBase {
    constructor(message?: string);
}
export declare class WorkerNotReadyError extends ErrorBase {
    constructor(message?: string);
}
export declare class PerformerError extends ErrorBase {
    constructor(base: Error);
}
export declare class CreateStateError extends ErrorBase {
    constructor(message?: string);
}
export declare class InitStateError extends ErrorBase {
    constructor(message?: string);
}
export declare class CommonError extends ErrorBase {
    constructor(type: string, message?: string);
}
export declare class StateManagerShorthandError extends ErrorBase {
    constructor(type: string, message?: string);
}
