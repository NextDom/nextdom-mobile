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
  <div class="action-linked-cmd cmd">
    <mu-button v-if="showButton" v-on:click="action">{{ cmd.name }}</mu-button>
  </div>
</template>

<script>
/**
 * Link a command to another state command (usually a DefaultIconCmd).
 * In the case of the command doesn't have a link, show a simple button for run command.
 * @group Commands
 */
export default {
  name: "ActionLinkedCmd",
  data: function() {
    return {
      showButton: false
    };
  },
  props: {
    // Command object
    cmd: null
  },
  mounted() {
    // Test if target value cmd is defined
    // If cmd.value is different of 0, the button the action is linked
    // to another command
    if (this.cmd.value !== 0) {
      this.$store.commit("addAction", {
        genericType: this.cmd.genericType,
        cmdId: this.cmd.id,
        cmdValue: this.cmd.value
      });
    } else {
      // If no link, show button
      this.showButton = true;
      this.$store.commit("addAction", {
        genericType: this.cmd.genericType,
        cmdId: this.cmd.id,
        cmdValue: this.cmd.value
      });
    }
  },
  methods: {
    /**
     * @vuese
     * Send action event to widget
     */
    action: function() {
      // Send event to Widget component that execute command on NextDom
      // @arg Id of the command to execute
      this.$emit("executeCmd", this.cmd.id);
    }
  }
};
</script>
