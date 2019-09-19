import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import TemperatureInfoCmd from "@/components/Cmds/TemperatureInfoCmd.vue";

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
    name: "ConsumptionTest",
    value: 90,
    unite: "%"
  }
};

const wrapperOptions = {
  localVue,
  mocks: {
    $store: store
  },
  propsData: propsData
};

describe("TemperatureInfoCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    propsData.cmd.value = 90;
  });
  test("is a Vue instance", () => {
    const wrapper = shallowMount(TemperatureInfoCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("icon initiliazation", () => {
    const wrapper = shallowMount(TemperatureInfoCmd, wrapperOptions);
    expect(wrapper.vm.$data.icon).toBe("fa fa-thermometer-empty");
  });
});
