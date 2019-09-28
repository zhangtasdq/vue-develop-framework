import Worker from "./Table.worker";

const MsgService = {
    _isInit: false,
    _worker: null,
    _callback: null,
    _uid: 0,

    _initWorker() {
        this._worker = new Worker();
        this._worker.addEventListener("message", (event) => this._handleWorkerMsg(event));
        this._callback = {};
        this._isInit = true;
    },

    _handleWorkerMsg(event) {
        let data = event.data,
            uid = data.uid,
            result = data.data;

        if (this._callback[uid]) {
            this._callback[uid](result);
            delete this._callback[uid];
        }
    },

    _getCallbackUid(data) {
        return `${data.target}-${data.action}-${this._uid++}`;
    },

    dispatchAction(action, callback) {
        let uid = this._getCallbackUid(action),
            msg = { uid, data: action.data, action: action.action };

        if (!this._isInit) {
            this._initWorker();
        }
        this._callback[uid] = callback;
        this._worker.postMessage(msg);
    }
};

export default MsgService;