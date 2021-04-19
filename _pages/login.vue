<template>
  <div id="authLoginRegister" class="bg-grey-2 flex flex-center">
    <div class="q-px-md q-py-xl">
      <form-auth :horizontal-extra-fields="true" @logged="redirect()"/>
    </div>
  </div>
</template>

<script>
//components
import formAuth from '@imagina/quser/_components/auth/form'

export default {
  props: {},
  components: {formAuth},
  beforeRouteEnter(to, from, next) {
    console.warn('From Vue Route', from, 'To vue route', to)
    next(vm => vm.fromRoute = from)
  },
  mounted() {
    this.$nextTick(function () {
    })
  },
  data() {
    return {
      fromRoute: false
    }
  },
  methods: {
    //Redirect after login
    redirect() {
      let windowLastRoute = document.referrer //get last navigator history route
      let origenUrl = this.$store.state.qsiteApp.baseUrl //get local origin Url
      console.warn("windowLastRoute", windowLastRoute, "this.fromRoute", this.fromRoute)
      //validate last navigator history route to redirect
      if (windowLastRoute.length && (windowLastRoute.indexOf(origenUrl) >= 0) && (windowLastRoute.indexOf("login") == -1) && (windowLastRoute.indexOf("logout") == -1)) {
        //Redirect last
        location.href = windowLastRoute;
        //validate last vue router history route to rediret
      } else if (this.fromRoute && this.fromRoute.name && (this.fromRoute.name != "auth.logout") && (this.fromRoute.name != "auth.login")) {
        //Redirect last
        this.$router.push({name: this.fromRoute.name});
      } else {
        //Redirect home iadmin
        this.$router.push({name: 'app.home'});
      }
    }
  }
}
</script>

<style lang="stylus">
#authLoginRegister
  min-height 100vh
</style>
