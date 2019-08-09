import Vue from "vue";
import Router from "vue-router";

import UserService from "@/services/UserService";

import home from "./home";

/* 注入路由 */
Vue.use(Router);

/* 创建路由对象 */
const router = new Router({
    routes: [
        ...home
    ]
});

router.beforeEach((to, from, next) => {
    if (to.meta.requestLogin) {
        if (UserService.isLogin()) {
            next();
        } else {
            next("/login");
        }
    } else {
        next();
    }
});

export default router;