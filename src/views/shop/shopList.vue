<template>
    <div class="shopList">
        <div class="grade-container">
            <my-search @search="search" @reset="reset">
                <el-form :inline="true" :model="searchForm" ref="searchForm">
                    <el-row :gutter="20" type="flex" justify="space-between">
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="name">
                                <div>店铺名称</div>
                                <el-input v-number-input v-model="searchForm.name" placeholder="请输入店铺名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="contact">
                                <div>管理员姓名</div>
                                <el-input v-model="searchForm.contact" placeholder="请输入管理员姓名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="sticky_qualification">
                                <div>置顶特权</div>
                                <el-select v-model="searchForm.sticky_qualification" placeholder="请选择置顶特权">
                                    <el-option label="店铺置顶特权" :value="1"></el-option>
                                    <el-option label="商品置顶特权" :value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="verified_status">
                                <div>审核情况</div>
                                <el-select v-model="searchForm.verified_status" placeholder="请选择审核情况">
                                    <el-option label="审核通过" :value="1"></el-option>
                                    <el-option label="创建未审核" :value="2"></el-option>
                                    <el-option label="审核未通过" :value="3"></el-option>
                                    <el-option label="关闭审核" :value="4"></el-option>
                                    <el-option label="装修未审核" :value="5"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20" type="flex" justify="space-between">
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="operating_status">
                                <div>店铺状态</div>
                                <el-select v-model="searchForm.operating_status" placeholder="请选择店铺状态">
                                    <el-option label="全部" :value="0"></el-option>
                                    <el-option label="已开启" :value="1"></el-option>
                                    <el-option label="已关闭" :value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="18" :md="18" :lg="18" class="money_search">
                            <el-form-item prop="total_turnover_min">
                                <div>累计成交金额</div>
                                <el-input v-model.number="searchForm.total_turnover_min" placeholder="请输入"
                                          v-number-input
                                ></el-input> -
                                <el-input v-model.number="searchForm.total_turnover_max" placeholder="请输入"
                                          v-number-input
                                ></el-input>
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
                        <el-table-column
                                type="selection">
                        </el-table-column>
                        <el-table-column prop="time_end" align="center" label="序号">
                            <template slot-scope="scope">
                                <span>000{{scope.$index+1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" align="center" width="160" label="店铺名称"></el-table-column>
                        <el-table-column prop="contact" align="center" label="管理员姓名">
                            <template slot-scope="scope">
                                <span>{{scope.row.time_end |dateFilter}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="contact_phone" align="center" label="管理员电话"></el-table-column>
                        <el-table-column prop="purchase" align="center" label="店铺累计成交额">
                            <template slot-scope="scope">
                                <span>{{scope.row.purchase | fixedMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sticky_qualification" align="center" label="置顶特权">
                            <template slot-scope="scope">
                                <div v-if="scope.row.sticky_qualification>0" class="stickyBox">
                                    <img src="https://qn.ygp.sany.com.cn/icon_top_shop.png" alt="">
                                    <span>{{scope.row.sticky_qualification==1?'店铺置顶':'商品置顶'}}</span>
                                </div>
                                <span v-else>暂无</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="verified_status" align="center" label="审核情况">
                            <template slot-scope="scope">
                                <span :class="['inline-block', 'stateCommon', scope.row.verified_status==1? 'stateBgGreen':scope.row.verified_status==4? 'stateBgDef': 'stateBgRed']"></span>
                                <span>{{scope.row.verified_status|shopStatusFilter}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="operating_status" align="center" label="店铺状态">
                            <template slot-scope="scope">
                                <el-switch
                                        v-model="scope.row.operating_status"
                                        :active-value="'1'"
                                        :inactive-value="'2'"
                                        active-color="#1890FF"
                                        inactive-color="rgba(0,0,0,0.25)"
                                        @click.native="close_openShop(scope.$index, scope.row)"
                                >
                                </el-switch>
                            </template>

                        </el-table-column>
                        <el-table-column prop="create_time" align="center" label="操作">
                            <template slot-scope="scope">
                                <el-link type="primary" @click="toDetail(scope.row.store_id,scope.row.verified_status)">查看详情</el-link>
                                <el-link v-if="scope.row.operating_status==2" type="primary" @click="deleteShopData(scope.row._id)">删除</el-link>
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
    import shopFilter from '@/utils/changeType'
    import mySearch from "@/components/searchBox.vue";
    import { format_objKey, parseTime} from "@/utils/methods";
    import { getShopList } from "@/api/shop";
    export default {
        name: "shopList",
        components: {
            mySearch,
        },
        data(){
            return{
                total: 0,
                searchForm: {
                    name:'',
                    contact:'', //管理员姓名
                    sticky_qualification:'',//店铺特权
                    verified_status:'',//店铺审核状态
                    total_turnover_max:'', //累计金额最大值
                    total_turnover_min:'', //累计金额最小值
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
                getShopList('GET',dataObj).then(res => {
                    let resp = res.data;
                    this.dataList = resp.data;
                    this.total = resp.msg.count;
                });
            },
            // 列表获取
            fetchData() {
                let searchObj = {
                    ...this.searchForm,
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
            toDetail(id,verified_status){  //查看店铺详情
                this.$router.push({
                    path: 'shopDetail',
                    query: {
                        store_id:id,
                        verified_status:verified_status,
                    }
                })
            },
            deleteShopData(id){  //删除店铺
                this.$confirm('您确认要删除该店铺吗？', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let detel_shop={
                        method:"delete",
                        ids:id,
                    };
                    getShopList('post',detel_shop).then(res => {
                        this.fetchData();
                    })
                }).catch(() => {
                });
            },
            close_openShop(index,row){ //关闭开启店铺
                let isOpenText=row.operating_status==1?'开启':'关闭';
                this.$confirm(`您确认要${isOpenText}该店铺吗?`, '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let isOpen=row.operating_status==1?'1':'2';
                    getShopList('post',{method: 'switch',operating_status:isOpen,ids:row._id}).then(res => {
                        this.fetchData();
                    })
                }).catch(() => {
                    this.fetchData();
                });

            }

        },
        filters: {
            //时间格式化
            dateFilter(type) {
                return parseTime(type)
            },
            //店铺审核状态
            shopStatusFilter(type){
               return shopFilter._filterType(shopFilter._shopVerifiedStatus, type)
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
        margin-left: 20px;
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
    .money_search>>>.el-input{
        width: auto;
    }
    .stickyBox img{
        vertical-align: middle;
        margin-right: 3px;
    }
    .stickyBox{
        color: #FAAD14;
    }
</style>