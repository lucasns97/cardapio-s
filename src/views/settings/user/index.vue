<template>
  <section>
    Usuáriodasdasd
  </section>
</template>

<script>


export default {
  name: 'Settings',
  components: {},
  data() {
    return {
      activeIndex: '1',
    }
  },
  watch: {},
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>