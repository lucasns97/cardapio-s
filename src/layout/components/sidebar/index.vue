<template>
  <el-menu
    :collapse="isCollapse"
    :default-active="activeIndex"
    class="sidebar-menu"
    @open="handleOpen"
    @close="handleClose"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :router="true">
    <el-button plain class="logo-container" type="warning" @click="handleLogoClick" style="width: 100%">
      <img class="logo-image" src="../../../../public/logo.png">
      {{logoTitle}}
    </el-button>
    <el-menu-item v-for="(menuItem, idx) in menuList" :key="idx" :index="menuItem.index" :route="{name: menuItem.name}">
      <i :class="menuItem.icon"></i>
      <span slot="title">{{menuItem.title}}</span>
    </el-menu-item>
    <div id="collapse-btn-container">
      <!-- MUDAR -->
      <el-button v-if="isCollapse" type="warning" plain id="collapse-btn" :icon="collapseIcon" @click="handleCollapse" style="width: 64px"></el-button>
      <el-button v-else type="warning" plain id="collapse-btn" :icon="collapseIcon" @click="handleCollapse" style="width: 240px"></el-button>
    </div>
  </el-menu>
</template>


<script>

export default {
  name: 'SideBar',
  data() {
    return {

      // Responsive
      isCollapse: true,

      // UX
      collapseIcon: 'el-icon-d-arrow-right',
      logoTitle: '',

      // Sidebar menu
      activeIndex: '',
      menuList: [
        {
          'title': 'Montar Cardápio',
          'name': 'Make Menu',
          'icon': 'el-icon-s-order',
          'index': '0'
        },
      ]
    }
  },
  beforeMount() {
    this.handleActiveIndex()
  },
  watch: {
    $route (){
      this.handleActiveIndex()      
    }
  },
  methods: {
    handleActiveIndex() {
      let isInMenu   = false
      let activeMenu = {}
      var that       = this

      this.menuList.forEach((menuItem) => {
        if (that.$route.name === menuItem.name) {
          activeMenu = menuItem
          isInMenu = true
        }
      })

      if (!isInMenu) this.activeIndex = '-1'
      else this.activeIndex = activeMenu.index
    },
    handleCollapse() {

      if (this.isCollapse) {
        this.isCollapse   = false
        this.collapseIcon = 'el-icon-d-arrow-left'
        this.logoTitle    = "Cardápio's"
        this.$emit('update-sidebar', 'Open')

      }
      else {
        this.isCollapse = true
        this.collapseIcon = 'el-icon-d-arrow-right'
        this.logoTitle    = ''
        this.$emit('update-sidebar', 'Close')

      }

    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleLogoClick() {
      window.location.replace(window.location.origin);
    },
  }
}
</script>

<style scoped>

  #collapse-btn-container {
    position: absolute;
    bottom: 0%;
  }

  #collapse-btn {
    border-radius: 0;
    width: 100%;
  }

  .sidebar-menu:not(.el-menu--collapse){
    width: 240px;
  }

  .sidebar-menu {
    height: 100%;
  }

  .logo-image {
    height: 28px;
    border-radius: 5px;
    vertical-align: middle;
    transform: translateX(-2px);
  }

  .logo-container, .logo-container:hover, .logo-container:active {
    font-size: 20px;
    background-color: transparent;
    border-color: transparent;
  }

  

</style>