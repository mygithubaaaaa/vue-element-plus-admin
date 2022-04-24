<template>
  <div class="login-container">
    <el-form
      ref="refForm"
      :model="registerForm"
      :rules="registerRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">注册</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="registerForm.username"
          placeholder="用户名，建议用学号"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="phone">
        <span class="svg-container">
          <svg-icon icon-class="phone" />
        </span>
        <el-input
          ref="phone"
          v-model="registerForm.phone"
          placeholder="手机号"
          name="phone"
          type="text"
          tabindex="3"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="email" />
        </span>
        <el-input
          v-model="registerForm.email"
          placeholder="电子邮箱"
          name="email"
          type="text"
          tabindex="4"
          auto-complete="on"
        />
      </el-form-item>

      <el-button
        :loading="registerButtonLoading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.prevent="handleRegister"
      >注册
      </el-button>
      <el-button
        type="primary"
        style="width:100%;margin-bottom:30px;margin-left: 0"
        @click.prevent="toLogin"
      >去登陆
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { reactive, ref, toRef, nextTick, watch } from 'vue'
// import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { register } from '@/api/user'
import router from '@/router'
export default {
  name: 'Register',
  setup () {
    // const router = useRouter()
    const route = useRoute()
    // const store = useStore()
    const password = ref(null)
    const refForm = ref(null)
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('密码不能少于8位数字'))
      } else {
        callback()
      }
    }

    const state = reactive({
      registerForm: {
        username: '',
        password: '',
        phone: '',
        email: '',
        group: ''
      },
      registerRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      registerButtonLoading: false,
      passwordType: 'password',
      redirect: undefined
    })
    const registerForm = toRef(state, 'registerForm')
    const registerRules = toRef(state, 'registerRules')
    const registerButtonLoading = toRef(state, 'registerButtonLoading')
    const passwordType = toRef(state, 'passwordType')
    const redirect = toRef(state, 'redirect')
    const showPwd = () => {
      if (passwordType.value === 'password') {
        passwordType.value = ''
      } else {
        passwordType.value = 'password'
      }
      nextTick(() => {
        password.value.focus()
      })
    }
    watch(route, (routes) => {
      redirect.value = routes.query && routes.query.redirect
    })
    const handleRegister = async () => {
      refForm.value.validate(valid => {
        if (valid) {
          registerButtonLoading.value = true
          register(this.registerForm).then(() => {
            router.push({ path: this.redirect || '/login' })
            registerButtonLoading.value = false
          }).catch((e) => {
            registerButtonLoading.value = false
            console.log(e)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
    const toLogin = () => {
      router.push({ path: '/login' })
    }
    return {
      registerForm,
      registerRules,
      refForm,
      passwordType,
      redirect,
      registerButtonLoading,
      showPwd,
      handleRegister,
      toLogin,
      password
    }
  }

}
</script>

<style lang="scss">
$bg: #ffffff;
$light_gray: rgb(0, 0, 0);
$cursor: rgb(0, 0, 0);

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(94, 94, 94, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #e6e6e670;
$dark_gray: #889aa4;
$light_gray: rgba(238, 238, 238, 0.63);

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: absolute;
    width: 480px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    padding: 45px 35px 60px 35px;
    border-radius: 10px;
    margin: 0 auto;
    background-color: rgb(255, 255, 255);
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: rgb(0, 0, 0);
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #202020;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
