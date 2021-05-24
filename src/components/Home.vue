<template>
  <el-container class="home-container">
    <!--头部区域 -->
  <el-header>
    <div>
      <img src="../assets/picture/heima.png" alt="">
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="logout()">退出</el-button></el-header>
  <!-- 页面主体区域 -->
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="$store.state.isCollapse ? '64px':'200px'" style="transition:all 0.5s">
      <div class="toggie-button" @click="toggieColleaspe()">|||</div>
      <Aside></Aside>
      </el-aside>
    <!-- 右边内容主体 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>

</template>

<script>
import Aside from './Home/aside'
export default {
   methods:{
     logout(){
       window.sessionStorage.clear()
       this.$router.replace('/login')
     },
     toggieColleaspe(){
       this.$store.commit('IsCollaspe');
     }
   },
   components:{
     Aside
   }
}
</script>

<style lang="less" scoped>
   .home-container{
     height: 100%;
   }
   .el-header{
     background-color: #373d41;
     display: flex;
     justify-content: space-between;
     padding-left: 0;
     align-items: center;
     color:#fff;
     font-size: 20px;
     >div{
       display: flex;
       align-items: center;
       span{
         margin-left: 15px;
       }
     }
   }
   .el-aside{
     background-color: #333744;
   }
   .el-main{
     background-color: #eaedf1;
   }
   .toggie-button{
     background-color: #4A5064;
     font-size: 10px;
     line-height: 24px;
     color:#fff;
     text-align: center;
   }
</style>