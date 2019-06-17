<template>
  <q-page id="authLoginRegister" class="flex flex-center">
    <form-auth @logged="redirect()" />
  </q-page>
</template>

<script>
  //components
  import formAuth from '@imagina/quser/_components/auth/form'

  export default {
    props: {},
    components: {formAuth},
    watch: {
      $route(to, from) {
        this.checkRedirect()
      },
    },
    mounted() {
      this.$nextTick(function () {
        this.checkRedirect()
      })
    },
    data() {
      return {
        redirectTo: false
      }
    },
    methods: {
      //check if redirect to route specific
      async checkRedirect() {
        let route = this.$route.params.from
        if (route) {
          this.redirectTo = route
          //Save data of route in storage
          this.$helper.storage.set('redirect.to.from.login', {
            name: route.name,
            fullPath: route.fullPath,
            meta: route.meta,
            params: route.params,
            path: route.path,
            query: route.query
          })
        } else {
          //Search route in storage
          let fromRoute = await this.$helper.storage.get.item('redirect.to.from.login')
          if (fromRoute) this.redirectTo = fromRoute
        }
      },
      //Redirect after login
      redirect() {
        this.$router.push({name: 'app.config', params: {redirectTo: this.redirectTo}})
      }
    }
  }
</script>

<style lang="stylus">
  @import "~variables";
</style>
