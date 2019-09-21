import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import RefreshCmd from "@/components/Cmds/RefreshCmd.vue";

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
    id: 37
  }
};

const wrapperOptions = {
  localVue,
  mocks: {
    $store: store
  },
  propsData: propsData
};

describe("RefreshCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("is a Vue instance", () => {
    const wrapper = mount(RefreshCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("click on button", () => {
    const wrapper = mount(RefreshCmd, wrapperOptions);
    expect(wrapper.emitted().setRefreshCommand).toBeTruthy();
    expect(wrapper.emitted().setRefreshCommand[0][0]).toBe(37);
  });
});
