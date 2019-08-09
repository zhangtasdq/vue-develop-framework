import CanI from "./can-i";

const GlobalDirective = {
    install(Vue) {
        [CanI].forEach((item) => {
            Vue.directive(item.name, item);
        })
    }
};

export default GlobalDirective;