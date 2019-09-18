import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import ActionLinkedCmd from "@/components/Cmds/ActionLinkedCmd.vue";

const localValue = createLocalVue();
localValue.use(Vuex);

const mutations = {
  addAction: jest.fn()
};

const store = new Vuex.Store({
  state: {},
  mutations: mutations
});

const propsData = {
  cmd: {
    name: "CmdTest",
    state: 12,
    unite: "m"
  }
};

const wrapperOptions = {
  localValue,
  mocks: {
    $store: store
  },
  propsData: propsData
};
describe("ActionLinkedCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("is a Vue instance", () => {
    const wrapper = shallowMount(ActionLinkedCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
