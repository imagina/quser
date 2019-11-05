<template>
  <div id="adminUsers">
    <!---Component CRUD-->
    <crud :crud-data="import('@imagina/quser/_crud/users')"/>
  </div>
</template>
<script>
  export default {
    props: {},
    components: {},
    watch: {},
    validations() {
      return {}
    },
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {
      }
    },
  }
</script>
<style lang="stylus">
</style>
