export default {
    name: "sb-dialog",

    props: {
        visible: {
            type: Boolean,
            default: false
        },

        radius: {
            type: Boolean,
            default: true
        },

        title: {
            type: String,
            default: ""
        },

        dialogType: {
            type: String,
            default: ""
            // default: "card"
        },

        layoutType: {
            type: String,
            default: ""
        },

        beforeClose: {
            type: Function
        },

        modal: {
            type: Boolean,
            default: true
        },

        appendToBody: {
            type: Boolean,
            default: false
        },

        width:{
            type: String,
            defaule: ''
        },

        customClass: {
            type: String
        }
    },

    computed: {
        dialogModifier() {
            let result = ["sb-dialog"];

            if (this.radius) {
                result.push("sb-dialog--radius");
            }

            if (this.dialogType) {
                result.push("sb-dialog--" + this.dialogType);
            }

            if (this.layoutType) {
                result.push("sb-dialog--" + this.layoutType);
            }

            return result;
        }
    },

    data() {
        return {
            isVisible: false
        };
    },

    watch: {
        visible() {
            this.isVisible = this.visible;
        },

        isVisible() {
            this.$emit("input", this.isVisible);
        }
    },

    mounted() {
        this.isVisible = this.visible;
    },

    methods: {
        onDialogClose() {
            this.$emit("close");
        },

        onDialogOpen() {
            this.$emit("open");
        },

        onDialogOpened() {
            this.$emit("opened");
        },

        onDialogClosed() {
            this.$emit("closed");
        },

        renderDialog() {
            let content = [this.$slots.default];

            if (this.$slots.title) {
                content.unshift(<template slot="title">{this.$slots.title}</template>);
            }

            if (this.$slots.footer) {
                content.push(<template slot="footer">{this.$slots.footer}</template>);
            }

            return (
                <el-dialog visible={this.isVisible}
                           modal={this.modal}
                           before-close={this.beforeClose}
                           on-close={this.onDialogClose}
                           on-open={this.onDialogOpen}
                           on-opened={this.onDialogOpened}
                           on-closed={this.onDialogClosed}
                           append-to-body={this.appendToBody}
                           class={this.dialogModifier}
                           custom-class={this.customClass}
                           title={this.title}
                           width={this.width}>
                    {content}
                </el-dialog>
            );
        }
    },

    render() {
        return this.renderDialog();
    }
}