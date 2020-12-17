<template>
  <div>
    <div id="app"
         v-loading="$store.state.spinning"
         element-loading-text="加载中，请稍后..."
         element-loading-background="rgba(0, 0, 0, .6)">
      <router-view />
    </div>

  </div>
</template>
<script>

export default {
  data () {
    return {

    }
  },
  computed: {

  },
  mounted () {
    window.addEventListener('hashchange', () => {
      const currentPath = window.location.hash.slice(1)
      if (this.$route.path !== currentPath) {
        this.$router.push(currentPath)
        location.reload()
      }
    }, false)
  },
  methods: {
  }
}
</script>
<style lang="less">
</style>
