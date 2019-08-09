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
    },

    _installPrototypeLoading(Vue) {
    }
};

export default VueExtend;