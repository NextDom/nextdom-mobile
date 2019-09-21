import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import MuseUI from "muse-ui";
import SliderCmd from "@/components/Cmds/SliderCmd.vue";

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
    state: 12
  }
};

const wrapperOptions = {
  localVue,
  mocks: {
    $store: store
  },
  propsData: propsData
};

describe("SliderCmd.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    propsData.cmd.state = 12;
    if (propsData.cmd.hasOwnProperty("minValue")) {
      delete propsData.cmd.minValue;
    }
    if (propsData.cmd.hasOwnProperty("maxValue")) {
      delete propsData.cmd.maxValue;
    }
  });
  test("is a Vue instance", () => {
    const wrapper = mount(SliderCmd, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render", () => {
    const wrapper = mount(SliderCmd, wrapperOptions);
    const cursor = wrapper.find("div.mu-slider-display-value");
    expect(cursor.exists()).toBeTruthy();
    expect(cursor.attributes("style")).toBe("left: 12%;");
    expect(wrapper.find("span.display-value-text").text()).toBe("12");
    expect(wrapper.find('input[type="hidden"]').exists()).toBeTruthy();
  });
  test("test min/max value", () => {
    propsData.cmd.minValue = 2;
    propsData.cmd.maxValue = 20;
    const wrapper = mount(SliderCmd, wrapperOptions);
    const cursor = wrapper.find("div.mu-slider-display-value");
    expect(cursor.exists()).toBeTruthy();
    expect(cursor.attributes("style")).toContain("left: 55");
  });
  test("change interactions", () => {
    const wrapper = mount(SliderCmd, wrapperOptions);
    wrapper.find("div.mu-slider.slider").trigger("change");
    expect(wrapper.emitted().executeCmd).toBeTruthy();
    expect(wrapper.emitted().executeCmd[0][1].hasOwnProperty("slider")).toBeTruthy();
  });
});
