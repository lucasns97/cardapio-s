<template>
  <section>
    temporário
  </section>
</template>

<script>


export default {
  name: 'Temp',
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