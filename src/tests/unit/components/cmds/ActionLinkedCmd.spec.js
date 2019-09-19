import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import ActionLinkedCmd from "@/components/Cmds/ActionLinkedCmd.vue";
import MuseUI from "muse-ui";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(MuseUI);

const mutations = {
  addAction: jest.fn()
};

const store = new Vuex.Store({
  state: {},
  mutations: mutations
});

const propsData = {
  cmd: {
    id: 22,
    name: "CmdTest",
    value: 0,
    unite: "m"
  }
};

const wrapperOptions = {
  localVue,
  mocks: {
    $store: store
  },
  propsData: propsData
};
describe("ActionLinkedCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    propsData.cmd.value = 0;
  });
  test("is a Vue instance", () => {
    const wrapper = mount(ActionLinkedCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render direct button", () => {
    const wrapper = mount(ActionLinkedCmd, wrapperOptions);
    expect(wrapper.find("button").exists()).toBeTruthy();
  });
  test("click on button", () => {
    const wrapper = mount(ActionLinkedCmd, wrapperOptions);
    wrapper.find("button").trigger("click");
    expect(wrapper.emitted().executeCmd).toBeTruthy();
    expect(wrapper.emitted().executeCmd[0][0]).toBe(22);
  });
  test("render indirect button", () => {
    propsData.cmd.value = 99;
    const wrapper = mount(ActionLinkedCmd, wrapperOptions);
    expect(wrapper.find("button").exists()).toBeFalsy();
    expect(mutations.addAction).toHaveBeenCalled();
  });
});
