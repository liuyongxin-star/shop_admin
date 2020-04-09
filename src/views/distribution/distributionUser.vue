<template>
    <div>
        <my-tab class="my-tab" :tabList="tabLsit" :currentView="currentView" @tabClick="tabClick"></my-tab>
        <ordinary-users v-if="currentView==='ordinary_user'"></ordinary-users>
        <internal-sales v-if="currentView==='internal_sales'"></internal-sales>
    </div>
</template>

<script>
    import myTab from "@/components/myTab.vue";
    import ordinaryUsers from '@/views/distribution/component/ordinaryUsers'
    import internalSales from '@/views/distribution/component/internalSales'
    export default {
        components: {
            myTab,
            ordinaryUsers,
            internalSales
        },
        data() {
            return {
                tabLsit: [
                    {
                        label: "普通用户",
                        name: "ordinary_user"
                    },
                    {
                        label: "内部销售",
                        name: "internal_sales"
                    }
                ],
                currentView: "ordinary_user", //默认显示的tab项
            };
        },
        methods: {
            tabClick(curTab) {
                this.currentView = curTab;
            },

        }
    };
</script>

<style scoped>


</style>