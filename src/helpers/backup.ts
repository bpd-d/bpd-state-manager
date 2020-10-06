export interface IStateBackup<VState> {
    push(v: VState): void;
    undo(): VState | undefined;
}

export class StateBackup<VState> implements IStateBackup<VState> {
    #states: VState[];
    #maxCount: number;
    constructor() {
        this.#states = [];
        this.#maxCount = 20
    }
    push(v: VState): void {
        if (this.#states.length >= this.#maxCount) {
            this.#states.shift();
        }
        this.#states.push(v);
    }
    undo(): VState | undefined {
        if (this.#states.length > 0) {
            return this.#states.pop();
        }
        return undefined;
    }

}