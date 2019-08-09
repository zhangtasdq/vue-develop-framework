<template>
    <component :is="layout"></component>
</template>

<script>
import BlankLayout from "./layout/BlankLayout.vue";
import MainLayout from "./layout/MainLayout.vue";

export default {
    components: {
        "sc-blank-layout": BlankLayout,
        "sc-main-layout": MainLayout
    },

    props: {
        layout: {
            type: String,
            default: "sc-main-layout"
        }
    }
};
</script>
