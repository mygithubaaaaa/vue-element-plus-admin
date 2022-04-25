<template>
  <div class="login-container">
    <el-form
      ref="refForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">登陆</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
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
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loginButtonLoading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.prevent="handleLogin"
      >登陆
      </el-button>
      <el-button
        :loading="registerButtonLoading"
        type="primary"
        style="width:100%;margin-bottom:30px;margin-left: 0"
        @click="toRegister"
      >去注册
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { validatePassword, validateUsername } from '@/utils/validate'
import { reactive, ref, toRef, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
export default {
  name: 'Login',
  setup () {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const password = ref(null)
    const refForm = ref(null)
    const state = reactive({
      loginForm: {
        username: 'admin',
        password: '11111111'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loginButtonLoading: false,
      registerButtonLoading: false,
      passwordType: 'password',
      redirect: undefined
    })
    const loginForm = toRef(state, 'loginForm')
    const loginRules = toRef(state, 'loginRules')
    const loginButtonLoading = toRef(state, 'loginButtonLoading')
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
    const handleLogin = async () => {
      refForm.value.validate(valid => {
        if (valid) {
          loginButtonLoading.value = true
          store.dispatch('user/login', loginForm.value).then(() => {
            router.push({ path: redirect.value || '/' })
            loginButtonLoading.value = false
          }).catch(() => {
            loginButtonLoading.value = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
    const toRegister = () => {
      router.push({ path: '/register' })
    }
    return {
      loginForm,
      loginRules,
      refForm,
      passwordType,
      redirect,
      loginButtonLoading,
      registerButtonLoading,
      toRegister,
      showPwd,
      handleLogin,
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
