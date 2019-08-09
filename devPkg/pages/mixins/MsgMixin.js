import { MSG_DELAY_TIME } from "../../config/const.config";

/**
 * 页面中的消息模块
 * @module MsgMixin
 */
export default {
    methods: {
        /**
         * 显示提示信息
         * @public
         * @param {string} msg
         */
        showNoticeMsg(msg) {
        },

        /**
         * 显示警告信息
         * @public
         * @param {string} msg
         */
        showWarningMsg(msg) {
        },

        /**
         * 显示错误信息
         * @public
         * @param {string} msg
         */
        showErrorMsg(msg = "系统出错") {
        },

        /**
         * 显示警告的确认取消框
         * @public
         * @param {string} msg
         * @param {function} confirmCallback
         * @param {function} cancelCallback
         * @param {string} title
         * @param {object} options
         */
        showWarningConfirmDialog(msg, confirmCallback, cancelCallback, title, options) {
            return this.showConfirmDialog(msg, confirmCallback, cancelCallback, title, "warning", options);
        },

        /**
         * 显示危险的确认取消框
         * @public
         * @param {string} msg
         * @param {function} confirmCallback
         * @param {function} cancelCallback
         * @param {string} title
         * @param {object} options
         */
        showDangerConfirmDialog(msg, confirmCallback, cancelCallback, title, options) {
            return this.showConfirmDialog(msg, confirmCallback, cancelCallback, title, "error", options);
        },

        /**
         * 显示确认取消框
         * @public
         * @param {string} msg
         * @param {function} confirmCallback
         * @param {function} cancelCallback
         * @param {string} title
         * @param {object} options
         */
        showConfirmDialog(msg, confirmCallback = null, cancelCallback = null, title="提示", type = "info", options) {
        },

        /**
         * 显示确认框
         * @public
         * @param {string} msg
         * @param {function} confirmCallback
         * @param {string} title
         */
        showAlert(msg, confirmCallback, title = "提示") {
        }
    }
}
