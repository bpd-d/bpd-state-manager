import { BpdStateManagerFactory } from "../src/core";
import { getSimpleAction } from "./helpers/actions";
import { sleep } from "./helpers/functions";

describe("Tests checking [BpdStateManager]", function () {
    it("Initialization", function () {
        let manager = new BpdStateManagerFactory<string, string>();
        expect(manager).toBeDefined();
    })

    it("createState", function () {
        let manager = new BpdStateManagerFactory<string, string>();
        manager.createState("SIMPLE", "x", (state, action) => {
            return action.data;
        })
        let resState = manager.getState("SIMPLE");
        expect(manager).toBeDefined();
        expect(resState).toBeDefined();
    })

    it("createState - incorrect name", function () {
        let manager = new BpdStateManagerFactory<string, string>();
        let failed = false;
        try {
            manager.createState(null, "x", (state, action) => {
                return action.data;
            })
        } catch (e) {
            failed = true;
        }

        expect(manager).toBeDefined();
        expect(failed).toBeTrue();
    })

    it("removeState - incorrect name", function () {
        let manager = new BpdStateManagerFactory<string, string>();
        let failed = false;
        try {
            manager.createState("SIMPLE", "x", (state, action) => {
                return action.data;
            })
            manager.removeState("");
        } catch (e) {
            failed = true;
        }


        expect(manager).toBeDefined();
        expect(failed).toBeTrue();
    })

    it("removeState", function () {
        let manager = new BpdStateManagerFactory<string, string>();
        let failed = false;
        let resState = undefined
        try {
            manager.removeState("SIMPLE");
            resState = manager.getState("SIMPLE");
        } catch (e) {
            failed = true;
        }


        expect(manager).toBeDefined();
        expect(failed).toBeTrue();
    })

    it("subscribe", function () {
        let manager = new BpdStateManagerFactory<string, string>();
        let failed = false;
        let id = undefined;
        try {
            manager.createState("SIMPLE", "x", (state, action) => {
                return action.data;
            })
            id = manager.subscribe("SIMPLE", (state) => {

            })
        } catch (e) {
            failed = true;
        }


        expect(manager).toBeDefined();
        expect(failed).toBeFalse();
        expect(id).toBeDefined();
    })

    it("subscribe - not exisiting state", function () {
        let manager = new BpdStateManagerFactory<string, string>();
        let failed = false;
        let id = undefined;
        try {
            manager.createState("SIMPLE", "x", (state, action) => {
                return action.data;
            })
            id = manager.subscribe("XXX", (state) => {

            })
        } catch (e) {
            failed = true;
        }


        expect(manager).toBeDefined();
        expect(failed).toBeTrue();
        expect(id).toBeUndefined();
    })

    it("Unsubscribe", function () {
        let manager = new BpdStateManagerFactory<string, string>();
        let failed = false;
        let id = undefined;
        try {
            manager.createState("SIMPLE", "x", (state, action) => {
                return action.data;
            })
            id = manager.subscribe("SIMPLE", (state) => {

            })

            manager.unsubscribe("SIMPLE", id)
        } catch (e) {
            failed = true;
        }


        expect(manager).toBeDefined();
        expect(failed).toBeFalse();
    })

    it("Unsubscribe - incorrect state", function () {
        let manager = new BpdStateManagerFactory<string, string>();
        let failed = false;
        let id = undefined;
        try {
            manager.createState("SIMPLE", "x", (state, action) => {
                return action.data;
            })
            id = manager.subscribe("SIMPLE", (state) => {

            })

            manager.unsubscribe("XXX", id)
        } catch (e) {
            failed = true;
        }


        expect(manager).toBeDefined();
        expect(failed).toBeTrue();
    })

    it("Perfrom", async function () {
        let manager = new BpdStateManagerFactory<string, string>();
        let failed = false;
        let action = getSimpleAction();
        let id = undefined;
        let result = undefined
        try {
            manager.createState("SIMPLE", "x", (state, action) => {
                return action.data;
            })
            id = manager.subscribe("SIMPLE", (state) => {
                result = state;
            })
            manager.perform("SIMPLE", action);
        } catch (e) {
            failed = true;
        }
        await sleep(50);

        expect(manager).toBeDefined();
        expect(failed).toBeFalse();
        expect(result).toEqual(action.data);
    })

    it("Perfrom - incorrect state", async function () {
        let manager = new BpdStateManagerFactory<string, string>();
        let failed = false;
        let action = getSimpleAction();
        let id = undefined;
        let result = undefined
        try {
            manager.createState("SIMPLE", "x", (state, action) => {
                return action.data;
            })
            id = manager.subscribe("SIMPLE", (state) => {
                result = state;
            })
            manager.perform("XXX", action);
        } catch (e) {
            failed = true;
        }
        await sleep(50);

        expect(manager).toBeDefined();
        expect(failed).toBeTrue();
        expect(result).toBeUndefined();
    })
})