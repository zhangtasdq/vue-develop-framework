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

const ExpressionHelper = {
    _reg: /#\{\s*(\w+)\s*\}/g,
    _expressionCache: {},

    /**
     * 获取表达式的值
     * @public
     * @param {string} expression
     * @param {object} data
     */
    getExpressionValue (expression, data) {
        let fn = null;

        if (this._expressionCache[expression]) {
            fn = this._expressionCache[expression];
        } else {
            fn = this._expressionCache[expression] = this._compileExpression(expression);
        }

        return fn(data);
    },

    /**
     * 判断字符串中是否包含表达式
     * @private
     * @param str
     */
    _isContainVariable (str) {
        return this._reg.test(str);
    },

    /**
     * 编译表达式
     * @private
     * @param {string} expression
     */
    _compileExpression (expression) {
        let fnBody = "";

        if (this._isContainVariable(expression)) {
            fnBody = expression.replace(this._reg, "obj.$1");
        } else {
            fnBody = expression;
        }
        return new Function("obj", `return ${fnBody}`);
    }
};

/**
 * 节流函数
 * @param {function} action
 * @param {number} delay
 */
const debounce = function(action, delay) {
    let job = null;

    return function (...args) {
        if (job) {
            clearTimeout(job);
        }
        job = setTimeout(() => action.apply(null, args), delay);
    }
};

const isFunction = function (data) {
    return typeof data === "function";
};

/**
 * 排序数据
 * @param {object[]} data
 * @param {string} key
 */
const sortObj = function(data, key) {
    return data.sort((a, b) => {
        let aValue = a[key],
            bValue = b[key];

        if (isString(aValue) && isString(bValue)) {
            return aValue.localeCompare(bValue);
        }
        return aValue > bValue;
    });
};

export {
    isEmpty,
    isString,
    isArray,
    generateSimpleId,
    addUrlParam,
    cloneData,
    Tree,
    debounce,
    ExpressionHelper,
    isFunction,
    sortObj
};