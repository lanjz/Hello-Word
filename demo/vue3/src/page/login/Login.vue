<template>
  <div class="login-wrap">
    <div class="login-form">
      <div class="title"></div>
      <div class="form-wrap">
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="50px">
          <el-form-item label="账号" prop="username">
            <el-input v-model="loginForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
                class="login-btn"
                type="primary"
                :loading="isLoading"
                @click="submitForm('loginForm')"
            >提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      rules: {
        username: [ { required: true, message: '请输入账号', trigger: 'blur' } ],
        password: [ { required: true, message: '请输入密码', trigger: 'blur' } ],
      },
      isLoading: false
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isLoading = true
          alert('submit!');
          this.$router.push('/home')
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped lang="scss">
.login-wrap{
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  .login-form{
    position: absolute;
    right: 15vw;
    top: 50%;
    width: 380px;
    transform: translateY(-50%);
    border-radius: 2px;
    background: #fff;
    overflow: hidden;
  }
  .title{
    width: 100%;
    line-height: 80px;
    text-align: center;
    font-size: 20px;
    color: #333;
    border-bottom: 1px solid #e9eaec;
    margin-bottom: 30px;
  }
  .form-wrap{
    padding: 0 40px;
  }
  .login-btn{
    width: 100%;
  }
}
</style>