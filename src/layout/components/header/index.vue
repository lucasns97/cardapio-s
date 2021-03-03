<template>
  <el-header class="header-container" id="my-header">
    <el-row type="flex">
      <el-col>
        <el-breadcrumb class="breadcrumb-container" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="breadcrumb-item" v-for="(route, idx) in $route.matched" :key="idx" :to="{ name: route.name }">{{route.meta.title}}</el-breadcrumb-item>
        </el-breadcrumb>
        
      </el-col>
      <el-col>
        <el-dropdown class="settings-container" @command="handleCommand" @visible-change="handleTrigger" trigger="click">
          <el-button plain class="settings-btn">
            <el-avatar class="settings-profile-picture" shape="square" :size="25" :src="defaultProfileImage"></el-avatar>
            {{userProfile.displayName || "Usuário"}}
            <i :class="iconClass"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item class="settings-dropdown-item" icon="el-icon-s-tools" command="config">Configurações</el-dropdown-item> -->
            <el-dropdown-item class="settings-dropdown-item" icon="el-icon-switch-button" command="logout">Sair</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </el-header>
</template>

<script>

import firebase from "firebase";

export default {
  name: 'Header',
  data() {
    return {
      // User
      userProfile: firebase.auth().currentUser,

      // UX
      iconClass: 'el-icon-arrow-down',
      defaultProfileImage: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
      
      logoText: "Cardápio's",
    }
  },
  created() {
    window.addEventListener("resize", this.handleWindowResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleWindowResize);

  },
  mounted() {},
  watch: {},
  methods: {
    handleCommand(command) {
      if (command === "logout") this.logout()
      if (command === "config") this.settings()
    },
    handleTrigger(active) {
      // Settings Icon
      if (active) this.iconClass = 'el-icon-arrow-up'
      else this.iconClass = 'el-icon-arrow-down'
    },
    handleWindowResize() {
      if (window.innerWidth <= 500) this.logoText = ''
      else this.logoText = 'AutoCrypto'
    },
    handleLogoClick() {
      window.location.replace(window.location.origin);
    },
    logout() {

      var that = this;

      firebase
        .auth()
        .signOut()
        .then(function() {
          // Sign-out successful.
          that.$store.commit("SET_USER", null);
          that.$store.commit("SET_TOKEN", null);
          that.$router.replace("/login");
        })
        .catch(function(error) {
          // An error happened
          alert("Erro ao tentar sair: ", error)
        });
    },

    settings() {
      this.$router.replace('/configuracoes')
    }
  }
}
</script>

<style>
  .header-container {
    text-align: right;
    box-shadow: 0px 2px 2px coral;
    background: white;
    margin-bottom: 4px;
    width: 100%;
    z-index: 1000;
  }

  .settings-container {
    transform: translateY(3px);
    position: fixed;
    right: 5px
  }

  .settings-btn {
    font-size: 18px;
  }

  .settings-profile-picture {
    vertical-align: middle;
    margin-bottom: 3px;
    margin-right: 5px;
  }

  .settings-dropdown-item {
    font-size: 17px;
  }


  .breadcrumb-container {
    vertical-align: middle;
    line-height: 60px;
    font-size: 18px;
  }

</style>