<template>
    <div class="shopDecoration">
        <div class="detail_content bg-white color85 fontS14" style="min-height: 673px">
            <div class="fontS16 fontW500 mar_bottom">装修信息</div>
            <div class="color65">店家宣传图：</div>
            <div class="propaganda_img">
                <img :src="store_detail.advertising_img" alt="">
            </div>
            <div class="color65">公司简介：</div>
            <div class="brief_img">
                <img :src="store_detail.company_detail" alt="">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "shopDecoration",
        data(){
            return{

            }
        },
        props:['store_detail'],

    }
</script>

<style scoped lang="less">
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
</style>