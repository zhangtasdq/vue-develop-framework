import axios from "axios";

import { REQUEST_TIMEOUT, URL_PREFIX } from "../config/const.config";
import { addUrlParam } from "./tool";


/* 当前正在请求的个数 */
let loadingCount = 0;

const URL_PARAM_REG = /{(\w+)}/g;

/**
 * 获取请求地址
 * @param {string} url - 请求地址
 * @param {object} params - 需要替换地址中的数据对象
 * @returns {string} - 返回完整请求地址
 */
const getUrl = (url, params) => {
    let formatUrl = url,
        prefix = URL_PREFIX;

    if (params) {
        formatUrl = url.replace(URL_PARAM_REG, (match, key) => params[key]);

        if (params.urlPrefix) {
            prefix = params.urlPrefix;
        }
    }

    return prefix + formatUrl;
};

/**
 * 构建请求参数
 * @param {object} data - 请求参数对象
 * @returns {object} - 返回请求对象
 */
const buildRequestData = (data) => {
    let result = {};

    result.method = data.method ? data.method : "GET";
    result.params = data.params;
    result.data = data.data;

    result.headers = {
        "Content-Type": data.contentType ? data.contentType : "application/json;charset=UTF-8",
        ...data.headerData
    };

    if (result.method === "POST") {
        result.transformRequest = (requestData) => {
            if (data.contentType && data.contentType.indexOf("application/x-www-form-urlencoded") !== -1) {
                let str = "";
                for (let key in requestData) {
                    if (requestData.hasOwnProperty(key)) {
                        str += `${key}=${requestData[key]}&`;
                    }
                }
                return encodeURI(str.slice(0, str.length - 1));
            } else {
                return JSON.stringify(requestData);
            }
        };
    }
    result.timeout = REQUEST_TIMEOUT;

    return result;
};

/**
 * 判断是否请求成功
 * @param {object} responseData - 请求返回数据
 * @returns {boolean} - true 请求成功, false 请求失败
 */
const isRequestSuccess = (responseData) => {
    if (responseData.data) {
        if (responseData.data.meta) {
            return responseData.data.meta.code === 1;
        }
        return responseData.data.indexOf("登录") === -1;
    }
    return true;
};

/**
 * 显示正在加载的动画
 */
const showLoading = () => {
};

/**
 * 隐藏正在加载的动画
 */
const hideLoading = () => {
};

/**
 * Ajax 请求方法
 * @param {object} request - 请求参数
 * @param {function} successCallback - 成功返回回调函数
 * @param {function} errorCallback - 失败返回回调函数
 */
const sendAjaxRequest = (request, successCallback, errorCallback) => {
    let requestData = buildRequestData(request);

    requestData.url = getUrl(request.url, request.urlParams);

    if (loadingCount === 0) {
        showLoading();
    }
    loadingCount++;

    axios(requestData).then((response) => {
        if (isRequestSuccess(response)) {
            successCallback(response.data);
        } else if (errorCallback) {
            errorCallback(response.data);
        }

        loadingCount--;
        if (loadingCount <= 0) {
            loadingCount = 0;
            hideLoading();
        }
    }).catch((error) => {
        if (errorCallback) {
            errorCallback(error);
        }
        loadingCount--;
        if (loadingCount <= 0) {
            loadingCount = 0;
            hideLoading();
        }
    });
};

/**
 * 请求下载文件
 * @param {object} request - 请求参数
 */
const sendDownloadRequest = (request) => {
    let url = getUrl(request.url, request.urlParams);

    if (request.params) {
        url = addUrlParam(url, request.params);
    }
    window.location.href = url;
};

/**
 * 请求后端方法
 * @param {object} request - 请求参数
 * @param {function} successCallback - 成功返回回调函数
 * @param {function} errorCallback - 失败返回回调函数
 */
const sendRequest = (request, successCallback, errorCallback) => {
    if (request.action === "export" || request.action === "download") {
        return sendDownloadRequest(request);
    }
    return sendAjaxRequest(request, successCallback, errorCallback);
};

export {
    sendRequest
};
