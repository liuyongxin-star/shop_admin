<template>
  <div class="container">
     <app-navbar></app-navbar>
     <app-main></app-main>
  </div>
</template>

<script>
import appNavbar from './appNav.vue'
import appMain from './appMain.vue'
export default {
    components:{
        appNavbar,
        appMain
    }
}
</script>
<style>
body{
    margin: 0;
    padding: 0;
}
    .container{
        display: flex;
    }
    .navBar{
        width: 256px;
        height:100vh;
        overflow-y: auto;
        background-color:#001529 ;
        color: #fff;
        box-shadow:2px 0px 6px 0px rgba(0,21,41,0.55);
        z-index: 999;
    }
    .main{
        width: calc( 100% - 256px );
        height: 100vh;
        overflow-y: auto;
    }
</style>