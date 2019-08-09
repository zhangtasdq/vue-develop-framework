/**
 * 通过权限判断是否可见
 * @param {HTMLElement} el
 * @param {any} data
 */
function canI(el, data) {
    let result = true;

    if (result) {
        el.style.display = "";
    } else {
        el.style.display = "none";
    }
}

const Can = {
    name: "can-i",

    bind(el, binding) {
        canI(el, binding.value);
    },

    update(el, binding) {
        canI(el, binding.value);
    }
};

export default Can;