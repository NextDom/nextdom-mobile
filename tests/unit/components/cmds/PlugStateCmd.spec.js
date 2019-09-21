import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import PlugStateCmd from "@/components/Cmds/PlugStateCmd.vue";

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
    state: true
  }
};

const wrapperOptions = {
  localVue,
  mocks: {
    $store: store
  },
  propsData: propsData
};

describe("PlugStateCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    propsData.cmd.state = true;
  });
  test("is a Vue instance", () => {
    const wrapper = mount(PlugStateCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render", () => {
    const wrapper = mount(PlugStateCmd, wrapperOptions);
    expect(wrapper.find("i.fa-plug").exists()).toBeTruthy();
  });

  test("test default value", () => {
    const wrapper = mount(PlugStateCmd, wrapperOptions);
    expect(wrapper.vm.$data.icon).toBe("fa-plug");
  });
  test("test plug off", () => {
    propsData.cmd.state = false;
    const wrapper = mount(PlugStateCmd, wrapperOptions);
    expect(wrapper.vm.$data.icon).toBe("fa-times");
  });
  test("cmd store interaction", () => {
    const wrapper = mount(PlugStateCmd, wrapperOptions);
    expect(mutations.addShowedCmd).toHaveBeenCalled();
    const updateFunc = mutations.addShowedCmd.mock.calls[0][1].updateFunc;
    wrapper.setProps({ cmd: { state: false } });
    updateFunc();
    expect(wrapper.vm.$data.icon).toBe("fa-times");
  });
  test("store and click interaction", () => {
    const wrapper = mount(PlugStateCmd, wrapperOptions);
    const updateFunc = mutations.addShowedCmd.mock.calls[0][1].updateFunc;
    expect(mutations.addShowedCmd).toHaveBeenCalled();

    wrapper.find("i").trigger("click");
    expect(wrapper.emitted().executeAction.length).toBe(1);
    expect(wrapper.emitted().executeAction[0][1]).toBe("ENERGY_OFF");

    wrapper.setProps({ cmd: { state: false } });
    updateFunc();
    expect(wrapper.vm.$data.icon).toBe("fa-times");

    wrapper.find("i").trigger("click");
    expect(wrapper.emitted().executeAction.length).toBe(2);
    expect(wrapper.emitted().executeAction[1][1]).toBe("ENERGY_ON");
  });
});
