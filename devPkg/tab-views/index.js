/* 百度 */
import Baidu from "./baidu";

const AppTabView = {
    install(Vue) {
        [Baidu].forEach((Views) => {
            Views.forEach((item) => Vue.component(item.name, item.component));
        });
    }
};

export default AppTabView;
