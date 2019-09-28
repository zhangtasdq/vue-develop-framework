"use strict";
import Vue from "vue";

import VueExtend from "./vue-extend";
import router from "./router";
import Index from "./pages/Index.vue";
import "./styles/main.less";
import TabView from "./tab-views";

Vue.use(VueExtend);
Vue.use(TabView);

new Vue({
    el: "#mainContent",
    router,
    render(createElement) {
        let route = this.$route,
            meta = route.meta,
            props = {};

        if (route.path === "/") {
            return createElement("div");
        }

        if (meta.layout) {
            props.layout = meta.layout;
        }
        return createElement(Index, { props });
    }
});