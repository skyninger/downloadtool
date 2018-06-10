<template>
  <div class="bj-wrap">
    <el-tabs class="wrap-box" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="登录系统" name="login">
        <div class="input">
          <span class="name">手机号码：</span>
          <el-input placeholder="请输入11位手机号码" v-model="obj_login.userName" maxlength="11" />
        </div>
        <div class="input">
          <span class="name">登录密码：</span>
          <el-input type="password" placeholder="请输入登录密码" v-model="obj_login.passWord" />
        </div>
        <el-button type="primary" class="button" @click.native="handlerLogin" :loading="isLoginLoad">登录</el-button>
      </el-tab-pane>
      <el-tab-pane label="注册会员" name="register">
        <div class="input">
          <span class="name">手机号码：</span>
          <el-input placeholder="请输入11位手机号码" v-model="obj_register.Mobile" maxlength="11" />
        </div>
        <div class="input">
          <span class="name">设置密码：</span>
          <el-input type="password" placeholder="请输入设置新密码" v-model="obj_register.PassWord" />
        </div>
        <div class="input">
          <span class="name">确认密码：</span>
          <el-input type="password" placeholder="请输入确认新密码" v-model="obj_register.pass2" />
        </div>
        <el-button type="primary" class="button" @click.native="handlerRegister" :loading="isRegisterLoad">注册</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  data () {
    return {
      activeName: 'login',
      obj_login: {
        grant_type: 'password',
        userName: '',
        passWord: ''
      },
      isLoginLoad: false,
      obj_register: {
        Mobile: '',
        PassWord: '',
        pass2: ''
      },
      isRegisterLoad: false
    }
  },
  methods: {
    handlerRegister () {
      if (this.obj_register.PassWord === this.obj_register.pass2) {
        this.isRegisterLoad = true
        this.$http.post('/api/Account/Register', qs.stringify(this.obj_register)).then(response => {
          let objData = response.data
          this.isRegisterLoad = false
          if (objData.IsSuccess) {
            this.$message({
              message: '注册成功',
              type: 'success'
            })
            this.activeName = 'login'
          } else {
            this.$alert(objData.Msg)
          }
        })
      } else {
        this.$alert('输入密码不一致')
      }
    },
    handlerLogin () {
      this.isLoginLoad = true
      this.$http.post('/token', qs.stringify(this.obj_login)).then(response => {
        let objData = response.data
        this.isLoginLoad = false
        if (objData.access_token && objData.token_type) {
          window.author = objData
          window.localStorage['access_token'] = objData.access_token
          window.localStorage['token_type'] = objData.token_type
          window.localStorage['expires_in'] = objData.expires_in
          this.$router.replace({name: 'main'})
        } else {
          this.$alert(objData.error_description)
        }
      }, err => {
        this.isLoginLoad = false
        let objData = err.response.data
        console.log(err.response)
        this.$alert(objData.error_description)
      })
    },
    handleClick () {

    }
  }
}
</script>

<style lang="less" scoped>
  .bj-wrap{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: url('~@/assets/images/footer_lodyas.png');
    .wrap-box{
      position: absolute;
      top: 50%;
      left: 50%;
      width: 400px;
      padding: 0 20px 20px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 2px 12px rgba(255, 255, 255, .4);
      transform: translate(-50%, -50%);
      /deep/ .el-tabs__nav{
        width: 100%;
        line-height: 50px;
        .el-tabs__item{
          width: 50%;
          text-align: center;
          font-size: 16px;
        }
      }
      .input{
        margin: 0 0 10px;
        .name{
          line-height: 28px;
          font-size: 14px;
          color: #444;
        }
      }
      .button{
        margin: 20px 0 0;
        display: block;
        width: 100%;
      }
    }
  }
</style>
