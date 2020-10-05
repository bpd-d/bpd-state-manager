import { ISubscriptionsManager, SubscriptionsManager } from "../src/subscriptions/subscriptions";
import { sleep } from "./helpers/functions";
import { ErrorSubscriber, SimpleSubscriber } from "./helpers/subscribers";

describe("Tests checking [Subscriptions]", function () {
    it("Initialization", function () {
        let subManager: ISubscriptionsManager<string> = new SubscriptionsManager("XX");
        expect(subManager).toBeDefined();

    })

    it("Initialization without id", function () {
        let failed = false;
        let subManager: ISubscriptionsManager<string> = undefined;
        try {
            subManager = new SubscriptionsManager(null);
        } catch (e) {
            failed = true;
        }

        expect(subManager).toBeUndefined();
        expect(failed).toBeTrue();
    })

    it("Add subscriber", function () {
        let subManager: ISubscriptionsManager<string> = new SubscriptionsManager("Xx");;
        let simpleSub = new SimpleSubscriber();
        let id = subManager.subscribe(simpleSub.onNotify.bind(simpleSub));
        expect(id).toBeDefined();
    })

    it("Add subscriber with options", function () {
        let subManager: ISubscriptionsManager<string> = new SubscriptionsManager("Xx");;
        let simpleSub = new SimpleSubscriber();
        let id = subManager.subscribe(simpleSub.onNotify.bind(simpleSub), { singleRun: true });
        expect(id).toBeDefined();
    })

    it("Notify", async function () {
        let subManager: ISubscriptionsManager<string> = new SubscriptionsManager("Xx");;
        let simpleSub = new SimpleSubscriber();
        let id = subManager.subscribe(simpleSub.onNotify.bind(simpleSub));
        subManager.notify("XXX")
        await sleep(50);
        expect(id).toBeDefined();
        expect(simpleSub.value).toEqual("XXX");
    })

    it("Notify - error, removed subscription", async function () {
        let failed = false;
        let subManager: ISubscriptionsManager<string> = new SubscriptionsManager("Xx");
        let simpleSub = new ErrorSubscriber();
        let id = subManager.subscribe(simpleSub.onNotify.bind(simpleSub));
        subManager.onError((e: Error) => {
            failed = true;
        })
        subManager.notify("XXX");

        await sleep(50);
        let count = subManager.getSubscribers().length;
        expect(id).toBeDefined();
        expect(failed).toBeTrue();
        expect(count).toEqual(0);
    })

    it("Unsubscribe", async function () {
        let subManager: ISubscriptionsManager<string> = new SubscriptionsManager("Xx");
        let simpleSub = new SimpleSubscriber();
        let id = subManager.subscribe(simpleSub.onNotify.bind(simpleSub));
        subManager.unsubscribe(id)
        let count = subManager.getSubscribers().length;
        expect(count).toEqual(0);
    })

    it("Unsubscribe - empty id", async function () {
        let subManager: ISubscriptionsManager<string> = new SubscriptionsManager("Xx");
        let simpleSub = new SimpleSubscriber();
        let id = subManager.subscribe(simpleSub.onNotify.bind(simpleSub));
        subManager.unsubscribe(null)
        let count = subManager.getSubscribers().length;
        expect(count).toEqual(1);
    })

    it("Notify - one timer", async function () {
        let subManager: ISubscriptionsManager<string> = new SubscriptionsManager("Xx");
        let simpleSub = new SimpleSubscriber();
        let id = subManager.subscribe(simpleSub.onNotify.bind(simpleSub), {
            singleRun: true
        });
        subManager.notify("XXX");
        await sleep(50);
        let count = subManager.getSubscribers().length;
        expect(count).toEqual(0);
        expect(simpleSub.value).toEqual("XXX");
    })
})