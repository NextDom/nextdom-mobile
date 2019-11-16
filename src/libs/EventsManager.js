/* This file is part of NextDom Software.
 *
 * NextDom is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * NextDom Software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with NextDom Software. If not, see <http://www.gnu.org/licenses/>.
 *
 * @Support <https://www.nextdom.org>
 * @Email   <admin@nextdom.org>
 * @Authors/Contributors: Sylvaner, Byackee, cyrilphoenix71, ColonelMoutarde, edgd1er, slobberbone, Astral0, DanoneKiD
 */
export default {
  loopStarted: false,
  /**
   * Initialize event manger
   * @param {Communication} Communication Communication helper
   * @param {store} store Store for data management
   */
  init(Communication, store) {
    this.store = store;
    this.Communication = Communication;
  },
  /**
   * Call getNewEvents in background
   */
  loop() {
    if (!this.store.getters.isEventsManagerStarted()) {
      this.store.commit("setEventsManagerState", true);
      let self = this;
      setTimeout(function() {
        self.getNewEvents();
      }, 1);
    }
  },
  /**
   * Get new events since last call
   */
  getNewEvents() {
    const currentDate = new Date();
    const timestamp = parseInt(currentDate.getTime() / 1000);
    this.Communication.get(
      "/api/changes/get/" + timestamp,
      this.dispatchEvents.bind(this)
    );
  },
  /**
   * Dispatch all events for update
   * @param {Array} events Event received
   */
  dispatchEvents(events) {
    events.result.forEach(event => {
      // Commands state
      if (event.name === "cmd::update") {
        this.store.commit("updateCmd", {
          cmdId: parseInt(event.option.cmd_id),
          newState: event.option.value
        });
      } else if (event.name === "scenario::update") {
        this.store.commit("updateScenario", {
          scenarioId: parseInt(event.option.scenario_id),
          newState: event.option.state
        });
      }
    });
    this.loop();
  }
};
