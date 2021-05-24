<template>
  <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF"
      unique-opened
      :collapse="$store.state.isCollapse"
      :collapse-transition=false
      router
      :default-active="activePath"
      >
      <!-- 一级菜单 -->
      <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
          <!-- 一级菜单的模板区域 -->
        <template slot="title">
            <!-- 一级菜单的图标 -->
          <i :class="iconObj[item.id]"></i>
          <!-- 一级菜单的文本 -->
          <span>{{item.authName}}</span>
          <!-- 二级菜单的模板区域 -->
        </template>
          <el-menu-item 
            :index="'/'+subItem.path"
            v-for="subItem in item.children" 
            :key="subItem.id"
            @click="saveNavState('/'+subItem.path)">
            <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{subItem.authName}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
    </el-menu>
</template>

<script>
export default {
  data(){
    return{
      menuList:[],
      iconObj:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      },
      activePath:''
      }
  },
   created(){
     this.getMenuList();
     this.activePath=window.sessionStorage.getItem('activePath');
   },
   methods:{
     async getMenuList(){
      const {data:res} = await this.$http.get('menus');
      if(res.meta.status!=200) return this.$message.error(res.meta.msg);
      this.menuList=res.data;
      console.log(res);
     },
     saveNavState(activePath){
       window.sessionStorage.setItem('activePath',activePath);
       this.activePath=activePath;
     }
   }
}
</script>

<style lang="less" scoped>
   .iconfont{
     padding-right: 10px;
   }
   .el-menu{
     border-right: none;
   }
</style>