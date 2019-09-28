<template>
    <div class="view view--report">
        <div class="view__header">
            <sb-search-bar>
                <el-form>
                    <el-form-item label="标识">
                        <el-input class="sb-input" size="small"></el-input>
                    </el-form-item>

                    <el-form-item data-search-type="operate-container">
                        <el-button class="sc-button"
                                   data-search-type="search"
                                   size="small"
                                   @click="handleClickQuery">查询</el-button>

                        <el-button class="sc-button"
                                   data-search-type="reset"
                                   size="small"
                                   @click="handleClickResetQuery">重置</el-button>
                    </el-form-item>
                </el-form>
            </sb-search-bar>
        </div>

        <div class="view__content">
            <div class="view__content-inner">
                <el-card class="sb-card">
                    <div slot="header">
                        <span class="sb-card__title">百度相关问题</span>
                        <div class="sb-card__header-aside">
                            <el-button class="sc-button sb-button--light-fill" size="small" type="primary">新增</el-button>
                        </div>
                    </div>

                    <sb-table :columns="columns" :data="data">

                    </sb-table>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
import SearchBar from "../../components/base/SearchBar";
import Table from "../../components/base/table/Table";

export default {
    name: "BaiduRelateQuestion",

    components: {
        "sb-search-bar": SearchBar,
        "sb-table": Table
    },

    data() {
        return {
            columns: [
                { label: "序号", field: "id", type: "index" },
                { label: "姓名", field: "name" },
                { label: "邮箱", field: "email" }
            ],

            data: [
                { id: 1, name: "user-1", email: "user-1@email.com" },
                { id: 2, name: "user-2", email: "user-2@email.com" },
                { id: 3, name: "user-3", email: "user-3@email.com" },
                { id: 4, name: "user-4", email: "user-4@email.com" }
            ]
        }
    },

    methods: {
        handleClickQuery() {

        },

        handleClickResetQuery() {

        }
    }
}
</script>
