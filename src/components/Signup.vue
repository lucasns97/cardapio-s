<template>
  <div class="content__outer">
    <el-row style="margin-left:10px; text-align:center" type="flex" justify="center" :gutter="2">
      <el-col :span="9">
        <h1 class="page-title-main">Crie uma nova conta</h1>
        <el-input type="name" placeholder="Nome" v-model="form.nome" />
        <br />
        <br />
        <el-input type="email" placeholder="Email" v-model="form.email" />
        <br />
        <br />
        <el-input type="password" placeholder="Senha" id="psw1" v-model="form.senha"/>
        <i class="el-icon-view" v-on:click="togglePassword"></i>
        <br />
        <br />
        <el-input @change.native="verifyPassword" type="password" placeholder="Confirme a senha" id="psw2" v-model="form.senhaVerify"/>
        <span v-if="!this.passwordsVerified" style="color: red; font-size: 15px; opacity: 0.7">
          Cuidado, as senhas não coincidem.
        </span>
        <br />
        <br />
        <br />
        <div>
          <el-button @click="signUp" type="primary" :loading="loading" :disabled="!this.passwordsVerified">Registrar</el-button>
        </div>
        <p>
          <router-link to="/login">ou faça login</router-link>
        </p>
        <span>
          <p style="color: gray">Apenas pessoas autorizadas podem realizar o cadastro.</p>
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import firebase from "firebase";

import { Email } from './../utils/smtp.js'
import { NOREPLY_CREDENTIALS } from './../../settings.js'

export default {
  name: "signUp",
  data() {
    return {
      form: {
        nome: '',
        email: '',
        senha: '',
        senhaVerify: '',
      },
      loading: false,
      passwordsVerified: true,
    };
  },
  methods: {
    togglePassword() {
      var psw1 = document.getElementById("psw1");
      var psw2 = document.getElementById("psw2");
      if (psw1.type === "password") {
        psw1.type = "text";
        psw2.type = "text";
      } else {
        psw1.type = "password";
        psw2.type = "password";
      }
    },
    verifyPassword() {
      if (this.form.senha == this.form.senhaVerify) {
        this.passwordsVerified = true
      }
      else {
        this.passwordsVerified = false
      }
    },
    enviarVerificacaoEmail(user) {
      user.sendEmailVerification().then(function() {
      }).catch(() => {
        this.$message.error('O email de confirmação não foi enviado, aconteceu algo inesperado.');
      });
    },
    enviarEmailAcompanhamento(userEmail, userName, userUid) {
      // Envia email para equipe do DM informando novo usuário

      let subject = `[CITYDATAHUB - Novo Usuário] - ${userEmail}`

      let body = '<h3>[NOVO USUÁRIO] Mensagem recebida pelo painel <a href="https://sp.citydata.datamachina.com.br/" target="_blank">CityData Hub</a>:</h3><hr/>'
      body += `<p><b>Email</b>: ${userEmail}</p>`
      body += `<p><b>Nome</b>: ${userName}</p>`
      body += `<p><b>UID</b>: ${userUid}</p>`
      body += '<hr/><b>Porfavor, não responda à este email.</b>'
      
      Email.send({
        Host: "smtp.gmail.com",
        Username : NOREPLY_CREDENTIALS.email,
        Password : NOREPLY_CREDENTIALS.password,
        To : ['funil@datamachina.com.br'],
        From : NOREPLY_CREDENTIALS.email,
        Subject : subject,
        Body : body,
      }).then(message => {
        // console.log('EMAIL ENVIADO')
      }).catch((e) => {console.error(e)})
    },
    signUp() {
      var self = this;
      self.loading = true;
      firebase.auth()
        .createUserWithEmailAndPassword(this.form.email, this.form.senha)
        .then((user) => {
            self.loading = false;
            // modify display name
            if(firebase.auth().currentUser){
              firebase.auth().currentUser.updateProfile({
                displayName: this.form.nome// some displayName,
              }).then(() => {})
                .catch(function(error) {
                  console.error("Erro ao atualizar nome: ", error);
              });
            };
            this.enviarVerificacaoEmail(firebase.auth().currentUser);

            var uid = firebase.auth().currentUser.uid;
            var email = firebase.auth().currentUser.email;
            var name = this.form.nome;

            this.enviarEmailAcompanhamento(email, name, uid)

            var db = firebase.firestore();
            self.$router.replace("/login");
            this.$message({type: 'success', message: 'Cadastro efetuado com sucesso! Confirme o cadastro em seu email antes de fazer seu primeiro acesso.', showClose: true, duration: 999999});

            db.collection(this.$USER_DASH_DB_NAME)
              .doc(uid)
              .set({email: email,
                    display_name: name, 
                    ts: new Date(),
                    first_access: true,
                    calibrador: {
                      Wn: self.$CALIBRADOR_STANDARD_WEIGHTS.Wn, 
                      weights: self.$CALIBRADOR_STANDARD_WEIGHTS.mapWeights, 
                      maxmin: self.$CALIBRADOR_STANDARD_WEIGHTS.maxmin
                    }}, {merge: true})
              .then(function() {
                console.log("Documento escrito com sucesso!");
              })
              .catch((error) => {
                this.$message.error({message: 'Ocorreu um erro inesperado no cadastro: ' + error, duration: 7000});
              });
          },
          error => {
            self.loading = false;
            this.$message.error({message: 'Ocorreu um erro inesperado no cadastro: ' + error, duration: 7000});
          }
        );
    }
  }
};
</script>

<style scoped>

p {
  margin-top: 40px;
  font-size: 13px;
}
p a {
  text-decoration: underline;
  cursor: pointer;
}

</style>