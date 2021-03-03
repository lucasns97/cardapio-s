<template>
  <section>
    <el-row type="flex">
      <el-col :span="100" id="sidebar-container"> 
        <SideBar id="sidebar" @update-sidebar="handleCollapse"></SideBar>
      </el-col>
      <el-col id="main-container"> 
        <Header id="header"></Header>
        <el-main id="main">
          <router-view></router-view>
        </el-main>
      </el-col>
    </el-row>
  </section>
</template>

<script>

import SideBar from '@/layout/components/sidebar/index'
import Header from '@/layout/components/header/index'

export default {
  name: 'Dashboard',
  components: {
    SideBar,
    Header
  },
  data() {
    return {}
  },
  watch: {},
  methods: {
    handleCollapse(sidebarState) {
      if (sidebarState == 'Open') {
        document.getElementById("main-container").style.marginLeft = '240px';
      } else {
        document.getElementById("main-container").style.marginLeft = '64px';
      }
    }
  }
}
</script>

<style>
  body {
    margin: 0px;
  }

  #sidebar-container {
    height: 100%;
    position: fixed;
    z-index: 2;
    top: 0;
    left: 0;
    overflow-x: hidden;
  }

  #main-container {
    margin-left: 64px;
    transition: margin-left .7s;
  }

  #header {
    overflow: hidden;
    position: fixed;
    top: 0;
    z-index: 1;
  }

  #main {
    margin-top: 60px
  }


</style>