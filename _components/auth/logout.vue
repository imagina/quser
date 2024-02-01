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
import storeMicrosoft from '@imagina/quser/_store/storeMicrosoft.js'
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
      this.loading = false;
      const userName = localStorage.getItem('userName');
      if(userName) await storeMicrosoft().setUsername(userName);
      const socialType = localStorage.getItem('socialType');
      if (socialType && socialType === 'microsoft') {
        await storeMicrosoft().signOut();
      }

    })
  },
  computed: {
    routeToLogin() {
      return this.fromVueRoute ? {name: 'auth.login', query: {fromVueRoute: this.fromVueRoute}} : {name: 'auth.login'}
    }
  }
}
</script>

<style lang="sass">
</style>
