<template>
    <div class="distributionUserRebate">
        <div class="grade-container">
            <div class="data-box bg-white">
                <div class="data-table">
                    <el-table
                            :data="dataList"
                            :header-cell-style="{background:'#FAFAFA',fontWeight:'500',color:'rgba(0,0,0,.85)'}"
                    >
                        <el-table-column prop="order_id" align="center" width="160" label="订单编号"></el-table-column>
                        <el-table-column prop="time_end" align="center" label="付款时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.time_end | dateFilter}}</span>
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
                                <span>{{scope.row.friend=='lower_friends' ?"一级":"二级"}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" align="center" label="返利时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.create_time | dateFilter}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="money" align="center" label="返利金额">
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
    import { format_objKey ,parseTime} from "@/utils/methods";
    import { getDistributionUserRebate } from "@/api/distribution";
    export default {
        name: "distributionUserRebate",
        data(){
            return{
                total: 0,
                searchForm: {
                    user_id: "",
                    limit: 10,
                    page: 1
                },
                dataList: [],
            }
        },
        created(){
            this.fetchData();
        },
        methods:{
            fetchApi(dataObj) {
                getDistributionUserRebate('get',dataObj).then(res => {
                    const resp = res.data.data;
                    this.dataList = resp.page_list;
                    this.total = resp.count;
                });
            },

            // 列表获取
            fetchData() {
                this.searchForm.user_id=this.$route.query.user_id;
                let dataObj = format_objKey(Object.assign({}, this.searchForm));
                this.fetchApi(dataObj);
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
        margin-top: 24px;
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
</style>