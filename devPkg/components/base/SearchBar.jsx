export default {
    name: "sb-search-bar",

    props: {
        isExpand: {
            type: Boolean,
            default: false
        },

        optimization: {
            type: Boolean,
            default: true
        }
    },

    data() {
        return {
            isLoadHideItem: false
        };
    },

    computed: {
        shouldOptimizationChildren() {
            return this.optimization && !this.isLoadHideItem && !this.isExpand;
        }
    },

    methods: {
        isCollapseHideItem(item) {
            return item.data && item.data.attrs && item.data.attrs["data-search-type"] === "hide";
        },

        optimizationChildren() {
            let form = this.$slots.default[0],
                options = form.componentOptions;

            options.children = options.children.filter((item) => !this.isCollapseHideItem(item));
        },

        renderSearchBar() {
            if (this.shouldOptimizationChildren) {
                this.isLoadHideItem = true;
                this.optimizationChildren();
            }
            return this.$slots.default;
        },

        handleClickCollapse() {
            this.$emit("update:isExpand", false);
        }
    },

    render(createElement) {
        let classNames = ["sb-search-bar"],
            content = [this.renderSearchBar()];

        if (this.isExpand) {
            classNames.push("sb-search-bar--expand");
            content.push(<i data-search-type="collapse"
                            tabIndex="-1"
                            class="sb-search-bar__collapse-btn epm-icon epm-icon__fold"
                            vOn:keydown_enter={this.handleClickCollapse}
                            on-click={this.handleClickCollapse}/>)
        }

        return (
            <div class={classNames}>
                {content}
            </div>
        );
    }
}
