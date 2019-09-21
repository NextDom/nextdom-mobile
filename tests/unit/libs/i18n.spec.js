import { createLocalVue, mount } from "@vue/test-utils";
import TestI18n from "../mocks/TestI18n.vue";
import VueI18n from "vue-i18n";

const localVue = createLocalVue();
localVue.use(VueI18n);

describe("i18n.js", () => {
  test("traduction", () => {
    const wrapper = mount(TestI18n, { localVue });
    expect(wrapper.text()).toBe("Fermer");
  });
});
