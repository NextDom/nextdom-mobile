import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import HumidityInfoCmd from "@/components/Cmds/HumidityInfoCmd.vue";

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

describe("HumidityInfoCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    propsData.cmd.value = 90;
  });
  test("is a Vue instance", () => {
    const wrapper = mount(HumidityInfoCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("icon initiliazation", () => {
    const wrapper = mount(HumidityInfoCmd, wrapperOptions);
    expect(wrapper.vm.$data.icon).toBe("fas fa-tint");
  });
});
