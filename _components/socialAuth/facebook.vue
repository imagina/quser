<template>
  <q-btn v-bind="propsButton" @click="signIn()"/>
</template>
<script>
  export default {
    props: {
      buttonProps: {
        default: () => {
          return {}
        }
      }
    },
    components: {},
    watch: {},
    mounted() {
      this.$nextTick(function () {
        this.addCDN()
      })
    },
    data() {
      return {
        success: true,
        loading: false
      }
    },
    computed: {
      appIdFacebook() {
        return this.$store.getters['qsiteApp/getSettingValueByName']('isite::facebookClientId')
      },
      propsButton() {
        return {
          color: 'blue',
          icon: 'fab fa-facebook',
          loading: this.loading,
          vIf: this.success,
          ...this.buttonProps
        }
      }
    },
    methods: {
      //add CDN  to head
      addCDN() {
        let appId = this.appIdFacebook
        window.fbAsyncInit = function () {
          FB.init({
            appId: appId,
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v4.0'
          });
        };

        (function (d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {
            return;
          }
          js = d.createElement(s);
          js.id = id;
          js.src = "https://connect.facebook.net/en_US/sdk.js";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
      },
      //SignIn method
      signIn() {
        let app = this //assigned this to another variable
        this.loading = true
        //Request login to facebook
        FB.getLoginStatus(function (response) {
          if (response.status == 'connected') return app.login(response)
          FB.login(response => {
            app.login(response)
          }, {auth_type: 'reauthorize', scope: 'public_profile,email'})//Open window to login with facebook
        })
      },
      //Request Login
      login(response) {
        //Validate response
        if (response.status != 'connected') return this.loading = false

        //Get access Token
        let token = response.authResponse.accessToken

        //Dispath auth social network
        this.$store.dispatch('quserAuth/AUTH_SOCIAL_NETWORK', {
          type: 'facebook',
          token: token
        }).then(response => {
          this.$emit('logged')
          this.loading = false
        }).catch(error => {
          this.$alert.error(this.$tr('ui.message.errorRequest'))
          this.loading = false
        })
      }
    }
  }
</script>
<style lang="stylus">

</style>
