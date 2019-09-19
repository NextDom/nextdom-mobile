import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import ConsumptionInfoCmd from "@/components/Cmds/ConsumptionInfoCmd.vue";

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

describe("ConsumptionInfoCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    propsData.cmd.value = 90;
  });
  test("is a Vue instance", () => {
    const wrapper = mount(ConsumptionInfoCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("icon initiliazation", () => {
    const wrapper = mount(ConsumptionInfoCmd, wrapperOptions);
    expect(wrapper.vm.$data.icon).toBe("fas fa-chart-area");
  });
});
