import MsgMixin from "./MsgMixin";

export default {
    mixins: [MsgMixin],

    methods: {
        handleRequestError(errorResponse){
            let error = (errorResponse && errorResponse.error) ? errorResponse.error : errorResponse;

            console.log(error);
            if (this.isLoginExpired(error)) {
                this.handleLoginExpired();
                return;
            }

            if (this.isTimeoutRequestError(error)) {
                this.showRequestErrorMsg("请求超时, 请刷新页面重试");
                return;
            }

            if (error && error.meta && error.meta.message) {
                this.showRequestErrorMsg(error.meta.message);
            } else {
                this.showRequestErrorMsg();
            }
        },

        showRequestErrorMsg(msg = "请求失败，请稍候重试") {
            this.showErrorMsg(msg);
        },

        isTimeoutRequestError(error) {
        },

        isLoginExpired(error) {
        },

        handleLoginExpired() {
        }
    }
}