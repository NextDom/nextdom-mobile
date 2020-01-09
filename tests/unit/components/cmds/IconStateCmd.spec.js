import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import IconStateCmd from "@/components/Cmds/IconStateCmd.vue";

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
    cmdValue: false
  }
};

const wrapperOptions = {
  localVue,
  mocks: {
    $store: store
  },
  propsData: propsData
};

describe("IconStateCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    propsData.cmd.cmdValue = false;
  });
  test("is a Vue instance", () => {
    const wrapper = mount(IconStateCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render", () => {
    const wrapper = mount(IconStateCmd, wrapperOptions);
    expect(wrapper.find("i.fa-times").exists()).toBeTruthy();
  });

  test("test default value", () => {
    const wrapper = mount(IconStateCmd, wrapperOptions);
    expect(wrapper.vm.$data.icon).toBe("fas fa-times");
  });
  test("test positive value ", () => {
    propsData.cmd.cmdValue = true;
    const wrapper = mount(IconStateCmd, wrapperOptions);
    expect(wrapper.vm.$data.icon).toBe("fas fa-check");
  });
  test("cmd store interaction", () => {
    const wrapper = mount(IconStateCmd, wrapperOptions);
    expect(mutations.addShowedCmd).toHaveBeenCalled();
    const updateFunc = mutations.addShowedCmd.mock.calls[0][1].updateFunc;
    wrapper.setProps({ cmd: { cmdValue: true } });
    updateFunc();
    expect(wrapper.vm.$data.icon).toBe("fas fa-check");
  });
});
