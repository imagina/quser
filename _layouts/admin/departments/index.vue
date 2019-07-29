<template>
  <div id="pageId" class="q-layout-page layout-padding">
    <!--TITLE-->
    <h1 class="q-headline text-primary">
      <q-icon v-if="$route.meta.icon" :name="$route.meta.icon"/>
      {{$tr($route.meta.title)}}
    </h1>

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
  @import "~variables";
</style>
