export interface IStateBackup<VState> {
    push(v: VState): void;
    undo(): VState | undefined;
}
export declare class StateBackup<VState> implements IStateBackup<VState> {
    #private;
    constructor();
    push(v: VState): void;
    undo(): VState | undefined;
}
