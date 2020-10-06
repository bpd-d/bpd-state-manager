import { IObjectCopyMaker } from "../interfaces";
export declare class ObjectCopyMaker<VState> implements IObjectCopyMaker<VState> {
    copy(obj: VState): VState;
}
