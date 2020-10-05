export function is(obj: any) {
    if (typeof obj === 'undefined' || obj === null) {
        return false;
    }
    if (Array.isArray(obj) && obj.length === 0) {
        return false;
    }
    if (typeof obj === 'string' && obj.length === 0) {
        false;
    }
    return true;
}