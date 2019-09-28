<template>
    <component :is="layout"></component>
</template>

<script>
import BlankLayout from "./layout/BlankLayout.vue";
import MainLayout from "./layout/MainLayout.vue";

export default {
    components: {
        "sb-blank-layout": BlankLayout,
        "sb-main-layout": MainLayout
    },

    props: {
        layout: {
            type: String,
            default: "sb-main-layout"
        }
    }
};
</script>
