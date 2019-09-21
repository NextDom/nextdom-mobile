import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import MuseUI from "muse-ui";
import WindowStateCmd from "@/components/Cmds/WindowStateCmd.vue";

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
    cmdValue: true
  }
};

const wrapperOptions = {
  localVue,
  mocks: {
    $store: store
  },
  propsData: propsData
};

describe("WindowStateCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    propsData.cmd.cmdValue = true;
  });
  test("is a Vue instance", () => {
    const wrapper = mount(WindowStateCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render", () => {
    const wrapper = mount(WindowStateCmd, wrapperOptions);
    expect(wrapper.find("i.nextdom-fenetre-ouverte").exists()).toBeTruthy();
  });
  test("test default value open window", () => {
    const wrapper = mount(WindowStateCmd, wrapperOptions);
    expect(wrapper.vm.$data.icon).toBe("nextdom-fenetre-ouverte");
  });
  test("test default value close window", () => {
    propsData.cmd.cmdValue = false;
    const wrapper = mount(WindowStateCmd, wrapperOptions);
    expect(wrapper.vm.$data.icon).toBe("nextdom-fenetre-ferme");
  });
  test("cmd store interaction", () => {
    const wrapper = mount(WindowStateCmd, wrapperOptions);
    expect(mutations.addShowedCmd).toHaveBeenCalled();
    const updateFunc = mutations.addShowedCmd.mock.calls[0][1].updateFunc;
    wrapper.setProps({ cmd: { cmdValue: false } });
    updateFunc();
    expect(wrapper.vm.$data.icon).toBe("nextdom-fenetre-ferme");
  });
});
