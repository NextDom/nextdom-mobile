import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import PresenceStateCmd from "@/components/Cmds/PresenceStateCmd.vue";
import MuseUI from "muse-ui";

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

describe("PresenceStateCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    propsData.cmd.state = true;
  });
  test("is a Vue instance", () => {
    const wrapper = mount(PresenceStateCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render", () => {
    const wrapper = mount(PresenceStateCmd, wrapperOptions);
    expect(wrapper.find("i.fa-walking").exists()).toBeTruthy();
  });
  test("test default unlocked", () => {
    propsData.cmd.state = false;
    const wrapper = mount(PresenceStateCmd, wrapperOptions);
    expect(wrapper.vm.$data.icon).toBe("fa-expand");
  });
  test("cmd store interaction", () => {
    const wrapper = mount(PresenceStateCmd, wrapperOptions);
    expect(mutations.addShowedCmd).toHaveBeenCalled();
    const updateFunc = mutations.addShowedCmd.mock.calls[0][1].updateFunc;
    wrapper.setProps({ cmd: { state: false } });
    updateFunc();
    expect(wrapper.vm.$data.icon).toBe("fa-expand");
  });
});
