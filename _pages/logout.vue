<template>
  <q-page id="pageLogout" class="flex flex-center">
    <div class="row shadow-3 q-mx-xl bg-white" style="width: 350px">
      <div class="flex flex-center col-12 relative-position"
           style="padding: 20px; min-height: 300px">
        <div class="text-center">
          <q-icon name="fas fa-user-lock" color="primary" size="60px"/>
          <div class="text-grey-8 q-headline q-mt-md">
            {{ $tr('quser.layout.message.logout') }}
          </div>
          <q-btn :label="$tr('quser.layout.label.login')" color="primary"
                 :loading="loading" rounded unelevated
                 class="q-mt-md" :to="routeToLogin"/>
        </div>
      </div>
    </div>
  </q-page>
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
#pageLogout
  background-color $custom-accent-color
</style>
