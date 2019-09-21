import { mount, createLocalVue } from "@vue/test-utils";
import LineStateCmd from "@/components/Cmds/LineStateCmd.vue";
import Vuex from "vuex";
import MuseUI from "muse-ui";

const localVue = createLocalVue();
localVue.use(MuseUI);
localVue.use(Vuex);

const mutations = {
  addShowedCmd: jest.fn()
};

const store = new Vuex.Store({
  state: {},
  mutations: mutations
});

const propsData = {
  cmd: {
    id: 12,
    name: "CmdTest",
    icon: "",
    state: true
  }
};

const wrapperOptions = {
  localVue,
  propsData: propsData,
  mocks: { $store: store }
};

describe("LineStateCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    propsData.icon = "";
  });
  test("is a Vue instance", () => {
    const wrapper = mount(LineStateCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render without icon", () => {
    const wrapper = mount(LineStateCmd, wrapperOptions);
    expect(wrapper.find("span.line-icon").exists()).toBeFalsy();
    expect(wrapper.find("span.pull-left").text()).toEqual("CmdTest");
    expect(wrapper.find("i.pull-right").exists()).toBeTruthy();
    expect(wrapper.find("i.fa-check").exists()).toBeTruthy();
  });
  test("render with icon", () => {
    propsData.cmd.icon = '<i class="fa fa-glass"></i>';
    const wrapper = mount(LineStateCmd, wrapperOptions);
    expect(wrapper.find("span.line-icon").exists()).toBeTruthy();
    expect(wrapper.find("i.fa-glass").exists()).toBeTruthy();
  });
  test("cmd interaction", () => {
    const wrapper = mount(LineStateCmd, wrapperOptions);
    expect(mutations.addShowedCmd).toHaveBeenCalled();
    expect(mutations.addShowedCmd.mock.calls[0][1].cmd.id).toBe(12);
    wrapper.setProps({ cmd: { state: false } });
    const updateFunc = mutations.addShowedCmd.mock.calls[0][1].updateFunc;
    updateFunc();
    expect(wrapper.vm.$data.icon).toBe("fa-times");
  });
});
