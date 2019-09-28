import Menu from "../config/menu.config";
import { Tree } from "../util/tool";

const MenuService = {
    _menu: null,
    _menuMap: null,

    _getMenuIdMap() {
        let result = {};

        if (this._menuMap === null) {
            Tree.forEachArrayTree(this._menu, (item) => {
                result[item.id] = {
                    id: item.id,
                    name: item.name,
                    icon: item.icon,
                    data: item.data
                };
            });
            this._menuMap = result;
        }

        return this._menuMap;
    },

    loadMenu() {
        return new Promise((resolve) => {
            this._menu = Menu;
            resolve(Menu);
        });
    },

    findMenuById(id) {
        let map = this._getMenuIdMap();

        return map[id];
    }
};

export default MenuService;