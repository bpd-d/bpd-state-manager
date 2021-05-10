import { BpdStateManagerFactory } from "./core";
import { StateManagerShorthandError } from "./helpers/errors";
import { is } from "./helpers/functions";
let bdpStateManagerFactory = undefined;
function getGlobaStateManager() {
    if (!is(bdpStateManagerFactory)) {
        throw new StateManagerShorthandError("createState", "Manager must be initialized first with createStateManager");
    }
    return bdpStateManagerFactory;
}
export function createStateManager(config) {
    if (is(bdpStateManagerFactory)) {
        throw new StateManagerShorthandError("createStateManager", "Manager was already initialized");
    }
    bdpStateManagerFactory = new BpdStateManagerFactory(config);
}
export function createState(name, initialValue, mutationHandler, config) {
    getGlobaStateManager().createState(name, initialValue, mutationHandler, config);
}
export function removeState(name) {
    getGlobaStateManager().removeState(name);
}
export function getState(name) {
    return getGlobaStateManager().getState(name);
}
export function performStateAction(name, action, callback) {
    getGlobaStateManager().perform(name, action, callback);
}
export function subscribeToState(name, callback) {
    return getGlobaStateManager().subscribe(name, callback);
}
export function unsubscribeFromState(name, id) {
    getGlobaStateManager().unsubscribe(name, id);
}
export function undoState(name) {
    getGlobaStateManager().undo(name);
}
