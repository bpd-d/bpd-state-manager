export interface IStateBackup<VState> {
    push(v: VState): void;
    undo(): VState | undefined;
    length(): number;
}
export declare class StateBackup<VState> implements IStateBackup<VState> {
    #private;
    constructor();
    push(v: VState): void;
    undo(): VState | undefined;
    length(): number;
}
