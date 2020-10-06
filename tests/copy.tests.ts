import { ObjectCopyMaker } from "../src/helpers/copy";


describe("Tests checking [ObjectCopyMaker]", function () {
    it("Creates copy - simple", function () {
        let copyMaker = new ObjectCopyMaker<string>();
        let copy = copyMaker.copy("XXX");

        expect(copy).toEqual("XXX");
    })

    it("Creates copy - array", function () {
        let copyMaker = new ObjectCopyMaker<string[]>();
        let copy = copyMaker.copy(["XXX", "YYY"]);

        expect(copy[0]).toEqual("XXX");
        expect(copy[1]).toEqual("YYY");
    })

    it("Creates copy - object", function () {
        let copyMaker = new ObjectCopyMaker<any>();
        let copy = copyMaker.copy({
            a: "A",
            b: "B"
        });

        expect(copy.a).toEqual("A");
        expect(copy.b).toEqual("B");
    })

    it("Creates copy - object", function () {
        let copyMaker = new ObjectCopyMaker<any>();
        let copy = copyMaker.copy(null);

        expect(copy).toEqual(null);
    })

})