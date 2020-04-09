<template>
    <div class="distributionUserInfo">
        <div class="userInfo bg-white fontS14">
            <div class="fontS16 mar_bottom">基本信息</div>
            <el-row :gutter="20" class="info_item">
                <el-col :span="8">
                    <div><span>用户ID：</span> <span>{{userInfo.user_id}}</span></div>
                </el-col>
                <el-col :span="8">
                    <div><span>用户名：</span> <span>{{userInfo.user_data.name}}</span></div>
                </el-col>
                <el-col :span="8"><div><span>手机号：</span> <span>{{userInfo.user_data.mobile}}</span></div></el-col>
            </el-row>

            <el-row :gutter="20" class="info_item">
                <el-col :span="8">
                    <div><span>用户类型：</span> <span>{{userInfo.user_data.company?'企业':'个人'}}</span></div>
                </el-col>
            </el-row>

            <div class="border-width mar_bottom">
                <el-row :gutter="20" class="info_item">
                    <el-col :span="8">
                        <div><span>一级好友数：</span> <span>{{userInfo.lower_friends_count}}</span></div>
                    </el-col>
                    <el-col :span="8">
                        <div><span>二级好友数：</span> <span>{{userInfo.bottom_friends_count}}</span></div>
                    </el-col>
                </el-row>

                <el-row :gutter="20" class="info_item">
                    <el-col :span="8">
                        <div><span>一级累计消费：</span> <span>{{userInfo.lower_friends_money | fixedMoney}}</span></div>
                    </el-col>
                    <el-col :span="8">
                        <div><span>二级累计消费：</span> <span>{{userInfo.bottom_friends_money | fixedMoney}}</span></div>
                    </el-col>
                    <el-col :span="8">
                        <div><span>好友累计消费：</span> <span>{{(userInfo.lower_friends_money+userInfo.bottom_friends_money) | fixedMoney }}</span></div>

                    </el-col>
                </el-row>

                <el-row :gutter="20" class="info_item">
                    <el-col :span="8">
                        <div><span>一级返利：</span> <span>{{userInfo.lower_friends_distribution | fixedMoney}}</span></div>
                    </el-col>
                    <el-col :span="8">
                        <div><span>二级返利：</span> <span>{{userInfo.bottom_friends_distribution |fixedMoney}}</span></div>
                    </el-col>
                    <el-col :span="8">
                        <div><span>累计返利：</span> <span>{{userInfo.total_distribution | fixedMoney}}</span></div>
                    </el-col>
                </el-row>
            </div>


            <el-row :gutter="20" class="info_item">
                <el-col :span="8">
                    <div><span>已提现金额：</span> <span>{{userInfo.has_withdrawal | fixedMoney}}</span></div>
                </el-col>
                <el-col :span="8">
                    <div><span>可提现金额：</span> <span>{{userInfo.last_withdrawal| fixedMoney}}</span></div>
                </el-col>
                <el-col :span="8">
                    <div><span>本月剩余提现次数：</span> <span>{{userInfo.withdrawal_times}}</span></div>
                </el-col>
            </el-row>

            <el-row :gutter="20" class="info_item">
                <el-col :span="8">
                    <div><span>提现账户：</span> <span>1234225436555555343</span></div>
                </el-col>
                <el-col :span="8">
                    <div><span>绑定手机号：</span> <span>1234225436555555343</span></div>

                </el-col>
                <el-col :span="8">
                    <div><span>绑定人姓名：</span> <span>1234225436555555343</span></div>
                </el-col>
            </el-row>

        </div>
    </div>
</template>

<script>
    import { format_objKey } from "@/utils/methods";
    import { getDistributionUserInfo } from "@/api/distribution";
    export default {
        name: "distributionUserInfo",
        data(){
            return{
                userInfo: {
                    user_id:'',
                    user_data:{
                        name:'',
                    }
                },
            }
        },
        created(){
            this.getInfo();
        },
        methods:{
            getInfo(){
                this.userInfo.user_id=this.$route.query.user_id;
                let dataObj = format_objKey(Object.assign({}, this.userInfo));
                getDistributionUserInfo('get',dataObj).then(res=>{
                    this.userInfo={
                        ...res.data.data,
                        ...res.data.data.distribution_data
                    }
                })
            }
        }

    }
</script>

<style scoped lang="less">
    .distributionUserInfo{
        .userInfo{
            padding: 24px 32px 32px;
            margin: 24px;
            .info_item{
                margin-bottom: 16px;
                color:rgba(0,0,0,0.65);

            }
            .border-width{
                border-top: 1px solid #E8E8E8;
                border-bottom: 1px solid #E8E8E8;
                padding-top: 16px;
            }
            .mar_bottom{
                margin-bottom: 16px;
            }
        }
    }
</style>