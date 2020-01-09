import Utils from "@/libs/Utils"

describe("Utils.js", () => {
  test("extract icon normal case", () => {
    const result = Utils.extractIcon('<i class="fas fa-times"></i>', 'fas fa-check');
    expect(result).toEqual('fas fa-times');
  });
  test("extract without icon case", () => {
    const result = Utils.extractIcon('', 'fas fa-check');
    expect(result).toEqual('fas fa-check');
  });
  test("extract withbad data", () => {
    const result = Utils.extractIcon('<i><p>A bad test</p><i>', 'fas fa-check');
    expect(result).toEqual('fas fa-check');
  });
});
