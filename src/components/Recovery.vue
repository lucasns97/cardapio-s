<template>
  <div class="content__outer">
    <el-row style="margin-left:10px; text-align:center" type="flex" justify="center" :gutter="2">
      <el-col :span="9">
        <h1 class="page-title-main">Recupere sua senha</h1>
        <el-input type="email" placeholder="Email" v-model="form.email" />
        <br />
        <br />
        <br />
        <div>
          <el-button @click="recoverPassword" type="primary" :loading="loading">Recuperar Senha</el-button>
        </div>
        <span>
          ou retorne ao
          <router-link to="/login">login.</router-link>
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Recovery",
  data() {
    return {
      form: {
        email: '',
      },
      loading: false,
    };
  },
  methods: {
    recoverPassword() {
      var auth = firebase.auth();
      var emailAddress = this.form.email;
      this.loading = true;
      auth.sendPasswordResetEmail(emailAddress).then(() => {
        this.$message({type: 'success', message: 'A mensagem de recuperação de senha foi enviado ao seu email.'});
        this.loading = false;
        this.$router.replace("/login");
      }).catch(() => {
        this.$message({type: 'info', message: 'O email de confirmação não foi enviado, aconteceu algo inesperado.'});
        this.loading = false;
      });
    }
  }
};
</script>

<style scoped>

span {
  display: block;
  margin-top: 20px;
  font-size: 11px;
}

</style>