<template>
  <div class="content__outer" id="not-verified-content__outer">
    <el-row type="flex" justify="center" :gutter="2">
      <el-col>
        <h1 class="page-title-main">OPS!</h1>
        <h2 class="page-subtitle-main">Parece que seu email ainda não foi verificado.</h2>
        <br />
        <br />
        <div>
          <el-button @click="resendEmail" type="primary" :loading="loading"><i class="material-icons" id="el-button-icon">email</i> Reenviar confirmação de email</el-button>
        </div>
        <br />
        <span>
          ou retorne ao
          <router-link to="/login">login.</router-link>
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.content__outer#not-verified-content__outer{
  margin-bottom: 100px;
}

</style>

<script>
import firebase from "firebase";

export default {
  name: "EmailNotVerified",
  components: {},
  props: ["user"],
  data() {
    return {
      loading: false,
    };
  },
  computed: {},
  mounted() {},
  methods: {
    errorHandler() {
      return true;
    },
    resendEmail() {
      this.loading = true;
      var user = firebase.auth().currentUser;
      user.sendEmailVerification().then(() => {
        this.$message({type: 'success', message: 'O email de confirmação foi reenviado com sucesso.'});
        this.loading = false;

      }).catch((e) => {
        this.$message({type: 'info', message: 'O email de confirmação não foi enviado, aconteceu algo inesperado. Tente novamente em alguns minutos.'});
        this.loading = false;
      });
    },
  }
};
</script>
