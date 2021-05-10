export interface IStateBackup<VState> {
    push(v: VState): void;
    undo(): VState | undefined;
    length(): number;
}

export class StateBackup<VState> implements IStateBackup<VState> {
    _states: VState[];
    _maxCount: number;
    constructor() {
        this._states = [];
        this._maxCount = 20
    }
    push(v: VState): void {
        if (this._states.length >= this._maxCount) {
            this._states.shift();
        }
        this._states.push(v);
    }
    undo(): VState | undefined {
        if (this._states.length > 0) {
            return this._states.pop();
        }
        return undefined;
    }

    length(): number {
        return this._states.length;
    }

}