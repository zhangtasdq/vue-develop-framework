<template>
    <div class="sb-tab-view">
        <component ref="view" :is="viewData.component" :view-param="viewData.viewParam"></component>
    </div>
</template>

<script>
export default {
    name: "sb-tab-view",

    props: {
        viewData: {
            type: Object,
            required: true
        }
    },

    methods: {
        onViewShow() {
            this.$refs.view.onViewShow();
        }
    }
};
</script>

