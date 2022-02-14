<template>
  <div id="pageLogout" class="text-center">
    <q-icon name="fas fa-user-lock" color="primary" size="60px"/>
    <div class="text-grey-8 q-headline q-mt-md">
      {{ $tr('iprofile.cms.message.logout') }}
    </div>
    <q-btn :label="$tr('iprofile.cms.label.login')" color="primary"
           :loading="loading" rounded unelevated
           class="q-mt-md" :to="routeToLogin"/>
  </div>
</template>

<script>
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => vm.fromVueRoute = from.name || false)
  },
  components: {},
  data() {
    return {
      loading: false,
      fromVueRoute: false,
    }
  },
  mounted() {
    this.loading = true
    this.$nextTick(async function () {
      await this.$store.dispatch("quserAuth/AUTH_LOGOUT")
      this.loading = false
    })
  },
  computed: {
    routeToLogin() {
      return this.fromVueRoute ? {name: 'auth.login', query: {fromVueRoute: this.fromVueRoute}} : {name: 'auth.login'}
    }
  }
}
</script>

<style lang="stylus">
</style>
