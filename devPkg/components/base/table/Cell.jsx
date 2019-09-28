import { isFunction, ExpressionHelper } from "@/util/tool";
import TextCell from "./TextCell";

export default {
    name: "sb-table-cell",

    props: {
        column: {
            type: Object,
            required: true
        },

        rowData: {
            type: Object,
            required: true
        }
    },

    methods: {
        buildCell(createElement) {
            let column = this.column,
                rowData = this.rowData,
                type = column.type,
                content = null;

            if (column.renderCell) {
                type = "render";
            }

            switch (type) {
                case "icon":
                    content = this.buildCellContentByType("icon", column.icons, column, rowData, createElement);
                    break;
                case "btn":
                    content = this.buildCellContentByType("btn", column.btns, column, rowData, createElement);
                    break;
                case "subs":
                    content = this.renderSubsContent(column, rowData, createElement);
                    break;
                case "render":
                    content = this.buildCellContentByType("render", null, column, rowData, createElement);
                    break;
                case "text":
                    content = this.buildCellContentByType("text", null, column, rowData, createElement);
                    break;
                default:
                    content = this.renderDefaultContent(column, rowData);
                    break;
            }

            return content;
        },

        /**
         * 根据类型创建单元格的内容
         * @private
         * @param {string} type
         * @param {object} typeData
         * @param {object} column
         * @param {object} rowData
         * @param {function} createElement
         */
        buildCellContentByType(type, typeData, column, rowData, createElement) {
            let content = [];

            switch (type) {
                case "btn":
                    content = this.renderBtnContent(typeData, column, rowData, createElement);
                    break;
                case "icon":
                    content = this.renderIconContent(typeData, column, rowData);
                    break;
                case "render":
                    content = column.renderCell(rowData, column);
                    break;
                case "text":
                    content = this.renderTextContent(column, rowData);
                    break;
                default:
                    content = this.renderDefaultContent(column, rowData);
                    break;
            }

            return content;
        },

        /**
         * 判断是否显示单元格的内容
         * @private
         * @param {object} column
         * @param {object} rowData
         */
        isShowCellContent(column, rowData) {
            if (column.isVisible) {
                if (isFunction(column.isVisible)) {
                    return column.isVisible(rowData, column);
                }
                return ExpressionHelper.getExpressionValue(column.isVisible, rowData);
            }
            return true;
        },

        /**
         * 判断单元格内的组件是否禁用
         * @private
         * @param {object} component - 对应的组件
         * @param {object} rowData - 对应的行数据
         */
        isDisabledCellComponent(component, rowData) {
            if (component.isDisabled) {
                if (isFunction(component.isDisabled)) {
                    return component.isDisabled(rowData);
                }
                return ExpressionHelper.getExpressionValue(component.isDisabled, rowData);
            }
            return false;
        },

        /**
         * 获取组件的属性
         * @param {object} column
         * @param {object} rowData
         */
        getComponentProps(column, rowData) {
            let props = column.props ? column.props : {};

            if (column.rowPropsFn) {
                let rowsProps = column.rowPropsFn(rowData);

                props = { ...props, ...rowsProps};
            }

            return props;
        },

        /**
         * 生成默认的单元格内容
         * @param {object} column
         * @param {object} rowData
         * @private
         */
        renderDefaultContent(column, rowData) {
            if (this.isShowCellContent(column, rowData)) {
                return rowData[column.field];
            }
            return null;
        },

        /**
         * 生成按钮类型的单元格
         * @private
         * @param {object | object[]} btns
         * @param {object} column
         * @param {object} rowData
         * @param {function} createElement
         */
        renderBtnContent(btns, column, rowData, createElement) {
            btns = Array.isArray(column.btns) ? btns : [btns];
            btns = btns.filter((item) => this.isShowCellContent(item, rowData));

            return btns.map((item) => this.buildBtnComponent(item, rowData, createElement));
        },

        /**
         * 生成单个按钮类型的组件
         * @private
         * @param {object} btn
         * @param {object} rowData
         * @param {function} createElement
         */
        buildBtnComponent(btn, rowData, createElement) {
            if (btn.type) {
                return this.buildCustomBtnComponent(btn, rowData, createElement);
            }
            return this.buildDefaultBtnComponent(btn, rowData);
        },

        /**
         * 生成自定义类型的按钮
         * @private
         * @param {object} btn
         * @param {object} rowData
         * @param {function} createElement
         */
        buildCustomBtnComponent(btn, rowData, createElement) {
            let props = this.getComponentProps(btn, rowData);

            return createElement(btn.type, {
                props
            });
        },

        /**
         * 生成默认类型的按钮
         * @param {object} btn
         * @param {object} rowData
         */
        buildDefaultBtnComponent(btn, rowData) {
            let props = this.getComponentProps(btn, rowData);

            if (this.isDisabledCellComponent(btn, rowData)) {
                props.disabled = true;
            }

            return (
                <el-button class="sb-button" { ...{props}} onClick={() => this.handleClickBtn(btn)}>{btn.text}</el-button>
            );
        },

        /**
         * 生成 sub 类型的单元格
         * @private
         * @param {object} column
         * @param {object} rowData
         * @param {function} createElement
         */
        renderSubsContent(column, rowData, createElement) {
            let subs = column.subs.filter((item) => this.isShowCellContent(item.data, rowData));

            return subs.map((item) => {
                return this.buildCellContentByType(item.type, item.data, column, rowData, createElement);
            }).filter((item) => !!item);
        },

        /**
         * 生成 icon 类型的单元格
         * @private
         * @param {object} icons
         * @param {object} column
         * @param {object} rowData
         */
        renderIconContent(icons, column, rowData) {
            let content = null;

            icons = Array.isArray(icons) ? icons : [icons];
            icons = icons.filter((item) => this.isShowCellContent(item, rowData));

            content = icons.map((item) => {
                let name = ["sb-table__icon--operate", isFunction(item.icon) ? item.icon(rowData) : item.icon];

                if (this.isDisabledCellComponent(item, rowData)) {
                    name.push("sb-table__icon--disabled");
                }

                return (<i class={name} onClick={() => this.handleClickBtn(item)} />);
            });


            return content;
        },

        /**
         * 生成 text 类型的单元格
         * @private
         * @param {object} column
         * @param {object} rowData
         */
        renderTextContent(column, rowData) {
            if (this.isShowCellContent(column, rowData)) {
                return <TextCell column={column} rowData={rowData} cellValue={rowData[column.field]} />
            }
            return null;
        },

        /**
         * 处理按钮点击事件
         * @private
         * @param {object} column
         */
        handleClickBtn(column) {
            let rowData = this.rowData;

            if (column.onClick && !this.isDisabledCellComponent(column, rowData)) {
                column.onClick(rowData);
            }
        }
    },

    render(createElement) {
        let classModifier = ["sb-table__body-cell"];

        if (this.column.columnType === "operate") {
            classModifier.push("sb-table__body-cell--operate");
        }

        return (
            <div class={classModifier}>
                {this.buildCell(createElement)}
            </div>
        );
    }
};
