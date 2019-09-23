import Utils from "@/libs/Utils"

describe("Utils.js", () => {
  test("extract icon normal case", () => {
    const result = Utils.extractIcon('<i class="fa fa-times"></i>', 'fa fa-check');
    expect(result).toEqual('fa fa-times');
  });
  test("extract without icon case", () => {
    const result = Utils.extractIcon('', 'fa fa-check');
    expect(result).toEqual('fa fa-check');
  });
  test("extract withbad data", () => {
    const result = Utils.extractIcon('<i><p>A bad test</p><i>', 'fa fa-check');
    expect(result).toEqual('fa fa-check');
  });
});
