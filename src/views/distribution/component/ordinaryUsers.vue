<template>
    <div class="ordinaryUsers">
        <div class="grade-container">
            <my-search @search="search" @reset="reset">
                <el-form :inline="true" :model="searchForm" ref="searchForm">
                    <el-row :gutter="20" type="flex" justify="space-between">
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="user_id">
                                <div>用户ID</div>
                                <el-input v-number-input v-model="searchForm.user_id" placeholder="请输入用户ID"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="name">
                                <div>用户名</div>
                                <el-input v-model="searchForm.name" placeholder="请输入用户名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="mobile" >
                                <div>手机号</div>
                                <el-input v-model.number="searchForm.mobile" placeholder="请输入手机号"
                                          maxlength="11"
                                          v-number-input
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="user_type">
                                <div>用户类型</div>
                                <el-select v-model="searchForm.user_type" placeholder="请选择用户类型">
                                    <el-option label="个人" :value="'个人'"></el-option>
                                    <el-option label="企业" :value="'企业'"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </my-search>
            <div class="data-box bg-white">
                <div class="data-table">
                    <el-table
                            :data="dataList"
                            :header-cell-style="{background:'#FAFAFA',fontWeight:'500',color:'rgba(0,0,0,.85)'}"
                    >
                        <el-table-column prop="user_id" align="center" width="160" label="用户ID"></el-table-column>
                        <el-table-column prop="user_name" align="center" label="用户名"></el-table-column>
                        <el-table-column prop="mobile" align="center" label="手机号"></el-table-column>
                        <el-table-column prop="company" align="center" label="用户类型">
                            <template slot-scope="scope">
                                <div :class="{'user_type-circle':true, 'error':scope.row.company===false}"></div>
                                <span>{{scope.row.company?'企业':'个人'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="lower_friends_count" align="center" label="一级好友数"></el-table-column>
                        <el-table-column prop="bottom_friends_count" align="center" label="二级好友数"></el-table-column>
                        <el-table-column prop="lower_friends_money" align="center" label="好友累计消费">
                            <template slot-scope="scope">
                                <span>{{(scope.row.lower_friends_money+scope.row.bottom_friends_money)|fixedMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="lower_friends_distribution" align="center" label="好友累计返利">
                            <template slot-scope="scope">
                                <span>{{(scope.row.lower_friends_distribution+scope.row.bottom_friends_distribution)|fixedMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="last_withdrawal" align="center" label="可提现金额">
                            <template slot-scope="scope">
                                <span>{{scope.row.last_withdrawal|fixedMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="has_withdrawal" align="center" label="已提现金额">
                            <template slot-scope="scope">
                                <span>{{scope.row.has_withdrawal|fixedMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="left">
                            <template slot-scope="scope">
                                <el-link type="primary" @click="toDetail(scope.row.user_id)">查看详情</el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagation my-pages">
                    <el-pagination
                            background
                            @current-change="curPageChange"
                            :current-page="searchForm.page"
                            :page-size="searchForm.limit"
                            :page-sizes="[10]"
                            layout="total, prev, pager, next,sizes, jumper"
                            :total="total"
                    ></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mySearch from "@/components/searchBox.vue";
    import { format_objKey } from "@/utils/methods";
    import { getDistributionUser } from "@/api/distribution";
    export default {
        name: "ordinaryUsers",
        components: {
            mySearch,
        },
        data(){
            return{
                total: 0,
                searchForm: {
                    user_id: "",
                    user_type: "",
                    name: "",
                    mobile:'',
                    limit: 10,
                    page: 1
                },
                dataList: [],
            }
        },
        created() {
            this.fetchData();
        },
        methods:{
            fetchApi(dataObj) {
                getDistributionUser('get',dataObj).then(res => {
                    const resp = res.data.data;
                    this.dataList = resp.page_list;
                    this.total = resp.count;
                });
            },
            // 列表获取
            fetchData() {
                let dataObj = format_objKey(Object.assign({}, this.searchForm));
                this.fetchApi(dataObj);
            },
            search() {
                this.fetchData(this.searchForm);
            },
            reset() {
                this.$refs["searchForm"].resetFields();
            },
            curPageChange(val) {
                this.searchForm.page = val;
                this.fetchData();
            },
            //跳转详情
            toDetail(user_id) {
                this.$router.push({
                    path: 'distributionUserDetail',
                    query: {
                        user_id
                    }
                })
            },

        }
    }
</script>

<style scoped>
    .grade-container {
        padding: 0 24px 24px;
    }

    /**tab等级 end*/
    .data-box .data-table {
        padding: 24px;
    }

    .pagation {
        padding-bottom: 48px;
        padding-right: 50px;
        text-align: right;
    }
    .grade-container .my-search-box{
        margin-bottom: 0;
        border-bottom: 1px solid #E8E8E8;
    }
</style>