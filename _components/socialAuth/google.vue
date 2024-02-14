<template>
  <socialBtn
    v-if="clientIdGoogle"
    :loading="loading"
    @click.native="signIn()"
    :title="`${$tr('isite.cms.label.continueWith')} ${$tr('isite.cms.label.google')}`"
    :icon="require('modules/quser/_components/socialAuth/icons/google.svg')"
  />
</template>

<script>
import socialBtn from 'modules/quser/_components/socialAuth/socialBtn.vue';

export default {
  props: {
    buttonProps: {
      default: () => {
        return {}
      }
    }
  },
  emits: ['logged'],
  components: {socialBtn},
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
    clientIdGoogle() {
      return this.$store.getters['qsiteApp/getSettingValueByName']('isite::googleClientId')
    },
    propsButton() {
      return {
        color: 'red',
        icon: 'fab fa-google',
        loading: this.loading,
        vIf: this.success,
        ...this.buttonProps
      }
    }
  },
  methods: {
    //add CDN  to head
    addCDN() {
      let cdn = document.createElement('script')//create CDN google recaptcha
      cdn.setAttribute('src', 'https://accounts.google.com/gsi/client')
      cdn.onload = this.loadClientId()//callback when loaded cdn
      document.head.appendChild(cdn)//add to head
    },
    //Load Client ID
    loadClientId() {
      setTimeout(() => {
        let clientId = this.clientIdGoogle || null;
        if(!clientId) return;

        // Initialize Google Identity Services
        google.accounts.id.initialize({
          client_id: clientId,
          callback: this.login,
          scope: 'profile email openid',
          cancel_on_tap_outside: false,
          context: 'use'
        });
      }, 500)
    },
    //SignIn method
    signIn(response) {
      google.accounts.id.prompt()
    },
    //Request Login
    login(response) {
      let token = response.credential

      //Validate response
      if (!token) {
        this.loading = false
        return this.$alert.error(this.$tr('isite.cms.message.errorRequest'))
      }

      //Dispath auth social network
      this.$store.dispatch('quserAuth/AUTH_SOCIAL_NETWORK', {
        type: 'google',
        token: token
      }).then(response => {
        this.$emit('logged')
        this.loading = false
      }).catch(error => {
        this.$alert.error(this.$tr('isite.cms.message.errorRequest'))
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss">

</style>
