import { mount, createLocalVue } from "@vue/test-utils";
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
    const wrapper = mount(ColorPickerCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render only button", () => {
    const wrapper = mount(ColorPickerCmd, wrapperOptions);
    expect(wrapper.find("button").exists()).toBeTruthy();
    expect(wrapper.find("div.mu-dialog-wrapper").exists()).toBeFalsy();
  });
  test("click on button and modal", () => {
    const wrapper = mount(ColorPickerCmd, wrapperOptions);
    wrapper.find("button").trigger("click");
    expect(wrapper.find("div.mu-dialog-wrapper").exists()).toBeTruthy();
    expect(wrapper.find("canvas.farbtastic-overlay").exists()).toBeTruthy();
  });
});
