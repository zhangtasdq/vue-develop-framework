import {
    TabPane,
    Tabs,
    Menu,
    MenuItem,
    Submenu,
    Tooltip,
    Form,
    FormItem,
    Input,
    Button,
    Card,
    Table,
    TableColumn,
    Pagination,
    Dialog
} from "element-ui";

import GlobalDirective from "./directives/global-directive";

const VueExtend = {
    install(Vue) {
        this._installDirective(Vue);
        this._installComponent(Vue);
        this._installPrototype(Vue);
    },

    _installDirective(Vue) {
        Vue.use(GlobalDirective);
    },

    _installPrototype(Vue) {
        this._installPrototypeLoading(Vue);
    },

    _installComponent(Vue) {
        [TabPane, Tabs, Menu, MenuItem, Submenu, Tooltip, Form, FormItem, Input, Button,
            Card, Table, TableColumn, Pagination, Dialog].forEach((item) => {
            Vue.component(item.name, item);
        });
    },

    _installPrototypeLoading(Vue) {
    }
};

export default VueExtend;