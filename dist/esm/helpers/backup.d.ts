export interface IStateBackup<VState> {
    push(v: VState): void;
    undo(): VState | undefined;
    length(): number;
}
export declare class StateBackup<VState> implements IStateBackup<VState> {
    _states: VState[];
    _maxCount: number;
    constructor();
    push(v: VState): void;
    undo(): VState | undefined;
    length(): number;
}
