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

const Tree = {
    _forEachTreeItem(data, childKey = "children", callback, parent) {
        callback(data, parent);

        let child = data[childKey];

        if (child && child.length > 0) {
            for (let i = 0, j = child.length; i < j; ++i) {
                this._forEachTreeItem(child[i], childKey, callback, data);
            }
        }
    },

    forEachTree(data, callback, childKey = "children") {
        this._forEachTreeItem(data, childKey, callback);
        return data;
    },

    forEachArrayTree(datas, callback, childKey = "children") {
        for (let i = 0, j = datas.length; i < j; ++i) {
            this.forEachTree(datas[i], callback, childKey);
        }
    }
};

export {
    isEmpty,
    isString,
    isArray,
    generateSimpleId,
    addUrlParam,
    cloneData,
    Tree
};