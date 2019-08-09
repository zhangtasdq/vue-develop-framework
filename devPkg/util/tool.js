const EMPTY_VALUE = ["", null, undefined];
function isEmpty(value) {
    return EMPTY_VALUE.indexOf(value) !== -1;
}

const toString = Object.prototype.toString;
function isString(value) {
    return typeof value ==="string";
}

function isArray(value) {
    return toString.call(value) === "[object Array]";
}

let id = 1;
function generateSimpleId() {
    return "_front_id_" + id++;
}

function addUrlParam(url, param) {
    let paramStr = "";

    for (let key in param) {
        if (param.hasOwnProperty(key)) {
            paramStr += `${key}=${param[key]}&`;
        }
    }
    paramStr = paramStr.substring(0, paramStr.length - 1);

    if (url.indexOf("?") > 0) {
        url += `&${paramStr}`;
    } else {
        url += `?${paramStr}`;
    }

    return url;
}

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}

export {
    isEmpty,
    isString,
    isArray,
    generateSimpleId,
    addUrlParam,
    cloneData
};