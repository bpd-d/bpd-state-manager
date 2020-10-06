import { BpdStateAction } from "../../src/interfaces";


export function getSimpleAction(): BpdStateAction<string> {
    return {
        action: 'action',
        data: "XXX"
    }
}