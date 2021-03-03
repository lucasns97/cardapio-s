<template>
  <section>
    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick">
      <el-tab-pane label="Usuário" name="User">
        <router-view></router-view>
      </el-tab-pane>
      <el-tab-pane label="Temporário" name="Temp">
        <router-view></router-view>
      </el-tab-pane>
    </el-tabs>
    
  </section>
</template>

<script>


export default {
  name: 'Settings',
  components: {},
  data() {
    return {
      activeName: '',
    }
  },
  watch: {},
  beforeMount() {
    this.activeName = this.$route.name
  },
  methods: {
    handleClick(tab, event) {
      this.$router.replace({name: tab.name})
    }
  }
}
</script>