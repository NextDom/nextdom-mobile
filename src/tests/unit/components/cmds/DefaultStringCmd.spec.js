import { mount, createLocalVue } from "@vue/test-utils";
import DefaultStringCmd from "@/components/Cmds/DefaultStringCmd.vue";
import Vuex from "vuex";
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
    name: "CmdTest",
    state: "blue",
    visible: 1
  }
};

const wrapperOptions = {
  localVue,
  propsData: propsData,
  mocks: { $store: store }
};

describe("DefaultStringCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("is a Vue instance", () => {
    const wrapper = mount(DefaultStringCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render visibile", () => {
    const wrapper = mount(DefaultStringCmd, wrapperOptions);
    expect(wrapper.text()).toEqual("CmdTest blue");
  });
  test("cmd interaction", () => {
    const wrapper = mount(DefaultStringCmd, wrapperOptions);
    expect(mutations.addShowedCmd).toHaveBeenCalled();
  });
});
