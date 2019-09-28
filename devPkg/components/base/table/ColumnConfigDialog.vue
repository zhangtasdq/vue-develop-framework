<template>
    <sb-dialog class="sb-table__column-config-dialog"
               title="列配置"
               :visible="showDialog"
               :append-to-body="true"
               :before-close="handleBeforeClose"
               @open="onDialogOpen">
        <el-table ref="table" :data="data" :row-key="columnKeyProperty">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column type="selection" label=""></el-table-column>
            <el-table-column label="列名" prop="label"></el-table-column>
        </el-table>
        <div slot="footer">
            <el-button class="sb-button" type="primary" @click="handleClickSave">保存</el-button>
            <el-button class="sb-button" @click="handleClickCancel">取消</el-button>
        </div>
    </sb-dialog>
</template>

<script>
import Dialog from "../Dialog";

export default {
    name: "sb-column-config-dialog",

    components: {
        "sb-dialog": Dialog
    },

    props: {
        isVisible: {
            type: Boolean,
            default: false
        },

        columns: {
            type: Array,
            required: true
        },

        configData: {
            type: Array,
            default: () => []
        }
    },

    data() {
        return {
            columnKeyProperty: "label",
            showDialog: false,
            data: []
        };
    },

    watch: {
        isVisible() {
            this.showDialog = this.isVisible;
        }
    },

    mounted() {
        this.setInitData();
    },

    methods: {
        onDialogOpen() {
            this.refreshConfigData();
        },

        setInitData() {
            this.showDialog = this.isVisible;
        },

        /**
         * 获取数据的惟一键
         * @param {object} column
         */
        getColumnUniqueKey(column) {
            return column[this.columnKeyProperty];
        },

        /**
         * 根据列查找对应的配置项
         * @private
         * @param {object} column
         */
        findConfigByColumn(column) {
            let key = this.getColumnUniqueKey(column);

            for (let i = 0, j = this.configData.length; i < j; ++i) {
                if (this.getColumnUniqueKey(this.configData[i]) === key) {
                    return this.configData[i];
                }
            }

            return null;
        },

        /**
         * 根据列和配置生成配置数据
         * 1. 如果列不存在于列配置中, 则按默认情况处理
         * 2. 如果列存在于列配置中, 则根据列配置显示
         * @private
         */
        refreshConfigData() {
            let data = [],
                showColumn = [];

            this.columns.forEach((item) => {
                let config = this.findConfigByColumn(item),
                    tableData = { label: item.label, field: item.field, isDisableHide: item.isDisableHide };

                if (config) {
                    tableData.isVisible = config.isVisible;
                } else {
                    tableData.isVisible = true;
                }
                data.push(tableData);
            });
            showColumn = data.filter((item) => item.isVisible);
            this.data = data;
            this.$nextTick(() => {
                let table = this.$refs.table;
                showColumn.forEach((row) => table.toggleRowSelection(row, true));
            });
        },

        handleBeforeClose() {
            this.$emit("cancel");
        },

        handleClickCancel() {
            this.$emit("cancel");
        },

        handleClickSave() {
            let data = this.getConfigData();

            this.$emit("save", data);
        },

        getConfigData() {
            let showColumn = this.getSelectedData(),
                keys = showColumn.map((item) => this.getColumnUniqueKey(item)),
                columns = this.columns;

            return columns.map((item) => {
                return {
                    field: item.field,
                    label: item.label,
                    isVisible: keys.indexOf(this.getColumnUniqueKey(item)) !== -1
                };
            });
        },

        getSelectedData() {
            return this.$refs.table.selection;
        }
    }
}
</script>
