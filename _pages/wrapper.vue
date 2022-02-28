<template>
  <div id="authWrapperPage">
    <div class="row">
      <!--Auth Banner-->
      <div v-if="settings.authBanner" class="wrapp__banner col-12 col-md-4"
           :style="`background-image: url('${settings.authBanner.path}')`"></div>
      <!--Page Content-->
      <div :class="`col-12 ${settings.authBanner ? 'col-md-8' : ''}`">
        <div class="wrapp__content flex flex-center justify-center">
          <div class="wrapp__content_sub q-pa-md">
            <!--Welcome text-->
            <div class="wrapp__title q-mb-md" v-if="settings.authTitle && (settings.authTitle != 'null')">
              {{ settings.authTitle }}
            </div>
            <!--Logo-->
            <div class="wrapp__logo logo-bg-primary q-mb-xl" v-if="!settings.hideLogo">
              <img :src="settings.logo"></img>
            </div>
            <!--Auth Type-->
            <div class="q-mb-md">
              <!--Loggin-->
              <login-form v-if="authType == 'login'" @logged="redirectAfterLogin()" class="full-width"/>
              <!--Register-->
              <register-form v-if="authType == 'register'" @logged="redirectAfterLogin()"
                             class="full-width"/>
              <!--Loggin-->
              <reset-password v-if="authType == 'resetPassword'" class="full-width"/>
              <!--logout-->
              <logout v-if="authType == 'logout'" class="full-width"/>
            </div>
            <!--Auth social-->
            <div style="min-height: auto" v-if="withAuthSocial">
              <q-separator class="q-mb-md"/>
              <!--Title-->
              <div class="box-title text-uppercase q-mb-sm text-center">
                {{ $tr('iprofile.cms.message.quickAccess') }}
              </div>
              <!--Actions-->
              <div class="row justify-center q-gutter-sm">
                <google-auth/>
                <facebook-auth/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//components
import loginForm from '@imagina/quser/_components/auth/login'
import registerForm from '@imagina/quser/_components/auth/register'
import resetPassword from '@imagina/quser/_components/auth/resetPassword'
import logout from '@imagina/quser/_components/auth/logout'

import facebookAuth from '@imagina/quser/_components/socialAuth/facebook'
import googleAuth from '@imagina/quser/_components/socialAuth/google'

export default {
  props: {},
  components: {loginForm, registerForm, resetPassword, logout, facebookAuth, googleAuth},
  beforeRouteEnter(to, from, next) {
    next(vm => vm.fromVueRoute = from.name || false)
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      fromVueRoute: false,
      appConfig: config('app')
    }
  },
  computed: {
    //Return auth type
    authType() {
      return this.$route.meta.authType
    },
    //Settings
    settings() {
      //Get auth banner
      let authBanner = this.$store.getters['qsiteApp/getSettingMediaByName']('iprofile::authBanner')

      let response = {
        logo: this.$store.state.qsiteApp.logo,
        authTitle: this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::authTitle'),
        hideLogo: parseInt(this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::hideLogo')),
        authBanner: !authBanner.path || authBanner.path.includes('defaultLogo.jpg') ? false : authBanner
      }

      //response
      return response
    },
    //Validate if load social auth
    withAuthSocial() {
      let hasSetting = this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::registerUsersWithSocialNetworks')
      return hasSetting/* && (config('app.mode') == 'ipanel'))*/ ? true : false
    }
  },
  methods: {
    init() {

    },
    //Redirect after user be logged
    redirectAfterLogin() {
      //Get workSapce assigned from user Role. if not found it, set `iadmin` as default
      let windowLastRoute = this.$route.query.redirectTo || false
      let settingsProfile = this.$store.state.quserAuth.settings
      let workSpace = settingsProfile.workSpace || 'iadmin'

      //Redirect to same workSpace
      if (windowLastRoute || (workSpace == config('app.mode'))) this.$router.push({name: 'app.home'})
      //Redirect to assigned workSpace
      else this.$helper.openExternalURL(`${this.$store.state.qsiteApp.baseUrl}/${workSpace}`, false)
    }
  }
}
</script>

<style lang="stylus">
#authWrapperPage
  background-color white
  min-height 100vh

  .wrapp__banner
    background $custom-accent-color
    background-size cover
    background-repeat no-repeat
    background-position center

  .wrapp__content
    height 100vh

    .wrapp__content_sub
      max-width 400px
      width 400px

    .wrapp__title
      color $primary
      font-weight bold
      font-size 30px
      text-align center

    .wrapp__logo
      text-align center
      position relative
      height 130px
      max-height 270px
      padding 15px
      border-radius 10px
      overflow hidden

      img
        position absolute
        left 0
        right 0
        margin-left auto
        margin-right auto
        max-height 100px
        max-width 100%
</style>
