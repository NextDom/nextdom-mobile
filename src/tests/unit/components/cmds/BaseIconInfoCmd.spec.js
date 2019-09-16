import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import BaseIconInfoCmd from "@/components/Cmds/BaseIconInfoCmd.vue";

const localValue = createLocalVue();
localValue.use(Vuex);

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

const wrapperOptions = {
  localValue,
  mocks: {
    $store: store
  },
  propsData: propsData
};
describe("BaseIconInfoCmd.vue", () => {
  test("is a Vue instance", () => {
    const wrapper = shallowMount(BaseIconInfoCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render expected", () => {
    const wrapper = shallowMount(BaseIconInfoCmd, wrapperOptions);
    expect(wrapper.text()).toContain(propsData.cmd.name);
    expect(wrapper.text()).toContain(propsData.cmd.state + " " + propsData.cmd.unite);
  });
  test("cmd interaction", () => {
    shallowMount(BaseIconInfoCmd, wrapperOptions);
    expect(mutations.addShowedCmd).toHaveBeenCalled();
  });
});
