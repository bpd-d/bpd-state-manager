export class StateBackup {
    constructor() {
        this._states = [];
        this._maxCount = 20;
    }
    push(v) {
        if (this._states.length >= this._maxCount) {
            this._states.shift();
        }
        this._states.push(v);
    }
    undo() {
        if (this._states.length > 0) {
            return this._states.pop();
        }
        return undefined;
    }
    length() {
        return this._states.length;
    }
}
