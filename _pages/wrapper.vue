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
              <div v-if="allowLocalLogin">
                <div v-if="modeAuthType === 'withPassword'">
                  <login-form v-if="authType == 'login'" @logged="checkAfterLogin()" class="full-width"/>
                  <!--Register-->
                  <register-form v-if="authType == 'register'" @logged="checkAfterLogin()"
                                 class="full-width"/>
                  <!--Loggin-->
                  <reset-password v-if="authType == 'resetPassword'" class="full-width"/>
                  <!-- reset password -->
                  <reset-password-complete v-if="authType == 'resetPasswordComplete'" class="full-width"/>
                  <!-- force change password -->
                  <force-change-password v-if="authType == 'forceChangePassword'" class="full-width"/>
                </div>
                <!--Login  With Email-->
                <email-auth v-if="['login', 'register'].includes(authType) && modeAuthType === 'withEmail'" class="full-width"/>
              </div>
              <!--logout-->
              <logout v-if="authType == 'logout'" class="full-width"/>
            </div>
            <!--Auth social-->
            <div style="min-height: auto" v-if="withAuthSocial">
              <q-separator class="q-mb-md"/>
              <!--Actions-->
              <div class="row justify-center q-gutter-sm">
                <google-auth @logged="checkAfterLogin"/>
                <facebook-auth @logged="checkAfterLogin"/>
                <microsoftAuth @logged="checkAfterLogin" />
              </div>
            </div>
          </div>
        </div>
        <div class="tw-flex tw-justify-end tw--mt-10 tw-mr-2 tw-mb-2">
          <q-btn
            class="tw-text-xs tw-rounded-2xl"
            color="primary"
            icon-right="fa-solid fa-broom-wide"
            :label="$t('isite.cms.configList.clearCache', { capitalize: true })"
            flat
            rouded
            no-caps
            @click="$router.push({name: 'app.update.app'})"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//components
import loginForm from 'modules/quser/_components/auth/login'
import registerForm from 'modules/quser/_components/auth/register'
import resetPassword from 'modules/quser/_components/auth/resetPassword'
import resetPasswordComplete from 'modules/quser/_components/auth/resetPasswordComplete'
import forceChangePassword from 'modules/quser/_components/auth/forceChangePassword'
import logout from 'modules/quser/_components/auth/logout'
import masterModal from 'modules/qsite/_components/master/masterModal'

import emailAuth from 'modules/quser/_components/auth/emailAuth'
import facebookAuth from 'modules/quser/_components/socialAuth/facebook'
import googleAuth from 'modules/quser/_components/socialAuth/google'
import microsoftAuth from 'modules/quser/_components/socialAuth/microsoft'
import axios from "axios"
import moment from "moment";
import momenttz from 'moment-timezone';

export default {
  props: {},
  components: {
    loginForm,
    registerForm,
    resetPassword,
    forceChangePassword,
    logout,
    facebookAuth,
    googleAuth,
    resetPasswordComplete,
    microsoftAuth,
    masterModal,
    emailAuth
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.fromVueRoute = from.name || false)
  },
  mounted() {
    this.$nextTick(function () {
      sessionStorage.removeItem('msal.interaction.status');
      sessionStorage.removeItem('socialType');
      this.init()
    })
  },
  data() {
    return {
      fromVueRoute: false,
      appConfig: config('app'),
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
      let authBanner = this.$getMediaSetting('iprofile::authBanner')

      let response = {
        logo: this.$store.state.qsiteApp.logo,
        authTitle: this.$getSetting('iprofile::authTitle'),
        hideLogo: parseInt(this.$getSetting('iprofile::hideLogo')),
        authBanner: !authBanner.path || authBanner.path.includes('defaultLogo.jpg') ? false : authBanner
      }

      //response
      return response
    },
    //Validate if load social auth
    withAuthSocial() {
      let hasSetting = parseInt(this.$getSetting('iprofile::registerUsersWithSocialNetworks'))
      return hasSetting && (this.authType != "logout")
    },
    microsoftClient() {
      return this.$getSetting('iprofile::microsoftClientId')
    },
    allowLocalLogin() {
      return Boolean(Number(this.$getSetting('iprofile::allowLocalLogin')))
    },
    modeAuthType() {
      return this.$store.getters['qsiteApp/getConfigApp']('iprofile.authType') || "withPassword"
    }
  },
  methods: {
    init() {

    },
    checkAfterLogin(){
      //preguntar por setting para validar timeZone
      this.checkTimeZone()
      //else
      this.redirectAfterLogin()
    },
    checkTimeZone(){
      //Modal persistent...
      //si no tiene timezone abre modal - Seleccione timezone - requestAsync put actualizando timeZone
      // check si guardo timezone...
      axios.defaults.params.setting.timezone = moment.tz.guess()
      // redirectAfterLogin
    },
    //Redirect after user be logged
    redirectAfterLogin() {
      //sino hace el resto
      //Get workSapce assigned from user Role. if not found it, set `iadmin` as default
      let windowLastRoute = this.$route.query.redirectTo || false
      let settingsProfile = this.$store.state.quserAuth.settings
      let workSpace = settingsProfile?.workSpace || 'iadmin'
      const redirectToWorkSpace = window.location.href.replace(this.appConfig.mode, workSpace)

      //Redirect to same workSpace
      if (windowLastRoute || (workSpace == config('app.mode'))) this.$router.push({name: 'app.home'})
      //Redirect to assigned workSpace
      else this.$helper.openExternalURL(redirectToWorkSpace, false)
    }
  }
}
</script>

<style lang="scss">
#authWrapperPage {
  background-color: white;
  min-height: 100vh;

  .wrapp__banner {
    background: $custom-accent-color;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  .wrapp__content {
    height: 100vh;

    .wrapp__content_sub {
      max-width: 400px;
      width: 400px;
    }

    .wrapp__title {
      color: $primary;
      font-weight: bold;
      font-size: 30px;
      text-align: center;
    }

    .wrapp__logo {
      text-align: center;
      position: relative;
      height: 130px;
      max-height: 270px;
      padding: 15px;
      border-radius: 10px;
      overflow: hidden;

      img {
        position: absolute;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        max-height: 100px;
        max-width: 100%;
      }
    }
  }
}
</style>
