<template>
    <section>
        <el-button :type="this.type" @click="dialogVisible = true" primary><i class="material-icons" id="el-button-icon">{{ this.icon }}</i> {{ this.displayText }}</el-button>
        <el-dialog
            :title="titleObj[updateScope]"
            :visible.sync="dialogVisible"
            width="500px"
            :before-close="handleClose">
            <el-row style="line-height: 150px">
              <el-avatar v-if="user.avatar" class="user-avatar" :size="140" :src="user.avatar" @error="errorHandler"></el-avatar>
              <i v-else class="material-icons" id="user-avatar-default-big">account_circle</i>
            </el-row>
            <hr/>
            <el-row>
                <p><i class="material-icons" id="form-icon">mail</i> Email</p>
                <el-input class="verification-input" type="email" placeholder="Digite seu email" v-model="form.email" autocomplete="off"/>
                <p><i class="material-icons" id="form-icon">lock_open</i> Senha</p>
                <el-input class="verification-input" id="userInput" type="password" placeholder="Digite sua senha" v-model="form.senha" />
                <i class="el-icon-view" v-on:click="togglePassword"></i>
                <div v-if="this.updateScope == 'name'">
                  <p><i class="material-icons" id="form-icon">account_circle</i> Novo nome</p>
                  <el-input class="verification-input" type="text" placeholder="Digite o novo nome" v-model="form.nome" />
                </div>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" type="danger" plain>Cancelar</el-button>
                <el-button type="primary" @click="this.authenticate" :loading="loading">Confirmar</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<style scoped>

.verification-input {
  width: 80%;
}

.material-icons#form-icon {
  vertical-align: middle;
  font-size: 20px;
}

p {
  margin: 20px;
  text-align: left;
  padding-left: 25px;
  font-weight: 700;
}

hr {
  border-top: 1px solid whitesmoke;
  border-bottom: 0px;
  margin: 20px;
}

.el-icon-view {
  font-size: 20px;
  margin: 8px;
  padding-top: 4px;
  cursor: pointer;
  position: absolute;
}

.el-icon-view:active  {
  color: blue
}

.material-icons#user-avatar-default-big {
  color: #7FC241;
  font-size: 157px;
  vertical-align: middle;
  line-height: inherit;
  width: inherit;
}

</style>

<script>
import firebase, { auth, firestore } from "firebase";

export default {
  name: "LoginVerification",
  components: {},
  props: ["user", "displayText", "type", "icon", "updateScope"],
  data() {
    return {
      loading: false,
      dialogVisible: false,
      form: {
          email: "",
          senha: "",
          nome: "",
      },
      titleObj: {
        'name': 'Mudança de Nome',
        'password': 'Mudança de Senha',
        'delete': 'Deletar Conta',
      },
      userAuthenticated: false,
    };
  },
  computed: {},
  mounted() {
  },
  methods: {
    togglePassword(){
      /*
      Muda estado do input entre password e text
      */
      var psw = document.getElementById("userInput");
      if (psw.type === "password") {
        psw.type = "text";
      } else {
        psw.type = "password";
      }
    },
    handleClose(done) {
      /*
      Confirmação se deseja fechar a caixa de dialog
      */
    this.$confirm('Quer mesmo cancelar a operação?')
        .then(_ => {
        done();
        })
        .catch(_ => {});
    },
    authenticate() {
      /*
      Faz autenticação com senha e email de usuário conectado; em seguida executa uma das operações: resetPassword, updateName, deleteAccount.
      */
      var user = firebase.auth().currentUser;
      var credential = firebase.auth.EmailAuthProvider.credential(this.form.email, this.form.senha)
      // faz reautenticação com base na senha e email
      this.loading = true;
      user.reauthenticateWithCredential(credential).then((ans) => {
        switch (this.updateScope) {
          case 'password':
            // resetar senha
            this.resetPassword(ans.user)
            break;

          case 'name':
            // atualizar nome
            this.updateName(ans.user)
            break;

          case 'delete':
            // deletar conta
            this.deleteAccount(ans.user)
            break;
        }
        this.loading = false;
        this.dialogVisible = false;
      }).catch(() => {
        this.$message({type: 'warning', message: 'Erro de autenticação, verifique suas credenciais.'});
        this.dialogVisible = true;
        this.loading = false;
      });
    },
    errorHandler() {
      console.log('Erro..')
    },
    resetPassword(user) {
      /*
      Envia um email de reconfiguração de senha ao usuário
      */
      var auth = firebase.auth();
      var emailAddress = user.email;
      auth.sendPasswordResetEmail(emailAddress).then(() => {
        this.$message({type: 'success', message: 'Email enviado com sucesso! Verifique sua caixa de mensagens.'});
      }).catch(() => {
        this.$message({type: 'info', message: 'Aconteceu algum erro inesperado.'});
      });
    },
    updateName(user) {
      /*
      Atualiza o nome do usuário com base no valor inserido no formulário
      */
      // atualiza a base de autenticação
      var self = this;
      user.updateProfile({
        displayName: this.form.nome,
      }).then(() => {
        var db = firebase.firestore();
        // atualiza a coleção users
        db.collection("users")
          .doc(self.user.uid)
          .update({display_name: this.form.nome})
          .then(function() {
            db.collection("users_logs")
              .doc(self.user.uid)
              .update({display_name: self.form.nome})
              .then(() => {}).catch(() => {})
          })
          .catch(function(error) {
            console.error("Erro ao escrever documento: ", error);
          });
        this.$message({type: 'success', message: 'Nome alterado com sucesso! Página será atualizada em instantes.'});
        var sleep = new Promise(resolve => setTimeout(resolve, 3000));
        sleep.then(() => location.reload());
      }).catch(() => {
        this.$message({type: 'info', message: 'Aconteceu algum erro inesperado. Tente novamente mais tarde.'});
      });
    },
    deleteAccount(user) {
      /*
      Deleta permanentemente a conta do usuário
      */
      this.$confirm('Essa ação deletará sua conta permanentemente. Deseja continuar?', 'Atenção!', {
        confirmButtonText: 'Sim',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }).then(() => {
        // remove o usuário da coleção users
        var db = firebase.firestore()
        db.collection("users").doc(user.uid).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
        this.$message({type: 'success', message: 'Conta deletada!'});
        // deleta a conta da base de autenticação
        user.delete();
        // regireciona a página de login
        this.$router.push('/login');  
      }).catch(() => {
        this.$message({type: 'info', message: 'Operação cancelada.'});        
      });
    },
  }
};
</script>



