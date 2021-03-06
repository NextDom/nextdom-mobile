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
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import MuseUI from "muse-ui";
import VuePackeryPlugin from "vue-packery-plugin";
import "material-icons";
import "./assets/theme-color";
import "./assets/theme.css";

require("../node_modules/@fortawesome/fontawesome-free/css/all.css");
require("../node_modules/font-awesome/css/font-awesome.css");
require("./assets/icon/animal/style.css");
require("./assets/icon/divers/style.css");
require("./assets/icon/fashion/style.css");
require("./assets/icon/loisir/style.css");
require("./assets/icon/maison/style.css");
require("./assets/icon/meteo/style.css");
require("./assets/icon/nature/style.css");
require("./assets/icon/nextdom/style.css");
require("./assets/icon/nextdom2/style.css");
require("./assets/icon/nextdomapp/style.css");
require("./assets/icon/nourriture/style.css");
require("./assets/icon/personne/style.css");
require("./assets/icon/securite/style.css");
require("./assets/icon/techno/style.css");
require("./assets/icon/transport/style.css");

import Communication from "./libs/Communication.js";
import { store } from "./libs/Store.js";
import { i18n } from "./libs/i18n";
import EventsManager from "./libs/EventsManager.js";

Vue.config.productionTip = false;

/**
 * Route to login if not connected
 */
router.beforeEach((to, from, next) => {
  if (Communication.isConnected()) {
    next();
  } else if (to.name === "login") {
    next();
  } else {
    next("/login");
  }
});

// Init Communication helper for ajax calls
Communication.init(router);
// Init events manager (ask for new events)
EventsManager.init(Communication, store);
// Init MuseUI framekwork
Vue.use(MuseUI);
// Init packery for home view
Vue.use(VuePackeryPlugin);

new Vue({
  router,
  store,
  MuseUI,
  i18n,
  beforeCreate() {
    this.$store.commit("initialize");
  },
  render: h => h(App)
}).$mount("#app");
