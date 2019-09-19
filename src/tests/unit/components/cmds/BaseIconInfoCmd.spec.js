import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import BaseIconInfoCmd from "@/components/Cmds/BaseIconInfoCmd.vue";

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
  }
};

let wrapper = null;
describe("BaseIconInfoCmd.vue", () => {
  beforeEach(() => {
    wrapper = shallowMount(BaseIconInfoCmd, { localVue, mocks: { $store: store }, propsData: propsData });
  });
  afterEach(() => {
    wrapper.destroy();
    jest.clearAllMocks();
  });
  test("is a Vue instance", () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render expected", () => {
    expect(wrapper.text()).toContain(propsData.cmd.name);
    expect(wrapper.text()).toContain(propsData.cmd.state + " " + propsData.cmd.unite);
  });
  test("cmd interaction", () => {
    expect(mutations.addShowedCmd).toHaveBeenCalled();
  });
  test("data update", () => {
    expect(wrapper.text()).toContain(propsData.cmd.state + " " + propsData.cmd.unite);
    wrapper.setProps({ cmd: { name: "plouf", state: 24, unite: "m" } });
    expect(wrapper.text()).toContain("24 m");
  });
});
