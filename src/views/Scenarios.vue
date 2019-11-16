<!--
This file is part of NextDom Software.

NextDom is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

NextDom Software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with NextDom Software. If not, see <http://www.gnu.org/licenses/>.

@Support <https://www.nextdom.org>
@Email   <admin@nextdom.org>
@Authors/Contributors: Sylvaner, Byackee, cyrilphoenix71, ColonelMoutarde, edgd1er, slobberbone, Astral0, DanoneKiD
-->
<template>
  <mu-container class="global scenarios">
    <h1>{{ $t("scenariosTitle") }}</h1>
    <mu-list toggle-nested v-if="scenarios !== null">
      <mu-list-item
        button
        nested
        v-for="groupName in sortedGroupsList"
        v-bind:key="`groupName-${groupName}`"
        v-bind:open="groupsListState[groupName]"
        v-on:click="toggleItem(groupName)"
      >
        <mu-list-item-title>
          <template v-if="groupName === 'no-group'">{{
            $t("nothing")
          }}</template>
          <template v-else>{{ groupName }}</template>
        </mu-list-item-title>
        <mu-list-item-action>
          <mu-icon
            class="toggle-icon"
            size="24"
            value="keyboard_arrow_down"
          ></mu-icon>
        </mu-list-item-action>
        <mu-list-item
          slot="nested"
          v-for="scenario in scenarios[groupName]"
          v-bind:key="scenario.id"
          v-bind:id="'scenario-' + scenario.id"
        >
          <mu-list-item-action>
            <i v-bind:class="scenarioIcon(scenario)"></i>
          </mu-list-item-action>
          <mu-list-item-title>{{ scenario.name }}</mu-list-item-title>
          <mu-list-item-action>
            <div>
              <mu-icon
                size="24"
                v-bind:value="activeStateIcon(scenario.active)"
                v-on:click="changeActiveState(scenario.id, !scenario.active)"
                class="scenario-active"
              ></mu-icon>
              <mu-icon
                class="scenario-state"
                size="24"
                v-bind:value="stateIcon(scenario.state, scenario.active)"
                v-on:click="launch(scenario.id)"
              ></mu-icon>
            </div>
          </mu-list-item-action>
        </mu-list-item>
      </mu-list-item>
    </mu-list>
  </mu-container>
</template>

<script>
import Communication from "../libs/Communication.js";
import Utils from "@/libs/Utils.js";
import AppEventsBus from "@/libs/AppEventsBus";
import EventsManager from "@/libs/EventsManager.js";

/**
 * Show all scenarios
 * @group Pages
 */
export default {
  name: "Scenarios",
  data: function() {
    return {
      scenarios: null,
      groupsListState: [],
      scenariosGroupLink: []
    };
  },
  computed: {
    /**
     * @vuese
     * Get groups list with no-group first
     */
    sortedGroupsList: function() {
      if (this.scenarios !== null) {
        let groupsList = Object.keys(this.scenarios).sort((a, b) => {
          if (a === "no-group") {
            return -1;
          } else if (b === "no-group") {
            return 1;
          } else if (a < b) {
            return -1;
          } else if (a > b) {
            return 1;
          }
          return 0;
        });
        return groupsList;
      }
    }
  },
  mounted() {
    /**
     * @vuese
     * Update tabs and URL
     * @arg New URL
     */
    this.$emit("setCurrentView", "/scenarios");
    // Get dashboard data
    Communication.get("/api/scenario/all/by_group", result => {
      // Restore last list state
      for (let groupName in result) {
        // Hide group like previous
        const showGroup = localStorage.getItem(
          "scenario-group-show-" + groupName
        );
        if (showGroup !== null) {
          this.groupsListState[groupName] = showGroup === "true" ? true : false;
        } else {
          this.groupsListState[groupName] = true;
        }
      }
      this.scenarios = result;
      EventsManager.loop();
      // If do before, problem on render
      for (let groupName in this.scenarios) {
        for (let scenarioIndex in this.scenarios[groupName]) {
          // Retrieve scenario group name from scenario id
          const scenario = this.scenarios[groupName][scenarioIndex];
          this.scenariosGroupLink[scenario.id] = {
            index: scenarioIndex,
            group: groupName
          };
          this.$store.commit("addShowedScenario", {
            scenario: scenario,
            updateFunc: this.update
          });
        }
      }
    });
  },
  methods: {
    /**
     * @vuese
     * Called when group visibility changes
     * @arg Name of the group for change
     */
    toggleItem: function(groupName) {
      this.groupsListState[groupName] = !this.groupsListState[groupName];
      localStorage.setItem(
        "scenario-group-show-" + groupName,
        this.groupsListState[groupName]
      );
    },
    /**
     * @vuese
     * Launch scenario
     * @arg Id of the scenario to launch
     */
    launch: function(scenarioId) {
      const scenario = this.getScenario(scenarioId);
      if (scenario.state != "in progress" && scenario.active === true) {
        Communication.post("/api/scenario/launch/" + scenarioId);
      }
    },
    /**
     * @vuese
     * Get scenario icon
     * @arg Scenario object
     */
    scenarioIcon: function(scenario) {
      return Utils.extractIcon(scenario.displayIcon, "fas fa-film");
    },
    /**
     * @vuese
     * Launch scenario
     * @arg Id of the scenario to launch
     */
    changeActiveState: function(scenarioId, newState) {
      let url = "/api/scenario/enable/";
      if (!newState) {
        url = "/api/scenario/disable/";
      }
      Communication.post(url + scenarioId, result => {
        if (!result.data) {
          AppEventsBus.$emit("showError", this.$t("execError"));
        } else {
          const scenario = this.getScenario(scenarioId);
          scenario.active = !scenario.active;
        }
      });
    },
    /**
     * @vuese
     * Obtain scenario from his id
     * @arg scenarioId
     */
    getScenario: function(scenarioId) {
      const scenarioLocation = this.scenariosGroupLink[scenarioId];
      return this.scenarios[scenarioLocation.group][scenarioLocation.index];
    },
    /**
     * @vuese
     * Update scenario state
     * @arg scenarioId
     * @arg newState
     */
    update: function(scenarioId, newState) {
      const scenario = this.getScenario(scenarioId);
      scenario.state = newState;
    },
    stateIcon: function(state, activeState) {
      if (activeState) {
        if (state == "in progress") {
          return "sync";
        }
        return "play_circle_filled";
      }
      return "block";
    },
    /**
     * @vuese
     * Get active state icon
     */
    activeStateIcon: function(scenarioActiveState) {
      if (scenarioActiveState) {
        return "check";
      } else {
        return "block";
      }
    }
  }
};
</script>

<style scoped lang="scss">
.mu-item-action i {
  font-size: 1.4rem;
}
.mu-item-action > div > i:first-child {
  margin-right: 0.2rem;
}
</style>
