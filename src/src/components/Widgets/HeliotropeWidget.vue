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
  <div v-packery-item class="heliotrope packery-item small">
    <div class="widget-title">
      <span class="title">{{ eqLogic.name }}</span>
    </div>
    <div>
      <DefaultIconIncoCmd
        v-bind:cmd="azimut"
        v-bind:showTitle="false"
        v-bind:icon="'fas fa-adjust'"
      ></DefaultIconIncoCmd>
      <DefaultIconIncoCmd
        v-bind:cmd="altitude"
        v-bind:showTitle="false"
        v-bind:icon="'fas fa-compass'"
      ></DefaultIconIncoCmd>
    </div>
    <div>
      <DefaultIconIncoCmd
        v-bind:cmd="sunrise"
        v-bind:showTitle="false"
        v-bind:icon="'fas fa-sun-o'"
      ></DefaultIconIncoCmd>
      <DefaultIconIncoCmd
        v-bind:cmd="sunset"
        v-bind:showTitle="false"
        v-bind:icon="'fas fa-moon-o'"
      ></DefaultIconIncoCmd>
    </div>
  </div>
</template>

<script>
import BaseWidget from "./BaseWidget";

/**
 * Show eqLogic widget
 * @group Components
 */
export default {
  name: "HeliotropeWidget",
  extends: BaseWidget,
  data: function() {
    return {
      azimut: null,
      altitude: null,
      sunrise: null,
      sunset: null
    };
  },
  created() {
    // Find data in cmds
    for (let cmdIndex = 0; cmdIndex < this.dataCmds.length; ++cmdIndex) {
      const logicalId = this.dataCmds[cmdIndex].logicalId;
      let showed = true;
      switch (logicalId) {
        case "azimuth360":
          this.azimut = this.dataCmds[cmdIndex];
          break;
        case "altitude":
          this.altitude = this.dataCmds[cmdIndex];
          break;
        case "sunrise":
          this.sunrise = this.dataCmds[cmdIndex];
          break;
        case "sunset":
          this.sunset = this.dataCmds[cmdIndex];
          break;
        default:
          console.log(logicalId);
          showed = false;
      }
      // Initialize update on change
      if (showed) {
        this.$store.commit("addShowedCmd", { cmd: this.dataCmds[cmdIndex] });
      }
    }
  }
};
</script>
<style lang="scss">
.heliotrope .cmd.icon {
  float: left;
  width: 40%;
  margin-left: 5%;
  margin-right: 5%;
}

.heliotrope > div {
  clear: both;
}

.heliotrope .info-cmd div {
  display: inline-block;
}

.heliotrope i {
  float: left;
  font-size: 2rem;
  margin: 0.2rem;
}

.heliotrope .info-cmd div {
  font-size: 1.2rem;
  line-height: 2.4rem;
  padding-left: 0.5rem;
}
</style>