import { mount, createLocalVue } from "@vue/test-utils";
import DefaultInfoCmd from "@/components/Cmds/DefaultInfoCmd.vue";
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
    name: "CmdTest",
    state: "2",
    visible: 1,
    unite: "°",
    icon: ""
  }
};

const wrapperOptions = {
  localVue,
  propsData: propsData,
  mocks: { $store: store }
};

describe("DefaultInfoCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    propsData.icon = "";
  });
  test("is a Vue instance", () => {
    const wrapper = mount(DefaultInfoCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render visibile", () => {
    const wrapper = mount(DefaultInfoCmd, wrapperOptions);
    expect(wrapper.find("span.line-icon").exists()).toBeFalsy();
    expect(wrapper.find("span.pull-left").text()).toEqual("CmdTest");
    expect(wrapper.find("span.pull-right").text()).toEqual("2 °");
  });
  test("render with icon", () => {
    propsData.cmd.icon = '<i class="fa fa-check"></i>';
    const wrapper = mount(DefaultInfoCmd, wrapperOptions);
    expect(wrapper.find("span.line-icon").exists()).toBeTruthy();
    expect(wrapper.find("i.fa-check").exists()).toBeTruthy();
  });
  test("cmd interaction", () => {
    const wrapper = mount(DefaultInfoCmd, wrapperOptions);
    expect(mutations.addShowedCmd).toHaveBeenCalled();
    expect(mutations.addShowedCmd.mock.calls[0][1].cmd.state).toBe("2");
  });
});
