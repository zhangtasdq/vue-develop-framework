import { sendRequest } from "../util/request";

const URL = {
    ARCHIVE_LIST: "/manage/cf/archives/userbasics"
};

/**
 * 用户档案
 * @module UserArchive
 */
const UserArchive = {
    /**
     * 获取用户档案列表
     * @param {object} params
     * @param {function} success
     * @param {function} error
     */
    getArchiveList(params, success, error) {
        sendRequest({
            url: URL.ARCHIVE_LIST,
            params
        }, ({ data }) => {
            success(data);
        }, error);
    }
};

export default UserArchive;