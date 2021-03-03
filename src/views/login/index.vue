<template>
  <section class="login">
    <div class="login-container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

        <div class="title-container">
          <h3 class="title">Cardápio's</h3>
        </div>

        <el-form-item prop="email" name="email">
          <el-input 
            ref="email"
            v-model="loginForm.email"
            placeholder="Email"
            name="email"
            type="email"
            auto-complete="on"
            >
            <template slot="prepend"><i class="el-icon-user-solid"></i></template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password" name="password">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
            >
            <i
              class="show-pass-icon el-icon-view el-input__icon"
              slot="suffix"
              @click="showPwd">
            </i>
            <template slot="prepend"><i class="el-icon-lock"></i></template>
          </el-input>
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:10px;" @click.native.prevent="handleLogin">Login</el-button>

      </el-form>
    </div>
  </section>
</template>

<script>
import { validEmail } from '@/utils/validate'

// Firebase
import firebase from 'firebase'

export default {
  name: 'Login',
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('Insira um email válido.'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('Senha muito curta, deve conter mais de 6 dígitos.'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        email: '',
        password: ''
      },
      loginRules: {
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.loading = true;
      var that     = this;

      this.$refs.loginForm.validate(valid => {
        if (valid) {
          firebase
            .auth()
            .signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password)
            .then(data => {
              that.loading = false;
              this.$router.replace({ path: "/" });
            })
            .catch(err => {
              this.error = err.message;
              this.$message({type: 'error', message: 'Credenciais inválidas, tente novamente.'});
              that.loading = false;
            });
        } else {
          that.loading = false;
          return false
        }
      })
    }
  }
}
</script>


<style scoped>

  .title {
    opacity: 0.8;
    font-size: 25px;
  }

  .show-pass-icon {
    cursor: pointer;
    color: rgb(92, 66, 17);
  }

  .login-container {
    text-align: center;
    width: 100vw;
    height: 100vh;
    background: #6C7A89;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center
  }

  .login-form {
    width: 300px;
    height: 300px;
    background: #fff;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0px 5px orange;
  }

  body {
    margin: 0px;
  }
</style>

</style>