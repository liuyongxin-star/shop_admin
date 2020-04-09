<template>
    <div class="rebateRecords">
        <div class="grade-container">
            <my-search @search="search" @reset="reset">
                <el-form :inline="true" :model="searchForm" ref="searchForm">
                    <el-row :gutter="20" type="flex" justify="space-between">
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="order_id">
                                <div>订单编号</div>
                                <el-input v-number-input v-model="searchForm.order_id" placeholder="请输入订单编号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="friend_id">
                                <div>付款用户ID</div>
                                <el-input v-model="searchForm.friend_id" placeholder="请输入付款用户ID"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="friend_name">
                                <div>付款用户</div>
                                <el-input v-model="searchForm.friend_name" placeholder="请输入付款用户"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="friend">
                                <div>分销级别</div>
                                <el-select v-model="searchForm.friend" placeholder="请选择分销级别">
                                    <el-option label="一级" :value="'lower_friends'"></el-option>
                                    <el-option label="二级" :value="'bottom_friends'"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20" type="flex" justify="space-between">
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="user_id">
                                <div>收益用户ID</div>
                                <el-input v-model="searchForm.user_id" placeholder="请输入收益用户ID"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="user_mobile">
                                <div>收益手机号</div>
                                <el-input v-model.number="searchForm.user_mobile" placeholder="请输入收益手机号"
                                          maxlength="11"
                                          v-number-input
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="user_type">
                                <div>收益人类型</div>
                                <el-select v-model="searchForm.user_type" placeholder="请选择收益人类型">
                                    <el-option label="内部" :value="'内部'"></el-option>
                                    <el-option label="个人" :value="'个人'"></el-option>
                                    <el-option label="企业" :value="'企业'"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :md="6" :lg="5">
                        </el-col>
                    </el-row>

                    <el-row :gutter="20" type="flex">
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="create_time">
                                <div>返利时间</div>
                                <el-date-picker
                                        v-model="searchForm.time_range"
                                        type="datetimerange"
                                        value-format="timestamp"
                                        :default-time="['00:00:00', '23:59:59']"
                                        :picker-options="pickerOptions"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                ></el-date-picker>
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
                        <el-table-column prop="order_id" align="center" width="160" label="订单编号"></el-table-column>
                        <el-table-column prop="time_end" align="center" label="付款时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.time_end |dateFilter}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="purchase" align="center" label="实付金额">
                            <template slot-scope="scope">
                                <span>{{scope.row.purchase | fixedMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="friend_id" align="center" label="付款用户ID"></el-table-column>
                        <el-table-column prop="friend_name" align="center" label="用户名"></el-table-column>
                        <el-table-column prop="friend" align="center" label="分销级别">
                            <template slot-scope="scope">
                                <span>{{scope.row.friend==='lower_friends'?'一级':'二级'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" align="center" label="返利时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.create_time|dateFilter}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="money" align="center" label="返利金额">
                            <template slot-scope="scope">
                                <span>{{scope.row.money | fixedMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="user_id" align="center" label="收益人ID">

                        </el-table-column>
                        <el-table-column prop="user_type" align="center" label="收益人类型"></el-table-column>
                        <el-table-column prop="user_mobile" align="center" label="收益人手机号"></el-table-column>
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
    import { format_objKey, parseTime} from "@/utils/methods";
    import { getDistributionBill } from "@/api/distribution";
    export default {
        name: "rebateRecords",
        components: {
            mySearch,
        },
        data(){
            return{
                total: 0,
                searchForm: {
                    user_id: "", //受益人用户id
                    user_mobile:'', //受益人电话
                    user_type: "", //受益人类型
                    time_range:'', //返利时间
                    order_id:'', //订单编号
                    friend_id:'', //付款用户ID
                    friend_name:'',//付款用户
                    friend:'',//分销级别
                    limit: 10,
                    page: 1
                },
                dataList: [],
                pickerOptions: {
                    //时间限制 不能超过今天
                    disabledDate(time) {
                        let curDate = new Date().getTime()
                        let year = 365 * 24 * 3600 * 1000
                        return time.getTime() > Date.now()
                    }
                }
            }
        },
        created() {
            this.fetchData();
        },
        methods:{
            fetchApi(dataObj) {
                getDistributionBill('GET',dataObj).then(res => {
                    let resp = res.data.data;
                    this.dataList = resp.page_list;
                    this.total = resp.count;
                });
            },
            // 列表获取
            fetchData() {
                let searchObj = {
                    ...this.searchForm,
                    start_time: this.searchForm.time_range[0],
                    end_time: this.searchForm.time_range[1],
                };
                let dataObjs = format_objKey(Object.assign({}, searchObj));
                this.fetchApi(dataObjs);
            },
            search() {
                this.fetchData();
            },
            reset() {
                this.$refs["searchForm"].resetFields();
            },
            curPageChange(val) {
                this.searchForm.page = val;
                this.fetchData();
            },

        },
        filters: {
            //时间格式化
            dateFilter(type) {
                return parseTime(type)
            }
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

    .data-box .el-link:last-child {
        margin-left: 40px;
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