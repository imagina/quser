<template>
  <div id="adminDepartments">
    <!---Component CRUD-->
    <crud :crud-data="import('@imagina/quser/_crud/departments')"/>
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
      return {}
    },
    methods: {}
  }
</script>
<style lang="stylus">
</style>
