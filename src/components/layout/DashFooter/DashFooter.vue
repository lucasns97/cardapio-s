<template>
  <!-- importing icons -->
  <el-row align="middle" justify="right" type="flex" class="footer__outer">
    <el-col class="version-content" >Versão 1.0</el-col>
    <el-col class="dm-content">
      <a class="dm-content-year"> &copy; {{ year }}</a>
      <img src="./../../../assets/logo.png" class="dm-content-logo">
      <a class="dm-content-link" href="https://datamachina.com.br/" target="_blank">Data Machina</a>
    </el-col>
    <el-col class="last-update-content">Última atualização: 25/05/2020</el-col>
  </el-row>
</template>

<script>
export default {
  name: 'DashFooter',
  data: function () {
    return {
      year: new Date().getFullYear()
    }
  }
}
</script>

<style src="./DashFooter.css"></style>