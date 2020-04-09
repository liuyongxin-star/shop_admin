<template>
  <div class="login">
    <!--登录框-->
    <div class="loginform">
      <div class="login_container">
        <div class="title">登录</div>
        <!--登录表单-->
        <el-form
          class="loginform"
          ref="loginForm"
          :model="loginForm"
        >
        
          <el-alert
            v-show="showalert"
            :title="alert_title"
            type="warning"
            show-icon
            :closable="false"
          ></el-alert>
          <el-form-item prop="mobile">
            <el-input
              type="text"
              class="mobile"
              v-model="loginForm.mobile"
              @keyup.native="val => checkValue(val, 'mobile')"
              maxlength="11"
              placeholder="请填写11位手机号"
            >
              <template slot="prepend">中国+86</template>
            </el-input>
          </el-form-item>
          <el-form-item
            prop="password"
            class="password"
          >
            <el-input
              :type="pwdType"
              v-model="loginForm.password"
              placeholder="请填写密码"
              @keyup.enter.native="doLogin"
              maxlength="20"
            ><i
                slot="suffix"
                :class="pwdType?'iconfont icon-biyan':'iconfont icon-open-eye'"
                @click="changPassword"
              ></i>
            </el-input>
          </el-form-item>
          <el-form-item size="large">
            <el-button
              class="login-btn"
              @click="doLogin"
              :loading="loading"
            >登 录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
const phone = /^[1][3,4,5,7,8][0-9]{9}$/
const verificationCode = /^[0-9]{6}$/
import { doLogin } from '@/api/login'
import { setMobile,removeMobile,removeSessionToken} from '@/utils/auth'
export default {
  data() {
    return {
      loading: false,
      pwdType: 'password', //密码类型
      alert_title: '',
      showalert: false,
      //登录表单
      loginForm: {
        mobile: '',
        password: '',
      }
    }
  },
  created() {
   removeMobile()
   removeSessionToken()
  },
  methods: {
    //验证
    valiadte() {
        if (!this.loginForm.mobile) {
          this.showalert = true
          this.alert_title = '手机号不能为空'
        } else if (!this.loginForm.password) {
          this.showalert = true
          this.alert_title = '密码不能为空'
        } else if (!phone.test(this.loginForm.mobile)) {
          this.showalert = true
          this.alert_title = '请填写正确的11位手机号'
        } else {
          this.showalert = false
          return true
        }
    },
    //登录
    doLogin() {
      if (this.valiadte()) {
        let params = Object.assign({}, this.loginForm)
        params.password = this.$md5(params.password)
        //勾选保持登录时 存localstorage
          this.loading = true
          return this.$store
            .dispatch('login', params)
            .then(res => {
              setMobile(params.mobile)
              this.$router.push({ path: '/' })
              this.loading = false
              this.$message.success('登录成功～')
            })
            .catch(err => {
              console.error(err)
              this.showalert = true
              this.alert_title = err.data.msg
              this.loading = false
            })
      }
    },
    //数字转换
    checkValue(value, key) {
      return this.$set(
        this.loginForm,
        key,
        this.loginForm[key].replace(/\D/g, '')
      )
    },
    //密码可见
    changPassword() {
      this.pwdType === 'password'
        ? (this.pwdType = '')
        : (this.pwdType = 'password')
    }
  }
}
</script>

<style scoped lang="less">
.icon-open-eye,
.icon-biyan {
  font-size: 14px;
  padding-right: 10px;
}
@loginContainerWidth: 420px;
.login {
  margin: 0;
  width: 100%;
  height: 520px;
  background-image: url(../../assets/pic_login_password.png);
  position: relative;
}
.login_container {
  border: 1px solid black;
  width: @loginContainerWidth;
  height: 400px;
  position: absolute;
  top: 60px;
  bottom: 60px;
  right: 391px;
  margin: 0 auto;
  background: #ffffff;
  position: absolute;
  top: 60px;
  bottom: 60px;
  right: 391px;
}
.title{
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #fe5f23;
  height: 64px;
  line-height: 64px;
  border-bottom: 1px solid #DCDFE6;
}
.login_container /deep/.el-form {
  width: 420px;
  margin-top:55px;
}
.login_container /deep/.el-form-item {
  margin-left: 40px;
  display: inline-block;
}
.login_container /deep/.el-form-item__content {
  width: 340px;
}
/deep/.el-input__inner:hover {
  border-color: #e9e9e9;
}

/deep/.el-input__inner:focus {
  border-color: #e9e9e9;
}

.verificationCode /deep/.el-input {
  width: 202px;
  margin-right: 10px;
}
.verificationCode /deep/.el-button {
  width: 128px;
  padding: 12px 14px;
  color: #fe5f23;
  border: 1px solid #fe5f23;
}
.auto {
  float: left;
}
.auto /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #fe5f23;
}
.auto /deep/.el-checkbox__inner:hover {
  border-color: #fe5f23;
}
.auto /deep/.el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #c0c4cc;
}
.auto /deep/.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #fe5f23;
  border-color: #fe5f23;
}
.forget {
  float: right;
  margin-right: 30px;
  color: #303133;
}
.register {
  float: right;
  color: #303133;
}
.login-btn {
  width: 340px;
  height: 40px;
  background-color: #fe5f23;
  color: #ffffff;
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
}
@colorOrange: #fa6400;
.login {
  /deep/.el-tabs__header {
    margin-bottom: 45px;
  }
  /deep/.el-form-item {
    margin-bottom: 25px;
    &.forget_register,
    &.auto {
      .el-form-item__content {
        line-height: initial;
      }
    }
  }
  /deep/.el-tabs__item {
    position: relative;
    height: 64px;
    line-height: 64px;
    width: @loginContainerWidth / 2 - 1;
    text-align: center;
    font-size: 18px;
    &:nth-child(2):after {
      content: '';
      position: absolute;
      display: block;
      width: 1px;
      height: 33px;
      background-color: #e4e7ed;
      right: 0px;
      top: 20px;
    }
    &.is-active,
    &:hover {
      color: @colorOrange;
    }
  }
  /deep/.el-tabs__active-bar {
    display: none;
  }
  /deep/.el-alert {
    height: 25px;
    width: 340px;
    position: absolute;
    top: 88px;
    left: 39px;
  }
}
</style>