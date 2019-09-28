/**
 * 对 element-ui 表格的封装, 包含分页
 * 支持本地分页和服务器端分页
 */
import Table from "./Table";
import {cloneData, mergeArray} from "@/util/tool";

const DEFAULT_PERPAGE_SIZE = 20;

export default {
    name: "sb-pagination-table",
    extends: Table,

    props: {
        store: {
            type: Object,
            default: null
        },

        pageSizes: {
            type: Array,
            default: () => [20, 30, 50, 100, 300]
        },

        initPageCount: {
            type: Number
        },

        formatQueryData: {
            type: Function,
            default: (data) => ({ data: data.data, total: data.total, summary: data.summary })
        },

        isAutoLoadData: {
            type: Boolean,
            default: true
        },

        isKeepSelection: {
            type: Boolean,
            default: false
        },

        isShowSize: {
            type: Boolean,
            default: false
        },

        isShowTotal: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        isLocalData() {
            return this.store === null;
        },

        paginationLayout() {
            let value = ["prev", "pager", "next"];
            if (this.isShowSize) {
                value.push("sizes");
            }

            if (this.isShowTotal) {
                value.push("total");
            }
            return value.join(",");
        }
    },

    data() {
        return {
            dataTotalCount: 0,
            queryCondition: { page: 1, rows: 0 }
        };
    },

    methods: {
        /**
         * 处理表格选择项发生变化时的事件, 即 element-ui 的 selection-change
         * @private
         * @override
         * @param {object[]} selection
         */
        handleTableSelectionChangeEvent(selection) {
            if (this.isKeepSelection) {
                this.currentSelection = mergeArray(this.currentSelection, selection, this.idProperty);
            } else {
                this.currentSelection = selection;
            }
            this.$emit("selection-change", selection, this.currentSelection);
        },

        /**
         * 当数据加载完成后的回调
         * @private
         */
        afterDataLoad() {
            if (this.isKeepSelection) {
                let selectedId = this.currentSelection.map((item) => this.getRowDataId(item)),
                    currentData = this.getTableData().filter((item) => selectedId.indexOf(this.getRowDataId(item)) !== -1);

                currentData.forEach((item) => this.selectRow(item));
            }
            if (this.showSummary) {
                this.refreshSummaryForPagination()
            }
        },

        /**
         * 重新加载表格数据, 会清除查询条件并将页数重置
         * @public
         * @param {object} [condition]
         */
        reloadTable(condition) {
            this.setInitQueryCondition();
            this.updateTable(condition);
        },

        /**
         * 加载表格数据, 会保持当前页数, 只覆写查询条件
         * @public
         * @param {object} condition
         */
        updateTable(condition) {
            if (condition) {
                this.queryCondition = { ...this.queryCondition, ...condition };
            }
            this.updateTableData(this.queryCondition);
        },

        /**
         * 刷新表格数据
         * @public
         */
        refreshTable() {
            this.updateTableData(this.queryCondition);
        },

        /**
         * 加载表格数据
         * @private
         * @param {object} condition
         */
        updateTableData(condition) {
            let def = null;

            if (this.isLocalData) {
                def = this.updateTableByLocal(condition);
            } else {
                def = this.updateTableDataByStore(condition);
            }

            def.then(() => {
                setTimeout(() => this.afterDataLoad());
            });

            return def;
        },

        /**
         * 刷新合计行数据
         * @private
         */
        refreshSummaryForPagination() {
            let data = this.formatPaginationSummaryData(this.summaryData);

            this.refreshSummaryByData(data);
        },

        /**
         * 格式化分页的合计数据
         * @private
         * @param {object} data
         */
        formatPaginationSummaryData(data) {
            let columns = this.getContentColumns(),
                result = [];

            columns.forEach((item) => {
                if (item.summary) {
                    result.push({ field: item.field, value: data[item.field], summary: true });
                }
            });

            return result;
        },

        /**
         * 通过远程加载数据
         * @private
         * @param {object} condition
         */
        updateTableDataByStore(condition) {
            let copyCondition = cloneData(condition);

            return new Promise((resolve, reject) => {
                this.store.query(copyCondition, (data) => {
                    let result = this.formatQueryData(data);

                    this.dataTotalCount = result.total;
                    this.summaryData = result.summary;
                    this.tableData = this.isEnableMergeRow ? this.sortMergeRowData(result.data) : result.data;

                    resolve({ data: this.tableData });
                }, (error) => {
                    this.emitError({ action: "loadDataError", error });
                    reject(error);
                });
            });

        },

        /**
         * 通过本地加载数据
         * @private
         * @param {object} condition
         */
        updateTableByLocal(condition) {
            return new Promise((resolve) => {
                let start = (condition.page - 1) * condition.rows,
                    end = condition.page * condition.rows,
                    data = this.data,
                    tableData = data.slice(start, end);

                this.dataTotalCount = data.length;
                this.summaryData = data.summary;
                this.tableData = this.isEnableMergeRow ? this.sortMergeRowData(tableData) : tableData;

                resolve({data: data});
            });
        },

        /**
         * 设置初始值
         * @private
         * @override
         */
        setInitData() {
            this.setInitQueryCondition();
            if (this.isAutoLoadData) {
                this.reloadTable();
            }
        },

        /**
         * 设置初始化查询条件
         */
        setInitQueryCondition() {
            let rows = DEFAULT_PERPAGE_SIZE;

            if (this.initPageCount) {
                rows = this.initPageCount;
            } else if (this.isShowSize) {
                rows = this.pageSizes[0];
            }
            this.queryCondition = {page: 1, rows};
        },

        /**
         * 处理修改每页显示数
         * @private
         * @param {number} size
         */
        handlePaginationSizeChange(size) {
            this.queryCondition.rows = size;
            this.refreshTable();
        },

        /**
         * 处理改变当前页面
         * @private
         * @param {number} currentPage
         */
        handlePaginationCurrentPageChange(currentPage) {
            this.queryCondition.page = currentPage;
            this.refreshTable();
        },

        /**
         * 生成分页控件
         * @private
         */
        renderPagination() {
            let children = [],
                slots = this.$slots;

            if (slots.paginationPrefix) {
                children.push(<div class="sb-table__pagination-prefix">{slots.paginationPrefix}</div>)
            }

            if (slots.paginationSuffix) {
                children.push(<div class="sb-table__pagination-suffix">{slots.paginationSuffix}</div>)
            }

            return (
                <div ref="paginationWrapper" class="sb-table__pagination">
                    <el-pagination
                        on-size-change={this.handlePaginationSizeChange}
                        on-current-change={this.handlePaginationCurrentPageChange}
                        current-page={this.queryCondition.page}
                        page-sizes={this.pageSizes}
                        page-size={this.queryCondition.rows}
                        layout={this.paginationLayout}
                        prev-text="上一页"
                        next-text="下一页"
                        total={this.dataTotalCount}/>
                    {children}
                </div>
            );
        },

        /**
         * 重新设置表格的大小
         * @public
         * @override
         */
        resize() {
            let el = this.$el,
                parent = el.parentElement,
                pagination = this.$refs.paginationWrapper;

            if (el && parent && pagination) {
                let style = getComputedStyle(parent),
                    paddingTop = parseInt(style.paddingTop),
                    paddingBottom = parseInt(style.paddingBottom),
                    /* 高度为容器高度减去 (分页的高度, 容器的 paddingTop, 容器的 paddingBottom, 表格本身有上下边框 2px, 直接写死 2px) */
                    otherHeight = pagination.offsetHeight + paddingTop + paddingBottom + 2;

                this.tableHeight = parent.clientHeight - otherHeight;
            }
        }
    },

    render() {
        let content = this.renderView(),
            props = {};

        props["class"] = this.getTableCommonStyle().concat("sb-table--pagination");

        return (
            <div {...props}>
                {content}
                {this.renderPagination()}
            </div>
        );
    }
}