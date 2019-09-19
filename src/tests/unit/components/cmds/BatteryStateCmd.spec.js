import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import BatteryStateCmd from "@/components/Cmds/BatteryStateCmd.vue";

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
    value: 90
  }
};

const wrapperOptions = {
  localVue,
  mocks: {
    $store: store
  },
  propsData: propsData
};

describe("BatteryStateCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    propsData.cmd.value = 90;
  });
  test("is a Vue instance", () => {
    const wrapper = shallowMount(BatteryStateCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("test default value battery high", () => {
    const wrapper = shallowMount(BatteryStateCmd, wrapperOptions);
    expect(wrapper.vm.$data.icon).toBe("battery_full");
  });
  test("test default value battery low", () => {
    propsData.cmd.value = 20;
    const wrapper = shallowMount(BatteryStateCmd, wrapperOptions);
    expect(wrapper.vm.$data.icon).toBe("battery_alert");
  });
  test("cmd store interaction", () => {
    const wrapper = shallowMount(BatteryStateCmd, wrapperOptions);
    expect(mutations.addShowedCmd).toHaveBeenCalled();
    expect(wrapper.emitted().setBatteryInfo).toBeTruthy();
    const updateFunc = mutations.addShowedCmd.mock.calls[0][1].updateFunc;
    wrapper.setProps({ cmd: { value: 12 } });
    updateFunc();
    expect(wrapper.vm.$data.icon).toBe("battery_alert");
    expect(wrapper.emitted().setBatteryInfo.length).toBe(2);
  });
});
