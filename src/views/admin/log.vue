<template>
    <div class="box">
    <div class="login">
    <!-- 双向绑定  (绑定到数组里)              正则验证       ref和refs绑定                 -->
<el-form :model="loginForm" :rules="rules" ref="logref" label-width="100px" class="demo-loginForm">
  <el-form-item label="用户名" prop="username">
      <!--       双向绑定到数组里的username       -->
    <el-input v-model="loginForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password" >
      <!-- 双向绑定到数组里的password -->
    <el-input v-model="loginForm.password" @keyup.enter.native="login"></el-input>
  </el-form-item>

  <el-form-item>
      <!-- 调用登录 -->
    <el-button type="primary" @click="login">登录</el-button>
    <!-- 调用重置 -->
    <el-button @click="resetLoginForm">重置</el-button>
  </el-form-item>
</el-form>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
loginForm: {
    // 测试用 默认密码
          username: 'admin',
          password: '123456',
        },
        rules: {
            // 正则判断
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 5, max: 6, message: '长度在 5 到 6 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 7, message: '长度在 6 到 7 个字符', trigger: 'blur' }
          ],
        }
      };
    },
    methods: {
    l(){
console.log("艾呀")
    },
 login() {
    //  ref绑定的数值 用$refs.数值使用   async 异步  validate是element的表单校验方法
        this.$refs.logref.validate(async valid => {
            // 不是valid 就不执行之后的
          if(!valid) return
        //   上传用户名和密码到login地址中 基础地址在amin中
          const {data:res} = await this.$axios.post('login',this.loginForm)
          console.log(res)
        //   如果状态不等于200 则返回登录失败 并不执行以下代码，否之 这条就当不存在
        if(res.meta.status !==200)return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 登录成功后吧token保存在本地sessionStirage中
        window.sessionStorage.setItem('token',res.data.token)
        // 跳转
        this.$router.push('/home')
        });
      },

      resetLoginForm() {
        //   resetFields是element的重置方法
        this.$refs.logref.resetFields();
      }
    },

computed:{},

watch:{},

};

</script>

<style scoped>
.box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
}
.login {
  width: 30%;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  padding: 5px 15px;
  border-radius: 5px;
  box-shadow: 1px 3px 6px rgba(80, 80, 80, 0.8);
}
</style>
