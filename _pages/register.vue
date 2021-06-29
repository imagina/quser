<template>
  <div id="authLoginRegister" class="flex flex-center">
    <div id="formRegisterContent" class="q-pa-md">
      <!--Logo-->
      <div class="text-center">
        <img id="logo" :src="$store.getters['qsiteApp/getSettingMediaByName']('isite::logo1').path"></img>
      </div>
      <!--Form-->
      <div class="box q-mb-md">
        <register-form @logged="$router.push({name : 'app.home'})" class="full-width"/>
      </div>
      <!--Auth social-->
      <div class="box" style="min-height: auto" v-if="withAuthSocial">
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
    },
    withAuthSocial() {
      let hasSetting = this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::registerUsersWithSocialNetworks')
      return (hasSetting && (config('app.mode') == 'ipanel')) ? true : false
    }
  },
  methods: {
    init() {
      if (!this.withRegister) this.$router.push({name: 'app.not.authorized'})
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
