import { IObjectCopyMaker } from "../interfaces";

export class ObjectCopyMaker<VState> implements IObjectCopyMaker<VState> {
    copy(obj: VState): VState {
        if (typeof obj === 'undefined' || obj === null) {
            return obj;
        }
        let newOne: VState | null = null;
        if (['number', 'string', 'boolean'].includes(typeof obj) || Array.isArray(obj)) {
            newOne = obj;
        } else {
            newOne = { ...obj };
        }
        return newOne;
    }

}