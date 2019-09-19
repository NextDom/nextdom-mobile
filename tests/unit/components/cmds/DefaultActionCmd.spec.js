import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import DefaultActionCmd from "@/components/Cmds/DefaultActionCmd.vue";
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
    genericType: "DONT"
  }
};

const wrapperOptions = {
  localVue,
  mocks: {
    $store: store
  },
  propsData: propsData
};
describe("DefaultActionCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("is a Vue instance", () => {
    const wrapper = mount(DefaultActionCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render content", () => {
    const wrapper = mount(DefaultActionCmd, wrapperOptions);
    expect(wrapper.find("button").exists()).toBeTruthy();
    expect(wrapper.text()).toBe("CmdTest");
  });
  test("event on mount", () => {
    const wrapper = mount(DefaultActionCmd, wrapperOptions);
    expect(mutations.addAction).toHaveBeenCalled();
    expect(mutations.addAction.mock.calls[0][1].genericType).toBe("DONT");
  });
  test("click on button", () => {
    const wrapper = mount(DefaultActionCmd, wrapperOptions);
    wrapper.find("button").trigger("click");
    expect(wrapper.emitted().executeCmd).toBeTruthy();
    expect(wrapper.emitted().executeCmd[0][0]).toBe(22);
  });
});
