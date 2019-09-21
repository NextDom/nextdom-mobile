import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import MuseUI from "muse-ui";
import SabotageInfoCmd from "@/components/Cmds/SabotageInfoCmd.vue";

const localVue = createLocalVue();
localVue.use(MuseUI);
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

describe("SabotageInfoCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    propsData.cmd.state = true;
  });
  test("is a Vue instance", () => {
    const wrapper = mount(SabotageInfoCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render", () => {
    const wrapper = mount(SabotageInfoCmd, wrapperOptions);
    expect(wrapper.find("i.fa-check").exists()).toBeTruthy();
  });
  test("test no sabotage", () => {
    propsData.cmd.state = false;
    const wrapper = mount(SabotageInfoCmd, wrapperOptions);
    expect(wrapper.vm.$data.icon).toBe("fa-notifications_active");
  });
  test("cmd store interaction", () => {
    const wrapper = mount(SabotageInfoCmd, wrapperOptions);
    expect(mutations.addShowedCmd).toHaveBeenCalled();
    const updateFunc = mutations.addShowedCmd.mock.calls[0][1].updateFunc;
    wrapper.setProps({ cmd: { state: false } });
    updateFunc();
    expect(wrapper.vm.$data.icon).toBe("fa-notifications_active");
  });
});
