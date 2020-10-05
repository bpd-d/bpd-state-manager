import { BpdStateAction } from "../../src/index";

export function getSimpleAction(): BpdStateAction<string> {
    return {
        action: 'action',
        data: "XXX"
    }
}