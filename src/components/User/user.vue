<template>
  <div>
      <!-- 导航区 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
       </el-breadcrumb>
       <!-- 卡片视图区域 -->
  <el-card>
        <el-row :gutter="20">
          <el-col :span="8">
             <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList()">
             <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
             </el-input>
          </el-col>
          <el-col :span="4">
             <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
        <!-- 用户列表区域 -->
      <el-table
      :data="userList"
      style="width: 100%"
      border
      stripe>
      <el-table-column label="#" type=index></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="abc">
          <el-switch v-model="abc.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="userStateChanged(abc.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="abc">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(abc.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(abc.row.id)"></el-button>
        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable=false>
          <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
        </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  <!-- 添加用户的对话框 -->
  </el-card>
  <el-dialog
  title="添加用户"
  :visible.sync="addDialogVisible"
  width="30%">
  <!-- 内容主体区 -->
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
  <el-button type="warning" @click="addDialogClosed()" class="resetButton">重 置</el-button>
  </el-form>
  <!-- 按钮区 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser()">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改用户的对话框 -->
<el-dialog
  title="修改用户"
  :visible.sync="setDialogVisible"
  width="30%"
  @close="editDialogClose()"
  >
  <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser()">确 定</el-button>
  </span>
</el-dialog>
<!-- 删除对话框 -->
   
  </div>
</template>

<script>
export default {
   data(){
     // 获取列表参数对象
      // 验证邮箱
      var checkEmail = (rules,value,callback)=>{
         const regEmail=/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
         if(regEmail.test(value)){
           return callback();
         }
         callback(new Error('请输入合法邮箱'));
      }
      //验证手机
      var checkMobile = (rules,value,callback)=>{
         const regMobile=/^1[34578]\d{9}$/;
         if(regMobile.test(value)){
           return callback();
         }
         callback(new Error('请输入合法手机'));
      }
     return{
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:5
      },
      userList:[],
      total:0,
      addDialogVisible:false,
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      editForm:{
      },
      addFormRules:{
        username:[{required:true,message:'请输入用户名',trigger:'blur'},
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password:[{required:true,message:'请输入密码',trigger:'blur'},
        { min: 8, max: 15, message: '长度在 8 到 15 个字符', trigger: 'blur' }],
        email:[{required:true,message:'请输入邮箱',trigger:'blur'},
        {validator:checkEmail,trigger:'blur'}],
        mobile:[{required:true,message:'请输入手机',trigger:'blur'},
        {validator:checkMobile,trigger:'blur'}]
      },
      setDialogVisible:false
     }
   },
   created(){
     this.getUserList()
   },
   methods:{
     async getUserList(){
        const{data:res}=await this.$http.get('users',{params:this.queryInfo})
        if(res.meta.status!=200){
          return this.$message.error('获取列表数据失败！')
        }
        this.userList=res.data.users
        this.total=res.data.total
        console.log(res)
     },
     handleSizeChange(newSize){
        console.log(newSize)
        this.queryInfo.pagesize=newSize
        this.getUserList()
     },
     handleCurrentChange(newPage){
       console.log(newPage)
       this.queryInfo.pagenum=newPage
        this.getUserList()
     },
     async userStateChanged(userInfo){
       const{data:res}=await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
       console.log(res);
       if(res.meta.status!=200){
         userInfo.mg_state=!userInfo.mg_state
         return this.$message.error("更新用户失败！")
       }
       this.$message.success("更新用户成功！")
     },
     addDialogClosed(){
        this.$refs.addFormRef.resetFields();
      },
      addUser(){
        this.$refs.addFormRef.validate(async valid=>{
          if(!valid) return 
             const {data:res} = await this.$http.post('users',this.addForm);
             if(res.meta.status!=201){
               return this.$message.error('添加用户失败！') 
             }
             this.$message.success('添加用户成功!')
             this.addDialogVisible=false;
             this.getUserList();
          })
      },
      async showEditDialog(id){
        this.setDialogVisible=true;
        const{data:res}=await this.$http.get('users/'+id);
        console.log(res);
        if(res.meta.status!=200){
          return this.$message.error('查询失败！');
        }
        this.editForm=res.data;
        this.$message.success('查询成功');
      },
      editDialogClose(){
        this.$refs.editFormRef.resetFields();
      },
      editUser(){
        this.$refs.editFormRef.validate(async valid=>{
          if(!valid) return
          const {data:res}=await this.$http.put('users/'+this.editForm.id,this.editForm);
          if(res.meta.status!=200){
               this.$message.error('修改用户失败！') 
             }
             this.$message.success('修改用户成功')
             this.setDialogVisible=false;
             this.getUserList();
        })
      },
      async deleteUser(id){
         const confirmResult=await this.$confirm(
           '此操作将用就删除用户,是否继续？',
           '提示',{
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning'
           }
         ).catch(err=>err);
         if(confirmResult!=='confirm'){
           return this.$message.info('已取消删除！');
         }
         const{data:res}=await this.$http.delete('users/'+id);
         console.log(res);
         if(res.meta.status!==200){
           return this.$message.error('删除用户失败!');
         }
         this.$message.success('删除用户成功！');
         this.getUserList();
      }
   }
}
</script>

<style lang="less" scoped>
   .resetButton{
     position: absolute;
     right: 190px;
     bottom:20px;
   }
</style>

