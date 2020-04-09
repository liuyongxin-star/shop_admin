<template>
    <div class="shopCom">
        <div class="detail_content bg-white color85 fontS14">
            <div class="fontS16 fontW500 mar_bottom">店铺信息</div>
            <div class="border_bottom info">
                <el-row>
                    <el-col :span="8"><div class="">
                        <span style="vertical-align: top">店铺LOGO：</span>
                        <span class="inline-block log"><img :src="store_detail.logo" alt=""></span>
                    </div></el-col>
                    <el-col :span="8">
                        <div class="">
                            <span>店铺名称：</span>
                            <span class="color65">{{store_detail.name}}</span>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="">
                            <span>店铺编号：</span>
                            <span class="color65">{{store_detail.store_id}}</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><div class="">
                        <span>发票资质：</span>
                        <span class="color65">{{store_detail.invoice_qualification|shopInvoiceFilter}}</span>
                    </div></el-col>
                    <el-col :span="8">
                        <div class="">
                            <span>累计成交：</span>
                            <span class="color65"></span>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <span>主营类目：</span>
                        <span class="color65" v-for="(item,index) in store_detail.main_business" :key="index">{{item}},</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><div class="">
                        <span>经营范围：</span>
                        <span class="color65"></span>
                    </div></el-col>
                    <el-col :span="8">
                        <div class="">
                            <span>店铺保障：</span>
                            <span class="color65"></span>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="">
                            <span>店铺地址 ：</span>
                            <span class="color65">{{store_detail.address}}</span>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="fontS16 fontW500 mar_bottom">退货地址 <span class="defult inline-block fontS12  tac">默认</span></div>
            <div class="border_bottom">
                <el-row>
                    <el-col :span="8"><div class="">
                        <span>收货人 ：</span>
                        <span class="color65">{{store_detail.refund_contact}}</span>
                    </div></el-col>
                    <el-col :span="8">
                        <div class="">
                            <span>联系电话：</span>
                            <span class="color65">{{store_detail.refund_phone}}</span>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="">
                            <span>收货地址 ：</span>
                            <span class="color65">{{store_detail.refund_address}}</span>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="fontS16 fontW500 mar_bottom">公司信息</div>
            <div class="border_bottom">
                <el-row>
                    <el-col :span="8"><div class="">
                        <span>公司名称：</span>
                        <span class="color65">{{store_detail.company}}</span>
                    </div></el-col>
                    <el-col :span="8">
                        <div class="">
                            <span>法人姓名：</span>
                            <span class="color65"></span>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="">
                            <span>法人电话：</span>
                            <span class="color65"></span>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><div class="">
                        <span>统一社会信用代码：</span>
                        <span class="color65">{{store_detail.business_license_no}}</span>
                    </div></el-col>
                    <el-col :span="8">
                        <div class="">
                            <span>公司地址：</span>
                            <span class="color65">{{store_detail.address}}</span>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="">
                            <span>公司主页：</span>
                            <span class="color65"></span>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><div class="">
                        <span>营业执照：</span>
                        <span class="inline-block log"><img :src='store_detail.business_license' alt=""></span>
                    </div></el-col>
                </el-row>
            </div>
            <div class="fontS16 fontW500 mar_bottom">管理员信息</div>
            <div class="border_bottom">
                <el-row>
                    <el-col :span="8"><div class="">
                        <span>管理员姓名：</span>
                        <span class="color65">{{store_detail.manager_name}}</span>
                    </div></el-col>
                    <el-col :span="8">
                        <div class="">
                            <span>管理员电话：</span>
                            <span class="color65">{{store_detail.manager_IDcard_PD}}</span>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="">
                            <span>管理员身份证：</span>
                            <span class="color65">{{store_detail.manager_IDcard}}</span>
                        </div>
                    </el-col>
                </el-row>
            </div>

            <div class="fontS16 fontW500 mar_bottom">联系人信息</div>
            <div class="border_bottom">
                <el-row>
                    <el-col :span="8"><div class="">
                        <span>联系人姓名：</span>
                        <span class="color65">{{store_detail.contact}}</span>
                    </div></el-col>
                    <el-col :span="8">
                        <div class="">
                            <span>联系人职位：</span>
                            <span class="color65">{{store_detail.contact_position}}</span>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="">
                            <span>联系人电话：</span>
                            <span class="color65">{{store_detail.contact_phone}}</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><div class="">
                        <span>联系人微信：</span>
                        <span class="color65"></span>
                    </div></el-col>
                    <el-col :span="8">
                        <div class="">
                            <span>联系人QQ：</span>
                            <span class="color65"></span>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    import shopFilter from '@/utils/changeType'
    export default {
        name: "shopCom",
        data(){
            return{

            }
        },
        props:['store_detail'],
        filters:{
            //店铺审核状态
            shopInvoiceFilter(type){
                return shopFilter._filterType(shopFilter._shopInvoiceStatus, type)
            },

        }
    }
</script>

<style scoped lang="less">
    .detail_content{
        min-height: 835px;
        margin-top: 24px;
        padding: 24px 32px;
        box-sizing: border-box;
        .defult{
            width:40px;
            height:22px;
            line-height: 22px;
            box-sizing: border-box;
            background:rgba(230,247,255,1);
            border-radius:4px;
            border:1px solid rgba(145,213,255,1);
            color: #1890FF;
        }
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
</style>