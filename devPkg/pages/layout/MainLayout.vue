<template>
    <div :class="mainLayoutModifier">
        <div class="main-layout__logo-wrapper">
            <img src="../../images/nav-logo.png" class="main-layout__logo" />
        </div>
        <div class="main-layout__header-aside">
            <el-tooltip class="sc-tooltip" content="帮助">
                <i class="iconfont icontishi"></i>
            </el-tooltip>
        </div>

        <div class="main-layout__aside">
            <div class="main-layout__main-menu-wrapper">
                <el-menu class="main-layout__main-menu" :default-active="currentActiveMenu" @select="handleSelectViewMenu">
                    <template v-for="item in mainMenu">
                        <el-submenu v-if="item.children" :key="item.id" :id="item.id" :index="item.id">
                            <template slot="title">
                                <i :class="item.icon"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item v-for="child in item.children" :key="child.id" :index="child.id">
                                <div slot="title">
                                    <span>{{child.name}}</span>
                                </div>
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item v-else :key="item.id" :index="item.id">
                            <div slot="title">
                                <i :class="item.icon"></i>
                                <span>{{item.name}}</span>
                            </div>
                        </el-menu-item>
                    </template>
                </el-menu>
            </div>
        </div>

        <el-tabs class="main-layout__tabs"
                 closable
                 v-model="currentActiveTabView"
                 @tab-remove="handleClickCloseTabView">
            <el-tab-pane v-for="item in tabViews"
                         :key="item.id"
                         :name="item.id"
                         :lazy="true">
                <span class="main-layout__tabs-title" :title="item.title" slot="label">{{item.title}}</span>
                <tab-view ref="tabView" :view-data="item.data"></tab-view>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { MAX_TAB_VIEW_COUNT } from "../../config/const.config";
import TabView from "../../components/base/TabView.vue";
import BaseView from "../BaseView";
import MenuService from "../../services/MenuService";

export default {
    extends: BaseView,

    components: {
        "tab-view": TabView,
    },

    data() {
        return {
            mainMenu: [],
            subMenu: [],
            tabViews: [],
            currentActiveTabView: "",
            currentActiveMenu: ""
        };
    },

    computed: {
        mainLayoutModifier() {
            return ["main-layout", "main-layout--light"];
        }
    },

    watch: {
        currentActiveTabView() {
            this.currentActiveMenu = this.currentActiveTabView;
        }
    },

    mounted() {
        this.loadInitData();
    },

    methods: {
        loadInitData() {
            MenuService.loadMenu().then((data) => {
                this.mainMenu = data;
            }).catch((error) => this.handleRequestError(error));
        },

        /**
         * 处理切换子菜单
         * @param key
         */
        handleSelectViewMenu(key) {
            this.showTabView(key);
        },

        /**
         * 处理点击关闭 tab
         * @param {string} name
         */
        handleClickCloseTabView(name) {
            this.closeTabView(name);
        },

        /**
         * 关闭 tabView
         * @param {string} id
         */
        closeTabView(id) {
            let tab = this.findTabViewById(id),
                index = this.tabViews.indexOf(tab),
                total = this.tabViews.length;

            this.tabViews = this.tabViews.filter((item) => item.id !== id);

            if (id === this.currentActiveTabView) {
                if (this.tabViews.length > 0) {
                    let tab = null;
                    if (index === total -1) {
                        // 如果删除的是最后一个 tabView, 则将当前活动的 tabView　设置为最后一个
                        tab = this.tabViews[this.tabViews.length - 1];
                    } else if (index === 0) {
                        tab = this.tabViews[0];
                        // 如果删除的是第一个 tabView, 则将当前活动的 tabView　设置为第一个
                    } else {
                        tab = this.tabViews[index];
                    }
                    this.showTabView(tab.id);
                } else {

                }
            };
        },

        /**
         * 添加 tabView
         * @param {string} id
         * @param {object} [viewParam]
         */
        showTabView(id, viewParam) {
            if (this.isExistTabView(id) || this.isAllowOpenNewTabView()) {
                this.openTabView(id, viewParam);
            } else {
                this.showWarningMsg(`最多只能打开 ${MAX_TAB_VIEW_COUNT} 个标签页, 请先关闭部分标签页`);
            }
        },

        /**
         * 根据菜单项设置对应的菜单和 tab 页面为活动
         * @param {object} menu
         */
        refreshViewActiveItemByMenu(menu) {
            this.currentActiveMenu = menu.id;
            this.currentActiveTabView = menu.id;
        },

        /**
         * 切换到子页面，如果子页面不存在则创建
         * @param {object} menu
         * @param {object} viewParam
         */
        toggleTabView(menu, viewParam) {
            if (this.isExistTabView(menu.id)) {
                this.refreshViewActiveItemByMenu(menu);
            } else {
                let view = this.buildTabViewDataByMenu(menu, viewParam);

                this.tabViews.push(view);
                this.$nextTick(() => this.refreshViewActiveItemByMenu(menu));
            }
        },

        buildTabViewDataByMenu(menu, viewData) {
            return {
                id: menu.id,
                title: menu.name,
                data: {
                    ...menu.data,
                    viewData
                }
            };
        },

        /**
         * 调用 tabView 的生命周期方法
         * @private
         * @todo 以后有需要再添加
         * @param {object} menu
         * @param {string} hooks
         */
        callTabViewHooks(menu, hooks) {
        },

        /**
         * 根据视图的 id 打开视图
         * @param {string} id
         * @param {object} viewParam
         */
        openTabView(id, viewParam) {
            let menu = MenuService.findMenuById(id);

            this.toggleTabView(menu, viewParam);
        },

        /**
         * 判断当前是否已经存在对应的 tabView
         * @param {string} id
         */
        isExistTabView(id) {
            return this.tabViews.some((item) => item.id === id);
        },

        /**
         * 根据 id 查找 tabView
         * @param {string} id
         */
        findTabViewById(id) {
            for (let i = 0, j = this.tabViews.length; i < j; ++i) {
                if (this.tabViews[i].id === id) {
                    return this.tabViews[i];
                }
            }
            return null;
        },

        /**
         * 判断是否允许继续显示 tabView
         */
        isAllowOpenNewTabView() {
            return this.tabViews.length < MAX_TAB_VIEW_COUNT;
        }
    }
};
</script>

