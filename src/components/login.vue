<template>
  <div class="login_container">
      <div class="login_box">
          <!-- 头像区域 -->
          <div class="avater_box">
              <img src="../assets/picture/touxiang.jpeg" alt="">
          </div>
           <!-- 表单区域 -->
          <el-form  ref="loginFormres" label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules">
              <!-- 用户名 -->
            <el-form-item prop="username">
              <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <!-- 按钮区域 -->
            <el-form-item class="btns">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="resetloginForm">重置</el-button>
            </el-form-item>
          </el-form>
      </div>
  </div>
</template>

<script>
export default {
   data(){
       return {
           loginForm:{
              username:'admin',
              password:'123456'
           },
           //注册验证
           loginFormRules:{
               username:[
                   { required: true, message: '请输入登录名称', trigger: 'blur' },
                   { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur'}
               ],
               password:[
                   { required: true, message: '请输入密码', trigger: 'blur' },
                   { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
               ]
           }
       }
   },
   methods:{
       resetloginForm(){
           this.$refs.loginFormres.resetFields();
        // console.log(this);
       },
       login(){
           this.$refs.loginFormres.validate(async valid=>{
               if(!valid) return;
               const {data:res}=await this.$http.post('login',this.loginForm);
               if(res.meta.status!==200) return this.$message.error('用户登陆失败！');
               this.$message.success('用户登陆成功！');
               console.log(res);
               window.sessionStorage.setItem("token",res.data.token);
               this.$router.push('/home');
           })
       }
   }
}
</script>

<style   lang="less" scoped>
  .login_container{
      background-color: #2b4b6f;
      height: 100%;
  }
  .login_box{
      width:450px;
      height: 300px;
      background-color: #fff;
      border-radius: 3px;
      position: absolute;
      left:50%;
      top:50%;
      transform: translate(-50%,-50%);

      .avater_box{
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left:50%;
      transform: translate(-50%,-50%);
      background-color: #fff;
      img{
          width:100%;
          height: 100%;
          border-radius: 50%;
      }
    }
    .btns{
        display:flex;
        justify-content: flex-end;
    }
  }
  .login_form{
      position: absolute;
      bottom:0px;
      width:100%;
      padding: 0 10px;
      box-sizing: border-box;
  }
</style>