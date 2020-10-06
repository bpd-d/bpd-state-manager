import { BpdStateAction } from "../../src/interfaces";
import { sleep } from "./functions";

export class SimplePerformer {
    invokes: number;
    results: string[];

    constructor() {
        this.invokes = 0;
        this.results = [];
    }

    async perform(action: BpdStateAction<string>) {
        this.invokes += 1;
        this.results.push(action.data);
        return action.action;
    }
}

export class LongPerformer {
    invokes: number;
    results: string[];

    constructor() {
        this.invokes = 0;
        this.results = [];
    }

    async perform(action: BpdStateAction<string>) {
        this.invokes += 1;
        this.results.push(action.data);
        await sleep(20);
        return action.action;
    }
}

export class ErrorPerformer {
    invokes: number;
    results: string[];

    constructor() {
        this.invokes = 0;
        this.results = [];
    }

    async perform(action: BpdStateAction<string>) {
        throw new Error("Error");
    }
}