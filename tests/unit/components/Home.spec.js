import { mount, createLocalVue } from "@vue/test-utils";
import mockAxios from "jest-mock-axios";
import MuseUI from "muse-ui";
import VuePackeryPlugin from "vue-packery-plugin";
import fullDataSet from "../data/home.json";
import partialDataSet from "../data/partial-home.json";
import { store } from "@/libs/Store";
import Home from "@/views/Home.vue";
import EventsManager from "@/libs/EventsManager";
import Communication from "@/libs/Communication";

const localVue = createLocalVue();
localVue.use(MuseUI);
localVue.use(VuePackeryPlugin);

const wrapperOptions = {
  localVue,
  propsData: {},
  mocks: { $store: store, $t: () => 'Translated' }
};

EventsManager.init(Communication, store);

describe("Home.vue", () => {
  beforeEach(() => {
    wrapperOptions.mocks.$store.commit('saveEqLogicsOrder', {});
  });
  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
    wrapperOptions.propsData = {};
  });
  /*
  test("is a Vue instance", () => {
    const wrapper = mount(Home, wrapperOptions);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  */
  test("render home", () => {
    let onResponse = jest.fn();
    const wrapper = mount(Home, wrapperOptions);
    mockAxios.mockResponse({
      data: JSON.parse(JSON.stringify(fullDataSet)),
      status: 200,
      statusText: "OK"
    });
    expect(mockAxios.get).toHaveBeenCalled();
    expect(mockAxios.get.mock.calls[0][0]).toEqual('/api/summary/get_default_room_tree');
    expect(wrapper.emitted().setCurrentView).toBeTruthy();
    expect(wrapper.emitted().setCurrentView[0][0]).toBe("/");
    expect(wrapper.text()).toContain('Maison');
    expect(wrapper.text()).toContain('Salle de Bain');
    expect(store.getters.isEventsManagerStarted()).toBeTruthy();
    expect(wrapper.text().replace(/[ \n\t]/g, '')).toContain('GatewayXiaomiOnOuverturePrincipale');
  });
  test("render partial home", () => {
    let onResponse = jest.fn();
    wrapperOptions.propsData = {roomId: "2"};
    const wrapper = mount(Home, wrapperOptions);
    mockAxios.mockResponse({
      data: partialDataSet,
      status: 200,
      statusText: "OK"
    });
    expect(mockAxios.get).toHaveBeenCalled();
    expect(mockAxios.get.mock.calls[0][0]).toEqual('/api/summary/get_room_tree/2');
    expect(wrapper.emitted().setCurrentView).toBeTruthy();
    expect(wrapper.emitted().setCurrentView[0][0]).toBe("/");
    expect(wrapper.text()).toContain('Room');
    expect(store.getters.isEventsManagerStarted()).toBeTruthy();
  });
  test("sort eqLogics effect", () => {
    wrapperOptions.mocks.$store.commit('saveEqLogicsOrder', {"3":5,"5":1});
    const wrapper = mount(Home, wrapperOptions);
    mockAxios.mockResponse({
      data: JSON.parse(JSON.stringify(fullDataSet)),
      status: 200,
      statusText: "OK"
    });
    expect(mockAxios.get).toHaveBeenCalled();
    expect(wrapper.text().replace(/[ \n\t]/g, '')).toContain('OuverturePrincipaleGatewayXiaomi');
  });
});
