<template>
    <div class="internalSales">
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
                            <el-form-item prop="salesman_name">
                                <div>真实姓名</div>
                                <el-input v-model="searchForm.salesman_name" placeholder="请输入真实姓名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :md="6" :lg="5">
                            <el-form-item prop="mobile">
                                <div>手机号</div>
                                <el-input v-model.number="searchForm.mobile" placeholder="请输入手机号"
                                          maxlength="11"
                                          v-number-input
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </my-search>
            <div class="monthBox bg-white">
                <div class="flex">
                    <span class="tac pointer fontS14" :class="{'active':index ==active_index }" v-for="(item,index) in monthArray" :key="index" @click="fetchData(index)">{{item}}月</span>
                </div>
            </div>
            <div class="data-box bg-white">
                <div class="data-table">
                    <el-table
                            :data="dataList"
                            :header-cell-style="{background:'#FAFAFA',fontWeight:'500',color:'rgba(0,0,0,.85)'}"
                    >
                        <el-table-column prop="_id" align="center" width="160" label="用户ID"></el-table-column>
                        <el-table-column prop="name" align="center" label="用户名"></el-table-column>
                        <el-table-column prop="salesman_name" align="center" label="真实姓名"></el-table-column>
                        <el-table-column prop="mobile" align="center" label="手机号"></el-table-column>
                        <el-table-column prop="salesman_name" align="center" label="用户类型">
                            <span>内部</span>
                        </el-table-column>
                        <el-table-column prop="level_one_money" align="center" label="一级返利金额(1%)">
                            <template slot-scope="scope">
                                <span>{{scope.row.level_one_money|fixedMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="level_two_money" align="center" label="二级返利金额(0.3%)">
                            <template slot-scope="scope">
                                <span>{{scope.row.level_two_money|fixedMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="level_two_money" align="center" label="总计返利金额">
                            <template slot-scope="scope">
                                <span>{{(scope.row.level_two_money+scope.row.level_one_money)|fixedMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-link type="primary" @click="editName(scope.row._id)">修改姓名</el-link>
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


        <!--修改姓名弹框-->
        <el-dialog title="修改姓名" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="真实姓名" prop="salesman_name">
                    <el-input v-model="form.salesman_name" autocomplete="off" placeholder="请输入真实姓名"></el-input>
                </el-form-item>
                <el-form-item label="修改原因" prop="reason">
                    <el-input v-model="form.reason" autocomplete="off" placeholder="请输入修改原因"
                              maxlength="50"
                              show-word-limit
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import mySearch from "@/components/searchBox.vue";
    import { format_objKey } from "@/utils/methods";
    import { getDistributionSalesman } from "@/api/distribution";
    export default {
        name: "internalSales",
        components: {
            mySearch,
        },
        data(){
            return{
                total: 0,
                searchForm: {
                    user_id: "",
                    salesman_name: "",
                    name: "",
                    mobile:'',
                    month:new Date().getMonth()+1,
                    limit: 10,
                    page: 1
                },
                dataList: [],
                monthArray:['一','二','三','四','五','六','七','八','九','十','十一','十二'],
                active_index:new Date().getMonth(),
                dialogFormVisible:false,
                form:{
                    salesman_name:'' ,//修改姓名
                    reason:'',
                    user_id:'',
                },
                rules:{
                    salesman_name: [
                        { required: true, message: '请输入真实姓名', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ],
                    reason: [
                        { required: true, message: '请输入修改原因', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 50 个字符', trigger: 'blur' }
                    ],
                },
            }
        },
        created() {
            this.fetchData();
        },
        methods:{
            fetchApi(dataObj) {
                getDistributionSalesman('get',dataObj).then(res => {
                    const resp = res.data.data;
                    this.dataList = resp.page_list;
                    this.total = resp.count;
                });
            },
            // 列表获取
            fetchData(month) {
                if(month){
                    this.searchForm.month=month+1;
                    this.active_index=month;
                }
                let dataObj = format_objKey(Object.assign({}, this.searchForm));
                this.fetchApi(dataObj);
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
            //修改姓名
            editName(_id) {
                this.dialogFormVisible=true;
                this.form.user_id=_id;
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        getDistributionSalesman('post',this.form).then(res=>{
                            this.fetchData();
                            this.$refs["form"].resetFields();
                            this.dialogFormVisible=false;
                        })
                    } else {
                        return false;
                    }
                });
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
    .monthBox{
        padding: 32px 0 0 17px;
    }
    .monthBox span{
        width: 58px;
        height: 22px;
        line-height: 22px;
        border-radius:4px;
    }
    .monthBox>div{
        justify-content: left;
    }
    .monthBox span.active{
        color: #fff;
        background: #1890FF;
    }
</style>