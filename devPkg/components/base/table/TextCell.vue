<template>
    <span class="sb-table__text-cell">
        {{cellContent}}
        <span style="display: none;">{{cellValue}}</span>
    </span>
</template>

<script>
export default {
    name: "sb-table-text-cell",

    props: {
        rowData: {
            type: Object,
            required: true
        },

        column: {
            type: Object,
            required: true
        },

        cellValue: {
            type: [String, Number]
        }
    },

    data() {
        return {
            cellContent: ""
        };
    },

    mounted() {
        this.loadCellContent();
    },

    updated() {
        this.loadCellContent();
    },

    methods: {
        loadCellContent() {
            let rowData = this.rowData,
                column = this.column,
                cellContent = this.cellValue;

            if (column.formatter) {
                cellContent = column.formatter(rowData, column, cellContent);

                if (cellContent) {
                    if (typeof cellContent.then === "function") {
                        cellContent.then((value) => {
                            this.cellContent = value;
                        });
                    } else {
                        this.cellContent = cellContent;
                    }
                }
            } else {
                this.cellContent = cellContent;
            }
        }
    }
};
</script>
