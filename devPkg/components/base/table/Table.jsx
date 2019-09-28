/**
 * 对 element-ui 表格的封装
 * 不包含分页
 */
import ColumnConfigDialog from "./ColumnConfigDialog";
import ConfigStore from "./ConfigStore";
import Cell from "./Cell";
import MsgService from "./MsgService";
import { debounce, sortObj, cloneData } from "@/util/tool"

const RESERVED_COLUMN_TYPE = ["index", "selection", "expand"];
const TABLE_PROPS_PROXY = {
    border: "border",
    stripe: "stripe",
    "row-key": "idProperty",
    "row-class-name": "rowClassNameFn",
    "highlight-current-row": "highlightCurrentRow"
};
const CONFIG_COLUMN_DEFAULT_WIDTH = 50;
const INDEX_COLUMN_DEFAULT_WIDTH = 50;
const CALCULATE_SUMMARY_DELAY_TIME = 100;

export default {
    name: "sb-table",

    components: {
        [ColumnConfigDialog.name]: ColumnConfigDialog,
        [Cell.name]: Cell
    },

    props: {
        uniqueName: {
            type: String,
            default: ""
        },

        idProperty: {
            type: String,
            default: "id"
        },

        columns: {
            type: Array,
            required: true
        },

        data: {
            type: Array,
            default: () => []
        },

        border: {
            type: Boolean,
            default: false
        },

        stripe: {
            type: Boolean,
            default: false
        },

        rowClassNameFn: {
            type: Function
        },

        isFixedHeight: {
            type: Boolean,
            default: false
        },

        isEnableColumnConfig: {
            type: Boolean,
            default: true
        },

        isEnableCacheConfig: {
            type: Boolean,
            default: true
        },

        height: {
            type: Number
        },

        highlightCurrentRow: {
            type: Boolean,
            default: false
        },

        spanMethod: {
            type: Function
        },

        showSummary: {
            type: Boolean,
            default: false
        },

        summaryText: {
            type: String,
            default: "合计"
        },

        summaryMethod: {
            type: Function
        },

        formatSummaryMethod: {
            type: Function
        },

        isAutoCalculateSummary: {
            type: Boolean,
            default: false
        },

        isEnableMergeRow: {
            type: Boolean,
            default: false
        },

        mergeRowKey: {
            type: String
        }
    },

    data() {
        return {
            tableData: [],
            tableHeight: 0,
            isShowColumnConfigDialog: false,
            columnConfig: [],
            isLoadColumnConfig: false,
            currentActiveRow: null,
            currentSelection: [],
            tableTooltipContent: ""
        };
    },

    watch: {
        data() {
            this.setInitData();
        },

        tableData() {
            this.resetTableStateWhenDataChange();
        }
    },

    computed: {
        isEnableSingleSelect() {
            return this.highlightCurrentRow === true;
        }
    },

    created() {
        this.calculateSummaryFn = null;
        this.contentColumns = [];
        this.contentColumnsMap = null;
        this.summaryData = null;
        this.mergeRowKeyMap = null;
        this.mergeRowFields = null;
        this.previousSummaryTd = null;
        this.currentSummaryTd = null;
        this.activateTooltip = debounce(tooltip => tooltip.handleShowPopper(), 50);
    },

    mounted() {
        this.afterMounted();
    },


    methods: {
        /**
         * @private
         */
        afterMounted() {
            this.setInitData();
            if (this.isFixedHeight) {
                this.resize();
            }
        },

        /**
         * 在 rendered 后的回调函数
         * 因为启用列配置时，此时 mounted 后，表格并未生成，而是需要加载完列配置后才能生成
         * @private
         */
        afterRendered() {
            this.bindEventHandler();
        },

        /**
         * 设置初始化数据
         * @private
         */
        setInitData() {
            let data = this.data;

            if (this.isEnableMergeRow) {
                data = this.sortMergeRowData(data);
            }
            this.tableData = data;
        },

        /**
         * 绑定事件处理
         * @private
         */
        bindEventHandler() {
            if (this.showSummary) {
                this.bindSummaryOverflowHandler();
            }
        },

        /**
         * 绑定在合计行中内容超出时显示 tooltip
         * @private
         */
        bindSummaryOverflowHandler() {
            let summaryTds = this.$el.querySelectorAll(".el-table__footer td");

            if (this.previousSummaryTd) {
                this.previousSummaryTd.forEach((item) => {
                    item.removeEventListener("mouseenter", this.handleMouseEnterSummaryCell);
                    item.removeEventListener("mouseleave", this.handleMouseLeaveSummaryCell);
                });
                this.previousSummaryTd = this.currentSummaryTd;
            }

            if (summaryTds) {
                summaryTds.forEach((item) => {
                    item.addEventListener("mouseenter", this.handleMouseEnterSummaryCell);
                    item.addEventListener("mouseleave", this.handleMouseLeaveSummaryCell);
                });
                this.currentSummaryTd = summaryTds;
            }
        },

        /**
         * 获取表格的惟一名
         * @private
         */
        getTableUniqueName() {
            return this.uniqueName;
        },

        /**
         * 获取数据的主键
         * @private
         * @param {object} data
         */
        getRowDataId(data){
            return data[this.idProperty];
        },

        /**
         * 获取内容列的键值映射，即 field => column
         * @private
         */
        getContentColumnMap() {
            if (this.contentColumnsMap === null) {
                this.contentColumnsMap =
                    this.contentColumns.reduce((previous, current) => {
                        previous[current.field] = current;
                        return previous;
                    }, {});
            }
            return this.contentColumnsMap;
        },

        /**
         * 获取内容列
         * @private
         */
        getContentColumns() {
            return this.contentColumns;
        },

        /**
         * 计算表格的合计行数据
         * @private
         * @todo 当前不支持列中存在 formatter 方法的合计值，后期如需要则进行添加
         * @param {object} data
         */
        calculateSummaryData(data) {
            if (this.calculateSummaryFn === null) {
                this.calculateSummaryFn = debounce(this.executeCalculateSummaryData, CALCULATE_SUMMARY_DELAY_TIME);
            }

            if (this.isAutoCalculateSummary) {
                this.calculateSummaryFn(data);
            }
            return [this.summaryText];
        },

        /**
         * 格式化合计时的数据
         * @private
         * @param {object} data
         */
        cleanSummaryData(data) {
            let columns = data.columns,
                map = this.getContentColumnMap(),
                result = [];

            columns.forEach((item) => {
                let column = map[item.property],
                    summaryItem = { field: column.field };

                if (column.summary) {
                    summaryItem.summary = true;
                }

                result.push(summaryItem);
            });

            return {
                data: data.data,
                columns: result
            };
        },

        /**
         * 执行合计行数据的计算
         * @private
         * @param {object} data
         */
        executeCalculateSummaryData(data) {
            let cleanData = this.cleanSummaryData(data);

            if (this.summaryMethod) {
                let result = this.summaryMethod(data);
                this.refreshSummaryByData(result);
            } else {
                MsgService.dispatchAction({
                    target: this.getTableUniqueName(),
                    action: "calculateSummary",
                    data: cleanData
                }, (result) => {
                    this.refreshSummaryByData(result);
                });
            }

        },

        /**
         * 根据数据刷新合计数据
         * @private
         * @param {object[]} data
         */
        refreshSummaryByData(data) {
            if (this.formatSummaryMethod) {
                data = this.formatSummaryMethod(data);
            }
            data.forEach((item) => {
                if (item.summary) {
                    let cell = this.getSummaryCellByField(item.field);

                    if (cell) {
                        cell.children[0].textContent = item.value;
                    }
                }
            });
        },

        /**
         * 根据 field 获取合计行对应的 cell
         * @private
         * @param {string} field
         */
        getSummaryCellByField(field) {
            let className = `field-${field}`;

            return this.$el.querySelector(`.el-table__footer .${className}`);
        },

        /**
         * 判断是否单元格的内容超出了
         * @private
         * @see {@link https://github.com/ElemeFE/element/blob/dev/packages/table/src/table-body.js}
         * @param {HTMLElement} cell
         */
        isCellContentOverflow(cell) {
            let cellChild = cell.querySelector(".cell"),
                range = document.createRange();

            range.setStart(cellChild, 0);
            range.setEnd(cellChild, cellChild.childNodes.length);
            let rangeWidth = range.getBoundingClientRect().width,
                padding = (parseInt(cellChild.style.paddingLeft, 10) || 0) + (parseInt(cellChild.style.paddingRight, 10) || 0);

            return rangeWidth + padding > cellChild.offsetWidth || cellChild.scrollWidth > cellChild.offsetWidth;
        },

        /**
         * 在单元格上显示 tooltip
         * @private
         * @param {string} msg
         * @param {HTMLElement} cell
         */
        showTooltipInCell(msg, cell) {
            let tooltip = this.$refs.tooltip;

            this.tableTooltipContent = msg;
            tooltip.referenceElm = cell;
            tooltip.$refs.popper && (tooltip.$refs.popper.style.display = "none");
            tooltip.doDestroy();
            tooltip.setExpectedState(true);
            this.activateTooltip(tooltip);
        },

        /**
         * 隐藏 tooltip
         * @private
         */
        hideTooltip() {
            let tooltip = this.$refs.tooltip;
            if (tooltip) {
                tooltip.setExpectedState(false);
                tooltip.handleClosePopper();
            }
        },


        /**
         * 处理鼠标进入合计行单元格的事件
         * @private
         * @param {MouseEvent} event
         */
        handleMouseEnterSummaryCell(event) {
            let target = event.target;

            if (target.tagName.toLowerCase() === "td") {
                if (this.isCellContentOverflow(target)) {
                    this.showTooltipInCell(target.innerText, target);
                }
            }
        },

        /**
         * 处理鼠标移出合计行单元格的事件
         * @private
         * @param {MouseEvent} event
         */
        handleMouseLeaveSummaryCell(event) {
            this.hideTooltip();
        },

        /**
         * 处理点击列配置的按钮
         * @private
         */
        handleClickColumnConfig() {
            if (this.isEnableCacheConfig && this.columnConfig === null) {
                ConfigStore.loadColumnConfig(this.getTableUniqueName()).then(({data}) => {
                    this.columnConfig = data;
                    this.isShowColumnConfigDialog = true;
                }).catch(({error}) => this.emitError(error));
            } else {
                this.isShowColumnConfigDialog = true;
            }
        },

        /**
         * 处理点击列配置弹出框中的取消按钮
         * @private
         */
        handleClickCancelColumnConfig() {
            this.isShowColumnConfigDialog = false;
        },

        /**
         * 处理点击列配置弹出框中的保存按钮
         * @private    height: 600px;
         * @param {object[]} data
         */
        handleClickSaveColumnConfig(data) {
            this.isShowColumnConfigDialog = false;
            this.columnConfig = data;

            if (this.isEnableCacheConfig) {
                ConfigStore.saveColumnConfig(data, this.getTableUniqueName());
            }
        },

        /**
         * 处理当前活动行事件
         * @private
         * @param {object} currentRow
         */
        handleChangeCurrentRow(currentRow) {
            this.currentActiveRow = currentRow;
        },

        /**
         * 处理表格选择项发生变化时的事件, 即 element-ui 的 selection-change
         * @private
         * @param {object[]} selection
         */
        handleTableSelectionChangeEvent(selection) {
            this.currentSelection = selection;
            this.$emit("selection-change", selection);
        },

        /**
         * 处理表格勾选 checkbox 的事件, 即 element-ui 的 select
         * @private
         * @param {object} selection
         * @param {object} row
         */
        handleTableSelectEvent(selection, row) {
            this.$emit("select", selection, row);
        },

        /**
         * 处理表格全选 checkbox 的事件, 即 element-ui 的 select-all
         * @private
         * @param {object} selection
         */
        handleTableSelectAllEvent(selection) {
            this.$emit("select-all", selection);
        },

        /**
         * 判断一列是否允许配置
         * @private
         * @param {object} column
         */
        isColumnEnableConfig(column) {
            return !column.isConfigColumn && column.disableConfig !== true;
        },

        /**
         * 判断列是否有子级
         * @private
         * @param {object} column
         */
        isColumnHaveChildren(column) {
            return column.children && typeof column.children.length !== "undefined";
        },

        /**
         * 生成列配置的表头
         * @private
         */
        renderColumnConfigHeader() {
            return (
                <span class="sb-table__config-btn" onClick={this.handleClickColumnConfig}>
                    <i class="iconshezhi iconfont" />
                </span>
            );
        },

        /**
         * 生成跨行跨列的表格
         * @private
         * @todo 支持直接在列上配置 colSpan 和 rowSpan, 而不用配置方法，
         * 　　　　当前存在一些问题如配置 rowSpan 为 2, 则在下一行出现时需要返回 { rowspan: 0, colspan: 0 } 才行
         * @param {object} data - 包含 column, row, columnIndex, rowIndex
         */
        mergeColumnOrRow(data) {
            if (this.spanMethod) {
                return this.spanMethod(data);
            }

            if (this.isEnableMergeRow) {
                return this.simpleMergeRows(data);
            }
        },

        /**
         * 获取合并行对应的映射值
         * @private
         */
        getMergeRowKeyMap() {
            if (this.mergeRowKeyMap === null) {
                let data = this.getTableData(),
                    field = this.mergeRowKey,
                    startMap = {},
                    groupData = {};

                for (let i = 0, j = data.length; i < j; ++i) {
                    let item = data[i],
                        key = item[field];

                    if (!groupData[key]) {
                        groupData[key] = [];
                        startMap[key] = i;
                    }
                    groupData[key].push(item);
                }

                this.mergeRowKeyMap = Object.keys(groupData).reduce((previous, current) => {
                    previous[current] = {
                        total: groupData[current].length,
                        start: startMap[current]
                    };

                    return previous;
                }, {});
            }

            return this.mergeRowKeyMap;
        },

        /**
         * 获取合计行的字段
         * @private
         */
        getMergeRowFields() {
            if (this.mergeRowFields === null) {
                let columns = this.getContentColumns();

                this.mergeRowFields = columns.filter((item) => item.mergeRow).
                                              map((item) => item.field);
            }
            return this.mergeRowFields;
        },

        /**
         * 内置的简单合并行操作
         * @private
         * @param {object} data
         */
        simpleMergeRows({column, row, rowIndex}) {
            let key = this.mergeRowKey,
                fields = this.getMergeRowFields();

            if (fields.indexOf(column.property) !== -1) {
                let map = this.getMergeRowKeyMap();

                if (map[row[key]].start === rowIndex) {
                    return {
                        colspan: 1,
                        rowspan: map[row[key]].total
                    };
                } else {
                    return { colspan: 0, rowspan: 0 };
                }

            }
        },

        /**
         * 当需要合并行时，需要针对对应的字段进行排序
         * @private
         * @param {object[]} data
         */
        sortMergeRowData(data) {
            let copyData = cloneData(data);

            return sortObj(copyData, this.mergeRowKey);
        },

        /**
         * 生成表格内容列
         * @private
         * @param {object} column
         */
        renderTableContentColumn(column) {
            let props = { props: { className: `field-${column.field}` } },
                columnWidth = column.width;

            if (this.isEnableColumnConfig && column.isConfigColumn) {
                props.props["render-header"] = () => this.renderColumnConfigHeader();
                props.props["label-class-name"] = "sb-table__setting-column";
                columnWidth = columnWidth ? columnWidth : CONFIG_COLUMN_DEFAULT_WIDTH;
            }

            if (column.type === "index" && !columnWidth) {
                columnWidth = INDEX_COLUMN_DEFAULT_WIDTH;
            }

            if (columnWidth) {
                props.props.width = columnWidth;
            }

            if (column.type && RESERVED_COLUMN_TYPE.indexOf(column.type) === -1) {
                props.scopedSlots = {
                    default: (scope) => {
                        return (<sb-table-cell column={column} rowData={scope.row} />);
                    }
                };
            } else {
                props.props.type = column.type;
            }

            return (
                <el-table-column
                    show-overflow-tooltip={true}
                    key={column.field}
                    formatter={column.formatter}
                    prop={column.field}
                    label={column.label}
                    { ...props }>
                </el-table-column>
            );
        },

        /**
         * 生成表格列
         * @private
         * @param {object} column - 对应的列配置
         */
        renderTableColumn(column) {
            if(this.isColumnHaveChildren(column)){
                let children = column.children.map((item) => {
                    if(this.isColumnHaveChildren(column)){
                        return this.renderTableColumn(item)
                    }else{
                        this.renderTableContentColumn(item)
                    }
                });
                return (
                    <el-table-column
                        class-name={`field-${column.field}`}
                        key={column.field}
                        label={column.label}>
                        {children}
                    </el-table-column>
                );
            } else {
                this.contentColumns.push(column);
                return this.renderTableContentColumn(column);
            }
        },

        /**
         * 根据列查找对应的配置项
         * @private
         * @param {object} column
         */
        findConfigColumnByColumn(column) {
            let config = this.columnConfig;

            for (let i = 0, j = config.length; i < j; ++i) {
                if (config[i].label === column.label) {
                    return config[i];
                }
            }

            return null;
        },

        /**
         * 根据列配置格式化表格列
         * @param {object[]} columns
         */
        formatTableColumns(columns) {
            let result = [];

            columns.forEach((item) => {
                let config = this.findConfigColumnByColumn(item);
                if (config) {
                    if (config.isVisible) {
                        result.push(item);
                    }
                } else {
                    result.push(item);
                }
            });
            return result;
        },

        /**
         * 生成表格
         * @private
         */
        renderTable() {
            let columnData = this.formatTableColumns(this.columns),
                columns = null,
                props = { props: {} };

            for (let key in TABLE_PROPS_PROXY) {
                if (TABLE_PROPS_PROXY.hasOwnProperty(key)) {
                    props.props[key] = this[TABLE_PROPS_PROXY[key]];
                }
            }

            if (this.isFixedHeight && this.tableHeight !== 0) {
                props.props.height = this.tableHeight;
            } else if (this.height) {
                props.props.height = this.height;
            }
            this.contentColumnsMap = null;
            this.contentColumns = [];
            columns = columnData.map((item) => this.renderTableColumn(item));


            return (
                <el-table ref="table"
                          data={this.tableData}
                          show-summary={this.showSummary}
                          summary-method={this.calculateSummaryData}
                          span-method={this.mergeColumnOrRow}
                          class="sb-table__table"
                          on-selection-change={this.handleTableSelectionChangeEvent}
                          on-current-change={this.handleChangeCurrentRow}
                          on-select={this.handleTableSelectEvent}
                          on-select-all={this.handleTableSelectAllEvent}
                          on-row-dblclick={(...args) => this.emitTableEvent("row-dblclick", args)}
                          { ...props }>
                    {columns}
                </el-table>
            );
        },

        /**
         * 生成列配置弹出框
         * @private
         */
        renderColumnConfigDialog() {
            let columns = this.columns.filter(this.isColumnEnableConfig);

            return (
                <sb-column-config-dialog isVisible={this.isShowColumnConfigDialog}
                    columns={columns}
                    configData={this.columnConfig}
                    onCancel={this.handleClickCancelColumnConfig}
                    onSave={this.handleClickSaveColumnConfig}/>
            );
        },

        /**
         * 生成视图内容
         * @private
         */
        renderViewContent() {
            let result = [this.renderTable()];

            if (this.isEnableColumnConfig) {
                result.push(this.renderColumnConfigDialog());
            }

            result.push(<el-tooltip placement="top" ref="tooltip" content={this.tableTooltipContent} />);

            return result;
        },

        /**
         * 生成视图
         * @private
         */
        renderView() {
            if (this.isEnableCacheConfig && !this.isLoadColumnConfig) {
                ConfigStore.loadColumnConfig().then((data) => {
                    this.isLoadColumnConfig = true;
                    this.columnConfig = data;
                }).catch((error) => this.emitError( { action: "loadConfigError", error} ));
            } else {
                let view = this.renderViewContent();

                setTimeout(() => this.afterRendered(), 0);
                return view;
            }
        },

        /**
         * 获取表格通用样式
         * @private
         */
        getTableCommonStyle() {
            let result = ["sb-table"];

            if (this.isFixedHeight) {
                result.push("sb-table--fixed-height");
            }

            if (this.border) {
                result.push("sb-table--border");
            }

            return result;
        },

        /**
         * 广播错误
         * @private
         * @param {object} error
         */
        emitError(error) {
            this.$emit("tableError", error);
        },

        /**
         * 广播表格事件
         * @param {string} event
         * @param {object} data
         */
        emitTableEvent(event, data) {
            data.unshift(event);

            this.$emit.apply(this, data);
        },

        /**
         * 获取当前表格
         * @private
         */
        getCurrentTable() {
            return this.$refs.table;
        },

        /**
         * 获取当前表格的 tbody
         * @private
         */
        getCurrentTableBody() {
            let table = this.getCurrentTable();

            for (let i = 0, j = table.$children.length; i < j; ++i) {
                let item = table.$children[i];

                if (item.$el.classList.contains("el-table__body")) {
                    return item;
                }
            }
            return null;
        },

        /**
         * 当数据变化时重置表格的状态
         * @private
         */
        resetTableStateWhenDataChange() {
            if (this.isEnableMergeRow) {
                this.mergeRowKeyMap = null;
            }
        },

        /**
         * 重新设置表格的大小
         * @public
         */
        resize() {
            if (this.$el && this.$el.parentElement) {
                this.tableHeight = this.$el.parentElement.clientHeight;
            }
        },

        /**
         * 获取表格的数据
         * @public
         */
        getTableData() {
            return this.tableData;
        },

        /**
         * 获取选中的数据
         * @public
         */
        getSelection() {
            if (this.isEnableSingleSelect) {
                return this.currentActiveRow;
            }
            return this.currentSelection;
        },

        /**
         * 选中表格行
         * @param {object} rowData
         */
        selectRow(rowData) {
            this.toggleRowSelection(rowData, true);
        },

        /**
         * 切换表格的选中项
         * @param {object} rowData
         * @param {boolean} selected
         */
        toggleRowSelection(rowData, selected) {
            let table = this.getCurrentTable();

            table.toggleRowSelection(rowData, selected);
        },

        /**
         * 清除选中的数据
         * @public
         */
        clearSelection() {
            let table = this.getCurrentTable();

            this.currentSelection = [];
            return table.clearSelection();
        },

        /**
         * 切换所有行的选中状态
         * @public
         */
        toggleAllSelection() {
            let table = this.getCurrentTable();

            return table.toggleAllSelection();
        },

        /**
         * 获取合计行数据
         * @public
         */
        getSummaryData() {
            return this.summaryData;
        }
    },

    render() {
        let content = this.renderView(),
            props = {};

        props["class"] = this.getTableCommonStyle();

        return (
            <div {...props}>
                {content}
            </div>
        );
    }
}
