import { shallowMount, createLocalVue } from "@vue/test-utils";
import DefaultCmd from "@/components/Cmds/DefaultCmd.vue";
import MuseUI from "muse-ui";

const localVue = createLocalVue();
localVue.use(MuseUI);

const propsData = {
  cmd: {
    name: "CmdTest",
    value: 90,
    id: 72,
    visible: true
  }
};

const wrapperOptions = {
  localVue,
  propsData: propsData
};

describe("DefaultCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("is a Vue instance", () => {
    const wrapper = shallowMount(DefaultCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render", () => {
    const wrapper = shallowMount(DefaultCmd, wrapperOptions);
    expect(wrapper.text()).toEqual("CmdTest 90 72 true");
  });
});
