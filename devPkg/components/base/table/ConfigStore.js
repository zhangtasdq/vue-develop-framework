class ConfigStore {
    _cacheKey = "sb_table_config";

    /**
     * 加载列配置
     * @param {string} tableName
     */
    loadColumnConfig(tableName) {
        return new Promise((resolve, reject) => {
            let data = this._loadLocalConfig(tableName);

            resolve(data);
        });
    }

    /**
     * 保存列配置
     * @public
     * @param {object} data
     * @param {string} tableName
     */
    saveColumnConfig(data, tableName) {
        return new Promise((resolve, reject) => {
            this._saveLocalConfig(data, tableName);

            resolve();
        });
    }

    /**
     * 清除列配置
     */
    clearColumnConfig() {
        return new Promise((resolve, reject) => {
            this._clearLocalConfig();
            resolve({ error: null });
        });
    }

    /**
     * 从本地列配置
     * @private
     * @param {string} tableName
     */
    _loadLocalConfig(tableName) {
        let config = localStorage.getItem(this._cacheKey);

        if (config) {
            let data = JSON.parse(config);

            if (data[tableName]) {
                return data[tableName];
            }
        }
        return [];
    }

    /**
     * 将列配置保存到本地
     * @param {object} data
     * @param {string} tableName
     */
    _saveLocalConfig(data, tableName) {
        let config = localStorage.getItem(this._cacheKey),
            configData = {};

        if (config) {
            configData = JSON.parse(config);
        }
        configData[tableName] = data;
        let str = JSON.stringify(configData);

        localStorage.setItem(this._cacheKey, str);
    }

    /**
     * 清除本地配置
     * @private
     */
    _clearLocalConfig() {
        localStorage.removeItem(this._cacheKey);
    }
}

let store = new ConfigStore();

export default store;