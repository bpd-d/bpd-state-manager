import { BpdStateAction } from "../src/interfaces";
import { IBpdState, BpdState } from "../src/state/state";
import { getSimpleAction } from "./helpers/actions";
import { sleep } from "./helpers/functions";
import { SimpleSubscriber } from "./helpers/subscribers";

describe("Tests checking [State]", function () {
    it("Initialization - incorrect arguments", function () {
        let failed: boolean = false;
        let state: IBpdState<String, string> = undefined;
        try {
            state = new BpdState<string, string>(null, null, null);
        } catch (e) {
            failed = true;
        }

        expect(failed).toBeTrue();
        expect(state).toBeUndefined();

    })

    it("Initialization - incorrect arguments, proper ID", function () {
        let failed: boolean = false;
        let state: IBpdState<String, string> = undefined;
        try {
            state = new BpdState<string, string>("ID", null, null);
        } catch (e) {
            failed = true;
        }

        expect(failed).toBeTrue();
        expect(state).toBeUndefined();

    })

    it("Initialization - incorrect arguments, proper ID, proper init", function () {
        let failed: boolean = false;
        let state: IBpdState<String, string> = undefined;
        try {
            state = new BpdState<string, string>("ID", "", null);
        } catch (e) {
            failed = true;
        }

        expect(failed).toBeTrue();
        expect(state).toBeUndefined();

    })

    it("Initialization - proper arguments", function () {
        let failed: boolean = false;
        let state: IBpdState<String, string> = undefined;
        let result = null;
        try {
            state = new BpdState<string, string>("ID", "", (state: string, action: BpdStateAction<string>) => {
                result = action.data;
                return result;
            });
        } catch (e) {
            failed = true;
        }

        expect(failed).toBeFalse();
        expect(state).toBeDefined();

    })

    it("Performer", async function () {
        let failed: boolean = false;
        let simpleAction = getSimpleAction();
        let state: IBpdState<String, string> = undefined;
        let result = null;
        try {
            state = new BpdState<string, string>("ID", "", (state: string, action: BpdStateAction<string>) => {
                result = action.data;
                return result;
            });
            state.perform(simpleAction)
        } catch (e) {
            failed = true;
        }


        await sleep(50);

        expect(failed).toBeFalse();
        expect(state).toBeDefined();
        expect(result).toEqual(simpleAction.data);
    })

    it("Subscriber", async function () {
        let failed: boolean = false;
        let simpleAction = getSimpleAction();
        let simpleSubscriber = new SimpleSubscriber();
        let state: IBpdState<String, string> = undefined;
        let result = null;
        try {
            state = new BpdState<string, string>("ID", "", (state: string, action: BpdStateAction<string>) => {
                result = action.data;
                return result;
            });
            state.subscribe(simpleSubscriber.onNotify.bind(simpleSubscriber));
            state.perform(simpleAction);
        } catch (e) {
            failed = true;
        }


        await sleep(50);

        expect(failed).toBeFalse();
        expect(state).toBeDefined();
        expect(result).toEqual(simpleAction.data);
        expect(simpleSubscriber.value).toEqual(simpleAction.data);

    })

    it("Unsubscribe", async function () {
        let failed: boolean = false;
        let simpleAction = getSimpleAction();
        let simpleSubscriber = new SimpleSubscriber();
        let state: IBpdState<String, string> = undefined;
        let result = null;
        try {
            state = new BpdState<string, string>("ID", "", (state: string, action: BpdStateAction<string>) => {
                result = action.data;
                return result;
            });
            let id = state.subscribe(simpleSubscriber.onNotify.bind(simpleSubscriber));
            state.unsubscribe(id);
            state.perform(simpleAction);
        } catch (e) {
            failed = true;
        }


        await sleep(50);

        expect(failed).toBeFalse();
        expect(state).toBeDefined();
        expect(result).toEqual(simpleAction.data);
        expect(simpleSubscriber.value).toEqual(null);

    })

    it("GetState", async function () {
        let failed: boolean = false;
        let simpleAction = getSimpleAction();
        let simpleSubscriber = new SimpleSubscriber();
        let state: IBpdState<String, string> = undefined;
        let result = null;
        let stateValue = null;
        try {
            state = new BpdState<string, string>("ID", "", (state: string, action: BpdStateAction<string>) => {
                result = action.data;
                return result;
            });
            state.perform(simpleAction);
        } catch (e) {
            failed = true;
        }


        await sleep(50);
        stateValue = state.getState();
        expect(failed).toBeFalse();
        expect(state).toBeDefined();
        expect(result).toEqual(simpleAction.data);
        expect(stateValue).toEqual(simpleAction.data);

    })


})