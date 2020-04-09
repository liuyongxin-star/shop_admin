<template>
    <div class="shopDetail">
        <div class="detail_title bg-white color85">
            <el-row :gutter="24">
                <el-col :span="16">
                    <div class="fontW500 fontS16">
                        审核信息
                    </div>
                </el-col>
                <el-col :span="8" style="text-align: right">
                    <!--<el-link type="primary" class="link" v-if="store_detail.verified_status==5" @click="detailFn">查看店铺详情</el-link>-->
                    <div v-if="store_detail.verified_status==2">
                        <el-button  size="small" @click="dialogFormVisible =true">拒绝</el-button>
                        <el-button  size="small" type="primary" @click="agreeFn">同意</el-button>
                    </div>
                    <el-button v-else size="small" @click="getHistroyFn">审核记录</el-button>
                </el-col>
            </el-row>
            <div>
                <span>审核状态：</span>
                <span class="fontS14 color65"><span :class="[store_detail.verified_status==1?'bg_green':'bg_red','statusB', 'inline-block']"></span>{{store_detail.verified_status|shopStatusFilter}}</span>
            </div>
        </div>

        <!--店铺装修详情-->
        <shop-decoration :store_detail="store_detail" v-if="store_detail.verified_status==5"></shop-decoration>

        <!--店铺详情-->
        <shop-Com :store_detail="store_detail" v-else></shop-Com>


        <!--拒绝审核模态框-->
        <el-dialog title="请填写拒绝原因" :visible.sync="dialogFormVisible" width="589px">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="拒绝理由：" label-width="98px" prop="refuse_reason">
                    <el-select v-model="form.refuse_reason" placeholder="请选择拒绝理由">
                        <el-option label="营业执照不清晰" value="'营业执照不清晰'"></el-option>
                        <el-option label="其他" value="'其他'"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" label-width="98px" prop="refuse_detail">
                    <el-input
                            type="textarea"
                            placeholder="请输入"
                            v-model="form.refuse_detail"
                            maxlength="100"
                            show-word-limit
                    >
                    </el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="refuseSumbmitFn('3')">确 定</el-button>
            </div>
        </el-dialog>

        <!--审核记录模态-->
        <el-dialog title="审核记录" :visible.sync="dialogTableVisible" width="1190px">
            <el-table :data="recordList">
                <el-table-column property="date" label="审核类型"></el-table-column>
                <el-table-column property="auditor" label="审核人"></el-table-column>
                <el-table-column property="verified_time" label="审核时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.verified_time|dateFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column property="pre_data.name" label="变更内容"></el-table-column>
                <el-table-column property="modification.name" label="变更为"></el-table-column>
                <el-table-column property="verified_status" label="执行结果">
                    <template slot-scope="scope">
                        <span>{{scope.row.verified_status|shopStatusFilter}} {{scope.row.refuse_detail?(scope.row.refuse_detail):''}}</span>
                    </template>
                </el-table-column>
            </el-table>
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
        </el-dialog>
    </div>
</template>

<script>
    import shopFilter from '@/utils/changeType'
    import { getShopList,getVerifiedRecord } from "@/api/shop";
    import { format_objKey, parseTime} from "@/utils/methods";
    import shopDecoration from '@/views/shop/component/shopDecoration.vue'
    import shopCom from '@/views/shop/component/shopCom'
    export default {
        name: "shopDetail",
        components: {
            shopDecoration,
            shopCom
        },
        data(){
            return{
                store_detail:{},
                dialogFormVisible:false,
                form:{
                    refuse_reason:'',
                    refuse_detail:'',
                },
                dialogTableVisible:false,
                recordList:[],
                searchForm:{
                    store_id:Number(this.$route.query.store_id),
                    page:1,
                    limit:10,
                },
                total:0,
                rules:{
                    refuse_reason: [
                        { required: true, message: '请选择拒绝理由', trigger: 'change' }
                    ],
                    refuse_detail: [
                        { required: true, message: '请输入拒绝理由', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                }
            }
        },
        created(){
            this.getDetail();
        },
        methods:{
            getDetail(){
                let send={
                    store_id:Number(this.$route.query.store_id),
                    verified_status:this.$route.query.verified_status,
                };
                getShopList('get',send).then(res => {
                    this.store_detail=res.data.data;
                })
            },
            agreeFn(){  //同意店铺审核
                this.$confirm('您确认要通过本店铺信息吗？', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.shopVerFn('1')
                }).catch(() => {
                });
            },
            refuseSumbmitFn(verified_status){  //拒绝店铺审核
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.shopVerFn(verified_status)
                    } else {
                        return false;
                    }
                });

            },
            shopVerFn(verified_status){  //审核发送请求
                let send={
                    methods: 'verify',
                    auditor:'',
                    verified_status:verified_status,
                    pre_verified_status:this.store_detail.verified_status,
                    ...this.form,
                }
                getShopList('post',send).then(res => {
                    this.$message({
                        showClose: true,
                        message: '审核成功',
                        type: 'success'
                    });
                    this.getDetail();
                })
            },
            getHistroyFn(){ //审核记录
                this.dialogTableVisible=true;
                this.fetchData();
            },
            fetchData(){
                getVerifiedRecord('get',this.searchForm).then(res=>{
                    let resp = res.data;
                    this.recordList = resp.data;
                    this.total = resp.msg.count;
                })
            },
            curPageChange(val) {
                this.searchForm.page = val;
                this.fetchData();
            },
            // detailFn(){ //查看店铺详情
            //
            // }
        },
        filters:{
            //店铺审核状态
            shopStatusFilter(type){
                return shopFilter._filterType(shopFilter._shopVerifiedStatus, type)
            },
            //店铺审核状态
            shopInvoiceFilter(type){
                return shopFilter._filterType(shopFilter._shopInvoiceStatus, type)
            },
            //时间格式化
            dateFilter(type) {
                return parseTime(type)
            },
        }

    }
</script>

<style scoped lang="less">
    .shopDetail{
        margin: 24px;
        .detail_title{
            height: 137px;
            padding: 24px 27px 0 32px;
            box-sizing: border-box;
            .statusB{
                border-radius: 50%;
                width: 6px;
                height: 6px;
                margin-right: 8px;
            }
            .bg_red{
                background: #F5222D;
            }
            .bg_green{
                background: #52C41A;
            }
            .link{
                margin-right: 20px;
            }
        }
        .detail_content{
            min-height: 835px;
            margin-top: 24px;
            padding: 24px 32px;
            box-sizing: border-box;
            .log{
                width:76px;
                height:76px;
                background:rgba(255,255,255,1);
                border-radius:4px;
                border:1px solid rgba(0,0,0,0.15);
                img{
                    width: 100%;
                }
            }
            .el-row{
                margin-bottom: 16px;
            }
            .info{
                .el-row{
                    margin-bottom: 32px;
                }
            }
            .w116{
                width: 116px;
            }
            .mar_bottom{
                margin-bottom: 16px;
             }
            .border_bottom{
                margin-bottom: 24px;
                border-bottom:1px solid rgba(232,232,232,1);
            }
            .propaganda_img{
                width:430px;
                height:110px;
                border-radius:4px;
                border:1px solid rgba(0,0,0,0.15);
                margin: 16px 0  32px 0;
            }
            .brief_img{
                width:480px;
                height:260px;
                border:8px solid rgba(255,255,255,1);
                margin: 16px 0  32px 0;
            }
            img{
                width: 100%;
            }
        }
        .el-dialog{
            width: 586px;
            .el-select{
                width: 454px;
            }
        }
        /deep/.el-textarea__inner{
            height: 88px;
        }
        .pagation{
            padding-bottom: 20px;
            padding-right: 50px;
            text-align: right;
            margin-top: 20px;
        }

    }
</style>