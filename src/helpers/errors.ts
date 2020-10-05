export class ErrorBase extends Error {
    constructor(name: string, message?: string,) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
    }
}

export class IncorrectDataError extends ErrorBase {
    constructor(message?: string) {
        super("IncorrectDataError", message)
    }
}

export class WorkerNotReadyError extends ErrorBase {
    constructor(message?: string) {
        super("WorkerNotReadyError", message);
    }
}

export class PerformerError extends ErrorBase {
    constructor(base: Error) {
        super("PerformerError:" + base.name, base.message);
        this.stack = base.stack;
    }
}