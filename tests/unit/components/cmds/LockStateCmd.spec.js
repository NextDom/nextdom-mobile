import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import LockStateCmd from "@/components/Cmds/LockStateCmd.vue";

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

describe("LockStateCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    propsData.cmd.state = true;
  });
  test("is a Vue instance", () => {
    const wrapper = mount(LockStateCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render", () => {
    const wrapper = mount(LockStateCmd, wrapperOptions);
    expect(wrapper.find("i.nextdom-lock-ferme").exists()).toBeTruthy();
  });
  test("test default unlocked", () => {
    propsData.cmd.state = false;
    const wrapper = mount(LockStateCmd, wrapperOptions);
    expect(wrapper.vm.$data.icon).toBe("nextdom-lock-ouvert");
  });
  test("cmd store interaction", () => {
    const wrapper = mount(LockStateCmd, wrapperOptions);
    expect(mutations.addShowedCmd).toHaveBeenCalled();
    const updateFunc = mutations.addShowedCmd.mock.calls[0][1].updateFunc;
    wrapper.setProps({ cmd: { state: false } });
    updateFunc();
    expect(wrapper.vm.$data.icon).toBe("nextdom-lock-ouvert");
  });
});
