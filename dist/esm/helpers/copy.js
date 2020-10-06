export class ObjectCopyMaker {
    copy(obj) {
        if (typeof obj === 'undefined' || obj === null) {
            return obj;
        }
        let newOne = null;
        if (['number', 'string', 'boolean'].includes(typeof obj) || Array.isArray(obj)) {
            newOne = obj;
        }
        else {
            newOne = Object.assign({}, obj);
        }
        return newOne;
    }
}
