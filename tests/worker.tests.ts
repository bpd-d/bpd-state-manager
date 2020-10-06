import { BpdStateAction } from "../src/interfaces";
import { IBpdStateWorker, BpdStateWorker } from "../src/worker/worker";
import { getSimpleAction } from "./helpers/actions";
import { sleep } from "./helpers/functions";
import { ErrorPerformer, LongPerformer, SimplePerformer } from "./helpers/performers";

describe("Tests checking [Worker]", function () {
    it("Initialization", function () {
        let failed: boolean = false;
        let worker: IBpdStateWorker<String, string> = undefined;
        try {
            worker = new BpdStateWorker<string, string>();
        } catch (e) {
            failed = true;
        }

        expect(failed).toBeFalse();
        expect(worker).toBeDefined();

    })

    it("Perfrom without an action - shall fail", function () {
        let failed: boolean = false;
        let worker: IBpdStateWorker<String, string> = undefined;
        try {
            worker = new BpdStateWorker<string, string>();
            worker.perform(null);
        } catch (e) {
            failed = true;
        }

        expect(failed).toBeTrue();
        expect(worker).toBeDefined();
    })

    it("Perfrom without callbacks- shall fail", function () {
        let failed: boolean = false;
        let worker: IBpdStateWorker<String, string> = undefined;
        let action = getSimpleAction();
        try {
            worker = new BpdStateWorker<string, string>();
            worker.perform(action);
        } catch (e) {
            failed = true;
        }

        expect(failed).toBeTrue();
        expect(worker).toBeDefined();
    })

    it("Perfrom with callbacks", async function () {
        let result: string = null;
        let action = getSimpleAction();
        let performer = new SimplePerformer();
        let worker: IBpdStateWorker<String, string> = undefined;
        worker = new BpdStateWorker<string, string>();
        worker.onPerform(performer.perform.bind(performer));
        worker.onUpdate((res: string, action: BpdStateAction<string>,) => {
            result = res;
        });
        worker.perform(action);
        await sleep(50);
        expect(performer.invokes).toEqual(1);
        expect(result).toEqual(action.action);
    })

    it("Perfrom with callbacks - error on perform", async function () {
        let result: string = null;
        let action = getSimpleAction();
        let performer = new ErrorPerformer();
        let worker: IBpdStateWorker<String, string> = undefined;
        let error = "";
        worker = new BpdStateWorker<string, string>();
        worker.onPerform(performer.perform.bind(performer));
        worker.onUpdate((res: string, action: BpdStateAction<string>,) => {
            result = res;
        });
        worker.onError((e, action) => {
            error = e.message;
        })
        worker.perform(action);
        await sleep(100);
        expect(error).toEqual("Error");
    })
})