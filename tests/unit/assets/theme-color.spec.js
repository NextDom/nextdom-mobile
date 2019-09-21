import nextDomTheme from "@/assets/theme-color.js";

describe("theme-color.js", () => {
  test("theme defined", () => {
    expect(nextDomTheme.initTheme().generate("nextdom")).toContain("h1, h2, h3 {\n    color:");
  });
});
