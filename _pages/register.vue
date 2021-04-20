<template>
  <div id="authLoginRegister" class="flex flex-center">
    <div id="formRegisterContent" class="q-pa-md">
      <!--Logo-->
      <div class="text-center">
        <img id="logo" :src="$store.getters['qsiteApp/getSettingMediaByName']('isite::logo1').path"></img>
      </div>
      <!--Form-->
      <div class="box q-mb-md">
        <register-form @logged="redirect()" class="full-width"/>
      </div>
      <!--Auth social-->
      <div class="box" style="min-height: auto" v-if="appConfig.mode == 'ipanel'">
        <!--Title-->
        <div class="box-title text-uppercase q-mb-sm text-center">
          {{ $tr('quser.layout.message.quickAccess') }}
        </div>
        <!--Actions-->
        <div class="row justify-center q-gutter-sm">
          <google-auth/>
          <facebook-auth/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//components
import registerForm from '@imagina/quser/_components/auth/register'
import facebookAuth from '@imagina/quser/_components/socialAuth/facebook'
import googleAuth from '@imagina/quser/_components/socialAuth/google'

export default {
  props: {},
  components: {registerForm, facebookAuth, googleAuth},
  beforeRouteEnter(to, from, next) {
    next(vm => vm.fromRoute = from)
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      fromRoute: false,
      appConfig: config('app')
    }
  },
  computed: {
    withRegister() {
      let hasSetting = this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::registerUsers')
      return (hasSetting && (this.appConfig.mode == 'ipanel')) ? true : false
    }
  },
  methods: {
    init() {
      if (!this.withRegister) this.$router.push({name: 'app.not.authorized'})
    },
    //Redirect after login
    redirect() {
      let windowLastRoute = document.referrer //get last navigator history route
      let origenUrl = this.$store.state.qsiteApp.baseUrl //get local origin Url
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
  background-color $custom-accent-color
  min-height 100vh

  #formRegisterContent
    max-width 400px

    #logo
      max-width 340px
      height 100px
      max-height 100px
      margin-bottom 25px
</style>
