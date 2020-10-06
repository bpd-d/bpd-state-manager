import { StateBackup } from "../src/helpers/backup";

describe("Tests checking [StateBackup]", function () {
    it("Creates backup", function () {
        let backup = new StateBackup<string>();
        backup.push("XXX");
        let len = backup.length();
        expect(len).toEqual(1);
    })

    it("Undo backup", function () {
        let backup = new StateBackup<string>();
        backup.push("XXX");
        let undo = backup.undo();
        let len = backup.length();

        expect(len).toEqual(0);
        expect(undo).toEqual("XXX")
    })

    it("Undo backup - mulitple times", function () {
        let backup = new StateBackup<string>();
        backup.push("XXX");
        let undo = backup.undo();
        undo = backup.undo();
        let len = backup.length();

        expect(len).toEqual(0);
        expect(undo).toEqual(undefined)
    })

    it("Undo backup - not exceed limit", function () {
        let backup = new StateBackup<string>();
        for (let i = 0; i <= 30; i++) {
            backup.push(i + "");
        }
        let last = backup.undo();
        let len = backup.length();

        expect(len).toEqual(19);
        expect(last).toEqual("30");
    })

})