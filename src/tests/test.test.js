import { mount } from "@vue/test-utils";
import ActionLinkedCmd from "../src/components/Cmds/ActionLinkedCmd.vue";

describe("ActionLinkedCmd", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(ActionLinkedCmd);
    except(wrapper.isVueInstance()).toBeTruthy();
  });
});
