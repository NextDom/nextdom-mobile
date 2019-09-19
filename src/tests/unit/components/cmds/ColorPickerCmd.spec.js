import { shallowMount, createLocalVue } from "@vue/test-utils";
import ColorPickerCmd from "@/components/Cmds/ColorPickerCmd.vue";
import MuseUI from "muse-ui";

const localVue = createLocalVue();
localVue.use(MuseUI);
const propsData = {
  cmd: {
    value: 90
  }
};

const wrapperOptions = {
  localVue,
  propsData: propsData
};

describe("ColorPickerCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("is a Vue instance", () => {
    const wrapper = shallowMount(ColorPickerCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render", () => {
    const wrapper = shallowMount(ColorPickerCmd, wrapperOptions);
    expect(wrapper.find("mu-button-stub").exists()).toBe(true);
    expect(wrapper.find("mu-dialog-stub").exists()).toBe(true);
  });
});
