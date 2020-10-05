export class SimpleSubscriber {
    value: string;
    constructor() {
        this.value = null;
    }

    onNotify(value: string) {
        this.value = value;
    }
}

export class ErrorSubscriber {
    value: string;
    constructor() {
        this.value = null;
    }

    onNotify(value: string) {
        throw new Error("Error");
    }
}