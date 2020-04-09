<template>
    <div class="inviteRecords">
        <div class="grade-container">
            <my-search @search="search" @reset="reset">
                <el-form :inline="true" :model="searchForm" ref="searchForm">
                    <el-row :gutter="20" type="flex" justify="space-between">
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="user_id">
                                <div>邀请人ID</div>
                                <el-input v-number-input v-model="searchForm.user_id" placeholder="请输入邀请人ID"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="user_mobile">
                                <div>邀请人手机号</div>
                                <el-input v-model.number="searchForm.user_mobile" placeholder="请输入邀请人手机号"
                                          maxlength="11"
                                          v-number-input
                                ></el-input>
                            </el-form-item>

                        </el-col>
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="user_type">
                                <div>邀请用户类型</div>
                                <el-select v-model="searchForm.user_type" placeholder="请选择邀请用户类型">
                                    <el-option label="内部" :value="'内部'"></el-option>
                                    <el-option label="企业" :value="'企业'"></el-option>
                                    <el-option label="个人" :value="'个人'"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="invite_type">
                                <div>被邀请用户类型</div>
                                <el-select v-model="searchForm.invite_type" placeholder="请选择被邀请用户类型">
                                    <el-option label="内部" :value="'内部'"></el-option>
                                    <el-option label="企业" :value="'企业'"></el-option>
                                    <el-option label="个人" :value="'个人'"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20" type="flex" justify="space-between">
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="friend_level">
                                <div>分销级别</div>
                                <el-select v-model="searchForm.friend_level" placeholder="请选择分销级别">
                                    <el-option label="一级" :value="'lower_friends'"></el-option>
                                    <el-option label="二级" :value="'bottom_friends'"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="register_entrance">
                                <div>邀请渠道</div>
                                <el-select v-model="searchForm.register_entrance" placeholder="请选择邀请渠道">
                                    <el-option label="小程序" :value="'wx'"></el-option>
                                    <el-option label="pc" :value="'pc'"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="time_range">
                                <div>邀请时间</div>
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
                        <el-col :span="6" :md="6" :lg="5">
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
                        <el-table-column prop="user_id" align="center" width="160" label="邀请人ID"></el-table-column>
                        <el-table-column prop="user_name" align="center" label="邀请人"></el-table-column>
                        <el-table-column prop="user_mobile" align="center" label="邀请人手机号"></el-table-column>
                        <el-table-column prop="invite_id" align="center" label="被邀请人ID"></el-table-column>
                        <el-table-column prop="invite_name" align="center" label="被邀请人"></el-table-column>
                        <el-table-column prop="invite_user_type" align="center" label="被邀请用户类型"></el-table-column>
                        <el-table-column prop="friend_level" align="center" label="分销级别">
                            <template slot-scope="scope">
                                <span>{{scope.row.friend_level==='lower_friends'?'一级':'二级'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="register_entrance" align="center" label="邀请渠道">
                            <template slot-scope="scope">
                                <span>{{scope.row.register_entrance=='wx'?'小程序':scope.row.register_entrance}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="invite_time" align="center" label="邀请时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.invite_time |dateFilter}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="purchase" align="center" label="累计消费金额">
                            <template slot-scope="scope">
                                <span>{{scope.row.purchase | fixedMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="money" align="center" label="累计返利金额">
                            <template slot-scope="scope">
                                <span>{{scope.row.money | fixedMoney}}</span>
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
    import { format_objKey, parseTime} from "@/utils/methods";
    import { getDistributionInvite } from "@/api/distribution";
    export default {
        name: "inviteRecords",
        components: {
            mySearch,
        },
        data(){
            return{
                total: 0,
                searchForm: {
                    user_id: "", //邀请人id
                    user_mobile:'', //邀请人电话
                    user_type: "", //邀请人用户类型
                    invite_type:'', //被邀请人用户类型
                    time_range:'', //邀请时间
                    friend_level:'',//分销级别
                    register_entrance:'', //邀请渠道
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
                getDistributionInvite('GET',dataObj).then(res => {
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