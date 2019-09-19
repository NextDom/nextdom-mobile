import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import LightStateCmd from "@/components/Cmds/LightStateCmd.vue";

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

describe("LightStateCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    propsData.cmd.state = true;
  });
  test("is a Vue instance", () => {
    const wrapper = mount(LightStateCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render", () => {
    const wrapper = mount(LightStateCmd, wrapperOptions);
    expect(wrapper.find("i.nextdom-lumiere-on").exists()).toBeTruthy();
  });

  test("test default value", () => {
    const wrapper = mount(LightStateCmd, wrapperOptions);
    expect(wrapper.vm.$data.icon).toBe("nextdom-lumiere-on");
  });
  test("test light off", () => {
    propsData.cmd.state = false;
    const wrapper = mount(LightStateCmd, wrapperOptions);
    expect(wrapper.vm.$data.icon).toBe("nextdom-lumiere-off");
  });
  test("cmd store interaction", () => {
    const wrapper = mount(LightStateCmd, wrapperOptions);
    expect(mutations.addShowedCmd).toHaveBeenCalled();
    const updateFunc = mutations.addShowedCmd.mock.calls[0][1].updateFunc;
    wrapper.setProps({ cmd: { state: false } });
    updateFunc();
    expect(wrapper.vm.$data.icon).toBe("nextdom-lumiere-off");
  });
  test("click interaction", () => {
    const wrapper = mount(LightStateCmd, wrapperOptions);
    wrapper.find("i").trigger("click");
    expect(wrapper.emitted().executeAction).toBeTruthy();
    expect(wrapper.emitted().executeAction[0][1]).toBe("LIGHT_OFF");
  });
});
