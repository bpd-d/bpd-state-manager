export class ErrorBase extends Error {
    constructor(name, message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
    }
}
export class IncorrectDataError extends ErrorBase {
    constructor(message) {
        super("IncorrectDataError", message);
    }
}
export class WorkerNotReadyError extends ErrorBase {
    constructor(message) {
        super("WorkerNotReadyError", message);
    }
}
export class PerformerError extends ErrorBase {
    constructor(base) {
        super("PerformerError:" + base.name, base.message);
        this.stack = base.stack;
    }
}
export class CreateStateError extends ErrorBase {
    constructor(message) {
        super("CreateStateError", message);
    }
}
export class InitStateError extends ErrorBase {
    constructor(message) {
        super("InitStateError", message);
    }
}
export class CommonError extends ErrorBase {
    constructor(type, message) {
        super(type, message);
    }
}
export class StateManagerShorthandError extends ErrorBase {
    constructor(type, message) {
        super("StateManagerShorthandError", type + ":" + message);
    }
}
