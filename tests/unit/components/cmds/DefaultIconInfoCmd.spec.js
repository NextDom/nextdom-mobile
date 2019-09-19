import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import DefaultIconInfoCmd from "@/components/Cmds/DefaultIconInfoCmd.vue";

const localVue = createLocalVue();
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
    state: 12,
    unite: "m"
  },
  icon: "fa fa-check",
  showTitle: true
};

const wrapperOptions = {
  localVue,
  mocks: { $store: store },
  propsData: propsData
};

describe("DefaultIconInfoCmd.vue", () => {
  afterEach(() => {
    propsData.showTitle = true;
    jest.clearAllMocks();
  });
  test("is a Vue instance", () => {
    const wrapper = mount(DefaultIconInfoCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render expected", () => {
    const wrapper = mount(DefaultIconInfoCmd, wrapperOptions);
    expect(wrapper.text()).toContain(propsData.cmd.name);
    expect(wrapper.find("i.fa-check").exists()).toBeTruthy();
    expect(wrapper.text()).toContain(propsData.cmd.state + " " + propsData.cmd.unite);
  });
  test("render hidden button", () => {
    propsData.showTitle = false;
    const wrapper = mount(DefaultIconInfoCmd, wrapperOptions);
    expect(wrapper.text()).not.toContain(propsData.cmd.name);
    expect(wrapper.find("i.fa-check").exists()).toBeTruthy();
    expect(wrapper.text()).toContain(propsData.cmd.state + " " + propsData.cmd.unite);
  });
  test("cmd interaction", () => {
    const wrapper = mount(DefaultIconInfoCmd, wrapperOptions);
    expect(mutations.addShowedCmd).toHaveBeenCalled();
    expect(mutations.addShowedCmd.mock.calls[0][1].cmd.state).toBe(12);
  });
});
