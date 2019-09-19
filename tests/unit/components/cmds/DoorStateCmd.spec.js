import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import DoorStateCmd from "@/components/Cmds/DoorStateCmd.vue";

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

describe("DoorStateCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    propsData.cmd.cmdValue = true;
  });
  test("is a Vue instance", () => {
    const wrapper = mount(DoorStateCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render", () => {
    const wrapper = mount(DoorStateCmd, wrapperOptions);
    expect(wrapper.find("i.nextdom-porte-ouverte").exists()).toBeTruthy();
  });
  test("test default value open door", () => {
    const wrapper = mount(DoorStateCmd, wrapperOptions);
    expect(wrapper.vm.$data.icon).toBe("nextdom-porte-ouverte");
  });
  test("test default value close door", () => {
    propsData.cmd.cmdValue = false;
    const wrapper = mount(DoorStateCmd, wrapperOptions);
    expect(wrapper.vm.$data.icon).toBe("nextdom-porte-ferme");
  });
  test("cmd store interaction", () => {
    const wrapper = mount(DoorStateCmd, wrapperOptions);
    expect(mutations.addShowedCmd).toHaveBeenCalled();
    const updateFunc = mutations.addShowedCmd.mock.calls[0][1].updateFunc;
    wrapper.setProps({ cmd: { cmdValue: false } });
    updateFunc();
    expect(wrapper.vm.$data.icon).toBe("nextdom-porte-ferme");
  });
});
