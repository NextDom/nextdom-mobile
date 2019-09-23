import { mount, createLocalVue } from "@vue/test-utils";
import mockAxios from "jest-mock-axios";
import MuseUI from "muse-ui";
import VuePackeryPlugin from "vue-packery-plugin";
import fullDataSet from "../data/home.json";
import { store } from "@/libs/Store.js";
import Home from "@/views/Home.vue";
import EventsManager from "@/libs/EventsManager.js";
import Communication from "@/libs/Communication.js";

const localVue = createLocalVue();
localVue.use(MuseUI);
localVue.use(VuePackeryPlugin);

const propsData = {
  cmd: {
    name: "CmdTest",
    state: "2",
    visible: 1,
    unite: "°",
    icon: ""
  }
};

const wrapperOptions = {
  localVue,
  propsData: propsData,
  mocks: { $store: store, $t: () => 'Translated' }
};

EventsManager.init(Communication, store);

describe("Home.vue", () => {
  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });
  test("is a Vue instance", () => {
    const wrapper = mount(Home, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  test("render home", () => {
    let onResponse = jest.fn();
    const wrapper = mount(Home, wrapperOptions);
    mockAxios.mockResponse({
      data: fullDataSet,
      status: 200,
      statusText: "OK"
    });
    expect(mockAxios.get).toHaveBeenCalled();
    expect(wrapper.emitted().setCurrentView).toBeTruthy();
    expect(wrapper.emitted().setCurrentView[0][0]).toBe("/");
    expect(wrapper.text()).toContain('Maison');
    expect(wrapper.text()).toContain('Salle de Bain');
    const currentTime = Date.now();
    expect(store.getters.isEventsManagerStarted()).toBeTruthy();
  });
});
