<template>
    <div class="distributionUserDetail">
        <my-tab class="my-tab" :tabList="tabLsit" :currentView="currentView" @tabClick="tabClick"></my-tab>
        <user-info v-if="currentView==='base_info'"></user-info>
        <user-invite v-if="currentView==='invite_detail'"></user-invite>
        <user-rebate v-if="currentView==='rebate_detail'"></user-rebate>

    </div>
</template>

<script>
    import myTab from "@/components/myTab.vue";
    import userInvite from "@/views/distribution/component/distributionUserInvite"
    import userRebate from "@/views/distribution/component/distributionUserRebate"
    import userInfo from "@/views/distribution/component/distributionUserInfo"
    export default {
        name: "distributionUserDetail",
        components: {
            myTab,
            userInvite,
            userRebate,
            userInfo
        },
        data(){
            return{
                tabLsit: [
                    {
                        label: "基本信息",
                        name: "base_info"
                    },
                    {
                        label: "邀请明细",
                        name: "invite_detail"
                    },
                    {
                        label: "返利明细",
                        name: "rebate_detail"
                    }
                ],
                currentView: "base_info", //默认显示的tab项

            }
        },
        methods:{
            tabClick(curTab) {
                this.currentView = curTab;
            },

        }
    }
</script>

<style scoped>

</style>