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
  <mu-container class="global rooms">
    <template v-if="room">
      <mu-container class="button-wrapper room-button">
        <mu-button
          class="pull-left"
          color="primary"
          v-bind:to="fatherLink"
          v-if="showFatherLink"
        >
          <mu-icon left value="menu_open"></mu-icon>
          <template v-if="room.father !== undefined">{{
            room.father.name
          }}</template>
          <template v-else>Racine</template>
        </mu-button>
        <mu-button
          class="pull-right"
          color="secondary"
          v-bind:to="viewLink"
          v-if="room.id"
        >
          <mu-icon left value="developer_board"></mu-icon>
          {{ $t("summary") }}
        </mu-button>
      </mu-container>
      <h2 v-if="room.id">{{ room.name }}</h2>
      <mu-grid-list v-bind:cols="2" v-bind:padding="0">
        <RoomWidget
          v-for="child in room.children"
          v-bind:key="child.id"
          v-bind:room="child"
        ></RoomWidget>
      </mu-grid-list>
      <mu-container class="room-config" v-if="room.id">
        <mu-expansion-panel>
          <div slot="header">
            <i class="fas fa-cog mu-icon-left"></i>{{ $t("configuration") }}
          </div>
          <mu-form v-bind:model="form">
            <span>{{ $t("visibility") }}</span>
            <mu-switch
              class="pull-right"
              v-model="form.isVisible"
              v-on:change="changeRoomVisibility"
            ></mu-switch>
          </mu-form>
        </mu-expansion-panel>
        <mu-expansion-panel v-if="eqLogics.length > 0">
          <div slot="header">
            <i class="fas fa-plug mu-icon-left"></i>{{ $t("equipments") }}
          </div>
          <draggable
            v-model="eqLogics"
            @start="drag = true"
            @end="drag = false"
            class="draggable-list"
            v-on:update="saveOrderData"
          >
            <div v-for="eqLogic in eqLogics" v-bind:key="eqLogic.id">
              <span v-on:click="showCommandsDialog(eqLogic.id)">{{
                eqLogic.name
              }}</span>
              <mu-icon class="draggable-handle" value="drag_handle"></mu-icon>
              <mu-list-item-action
                v-on:click="changeEqLogicVisibility(eqLogic.id)"
              >
                <mu-icon
                  v-bind:data-id="eqLogic.id"
                  v-bind:value="eqLogicsVisibility[eqLogic.id]"
                ></mu-icon>
              </mu-list-item-action>
            </div>
          </draggable>
        </mu-expansion-panel>
      </mu-container>
    </template>
    <mu-dialog
      title="Phone Ringtone"
      width="360"
      scrollable
      v-bind:open.sync="cmdDialogShowed"
    >
      <mu-list>
        <div v-for="cmd in cmdsToShow" v-bind:key="cmd.id">
          <mu-list-item-action>
            <mu-checkbox
              v-model="cmdsToShowForm.checkbox"
              v-bind:label="cmd.name"
              v-bind:value="cmd.id"
              v-on:click="updateCommand()"
            ></mu-checkbox>
          </mu-list-item-action>
        </div>
      </mu-list>
      <mu-button
        slot="actions"
        flat
        color="primary"
        v-on:click="closeCommandsDialog"
        >ok</mu-button
      >
    </mu-dialog>
  </mu-container>
</template>

<script>
import RoomWidget from "@/components/RoomWidget.vue";
import Communication from "../libs/Communication.js";
import draggable from "vuedraggable";

/**
 * Navigate in rooms tree
 * @group Pages
 */
export default {
  name: "Rooms",
  data: function() {
    return {
      room: null,
      form: {
        isVisible: true
      },
      eqLogicsVisibility: {},
      eqLogics: [],
      orderData: {},
      cmdDialogShowed: false,
      cmdsToShow: [],
      cmdsToShowForm: {
        checkbox: []
      }
    };
  },
  props: {
    // Current room Id
    roomId: {
      type: String,
      default: undefined
    }
  },
  components: {
    RoomWidget,
    draggable
  },
  computed: {
    /**
     * @vuese
     * Test if father link can be showed
     */
    showFatherLink: function() {
      if (this.room.id !== null) {
        return true;
      }
      return false;
    },
    /**
     * @vuese
     * Get father link
     */
    fatherLink: function() {
      if (this.room.father === undefined) {
        return "/rooms";
      } else {
        return "/rooms/" + this.room.father.id;
      }
    },
    /**
     * @vuese
     * Get dashboard link
     */
    viewLink: function() {
      return "/" + this.room.id;
    }
  },
  mounted() {
    /**
     * @vuese
     * Update tabs and URL
     * @arg New URL
     */
    this.$emit("setCurrentView", "/rooms");
    // Get data from default room
    if (this.roomId === undefined) {
      Communication.get("/api/room/get_roots", data => {
        this.room = data;
      });
    } else {
      // Get data from specific room
      Communication.get("/api/room/get_tree/" + this.roomId, data => {
        this.room = data;
        this.initRoomConfig();
      });
    }
  },
  methods: {
    /**
     * @vuese
     * Init visibility and get data
     */
    initRoomConfig() {
      const eqLogicsOrder = this.$store.getters.getEqLogicsOrder();
      // Init room visibility
      let isVisibleStoredValue = localStorage.getItem(
        "is-visible-room-" + this.room.id
      );
      if (isVisibleStoredValue !== null) {
        this.form.isVisible = isVisibleStoredValue === "true" ? true : false;
      }
      Communication.get("/api/eqlogic/room/" + this.room.id, data => {
        // Loop with push for reactivity
        for (let eqLogicIndex = 0; eqLogicIndex < data.length; ++eqLogicIndex) {
          this.initEqLogicVisibility(data[eqLogicIndex].id);
          this.eqLogics.push(data[eqLogicIndex]);
          if (!eqLogicsOrder.hasOwnProperty(data[eqLogicIndex].id)) {
            eqLogicsOrder[data[eqLogicIndex].id] = 99999;
          }
        }
        this.$store.commit("saveEqLogicsOrder", eqLogicsOrder);
        // Sort depend of previous order stored in local sotrage
        this.eqLogics.sort((a, b) => {
          if (eqLogicsOrder[a.id] < eqLogicsOrder[b.id]) {
            return -1;
          } else if (eqLogicsOrder[a.id] > eqLogicsOrder[b.id]) {
            return 1;
          }
          return 0;
        });
      });
    },
    /**
     * @vuese
     * Save order data in local storage
     */
    saveOrderData() {
      let newOrder = {};
      for (
        let eqLogicIndex = 0;
        eqLogicIndex < this.eqLogics.length;
        ++eqLogicIndex
      ) {
        newOrder[this.eqLogics[eqLogicIndex].id] = eqLogicIndex;
      }
      this.$store.commit("updateEqLogicsOrder", newOrder);
    },
    /**
     * @vuese
     * Change the visibility of the room in the summary
     */
    changeRoomVisibility() {
      localStorage.setItem(
        "is-visible-room-" + this.room.id,
        this.form.isVisible ? "true" : "false"
      );
    },
    /**
     * @vuese
     * Init eqLogic visibility in local storage and data
     * @arg eqLogicId Id of the eqLogic to init
     */
    initEqLogicVisibility(eqLogicId) {
      const localStorageKey = "is-visible-eqLogic-" + eqLogicId;
      let isVisibleStoredValue = localStorage.getItem(localStorageKey);
      if (isVisibleStoredValue !== null) {
        this.eqLogicsVisibility[eqLogicId] =
          isVisibleStoredValue === "true" ? "visibility" : "visibility_off";
      } else {
        this.eqLogicsVisibility[eqLogicId] = "visibility";
        localStorage.setItem(localStorageKey, "true");
      }
    },
    /**
     * @vuese
     * Method called on visibility update click
     * @arg eqLogicId Id of the eqLogic with a visibility to change
     */
    changeEqLogicVisibility(eqLogicId) {
      let temp = this.eqLogicsVisibility;

      if (temp[eqLogicId] === "visibility") {
        localStorage.setItem("is-visible-eqLogic-" + eqLogicId, "false");
        temp[eqLogicId] = "visibility_off";
      } else {
        localStorage.setItem("is-visible-eqLogic-" + eqLogicId, "true");
        temp[eqLogicId] = "visibility";
      }
      // Hack for DOM update with data change
      this.eqLogicsVisibility = Object.assign({}, temp);
    },
    /**
     * @vuese
     * Show commands dialog
     * @arg eqLogicId
     */
    showCommandsDialog: function(eqLogicId) {
      Communication.get("/api/cmd/eqlogic/" + eqLogicId, data => {
        this.cmdsToShowForm.checkbox = [];
        for (let cmdIndex in data) {
          const cmd = data[cmdIndex];
          let isVisibleStoredValue = localStorage.getItem(
            "is-visible-cmd-" + cmd.id
          );
          if (
            isVisibleStoredValue === null ||
            (isVisibleStoredValue !== null && isVisibleStoredValue === "true")
          ) {
            this.cmdsToShowForm.checkbox.push(cmd.id);
          }
        }
        this.cmdsToShow = data;
        this.cmdDialogShowed = true;
      });
    },
    /**
     * @vuese
     * Hide commands dialog
     */
    closeCommandsDialog: function() {
      this.cmdDialogShowed = false;
    },
    /**
     * Update showed commands
     */
    updateCommand: function() {
      for (let cmdIndex in this.cmdsToShow) {
        const cmd = this.cmdsToShow[cmdIndex];
        localStorage.setItem("is-visible-cmd-" + cmd.id, "false");
      }
      for (let cmdIndex in this.cmdsToShowForm.checkbox) {
        const cmd = this.cmdsToShowForm.checkbox[cmdIndex];
        localStorage.setItem("is-visible-cmd-" + cmd, "true");
      }
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/theme-color.scss";

.button-wrapper::after {
  content: "";
  clear: both;
  display: block;
}

.room-config,
.room-button {
  padding-right: 0.2rem;
  padding-left: 0.2rem;
  margin-top: 0.5rem;
}

.room-widget {
  height: 155px !important;
}

.mu-grid-tile-wrapper {
  padding: 0.3rem !important;
}

.draggable-list {
  > div {
    width: 100%;
    display: block;
    height: 2rem;
    background-color: white;
  }
  > div:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
  > div span {
    float: left;
    line-height: 2rem;
  }
  > div .mu-item-action {
    float: right;
  }
  > div .mu-item-action .mu-icon {
    margin-left: auto;
    margin-right: auto;
  }
  > div .draggable-handle {
    float: right;
    line-height: 2rem;
  }
}

.mu-checkbox {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
