<template>
  <q-card class="q-px-md">
    <!--Tab-->
    <q-tabs v-model="tabModel" dense class="text-grey" active-color="primary"
            indicator-color="primary" align="justify">
      <q-tab name="tab-login" :label="$tr('quser.layout.label.login')"/>
      <q-tab name="tab-register" v-if="withRegister" :label="$tr('quser.layout.label.createAccount')"/>
    </q-tabs>

    <q-separator/>

    <!--Tabs-->
    <q-tab-panels v-model="tabModel" animated keep-alive>
      <!--Login-->
      <q-tab-panel name="tab-login">
        <login-form @logged="emitLogged()" :email="email"/>
      </q-tab-panel>
      <!--Register-->
      <q-tab-panel name="tab-register" v-if="withRegister">
        <register-form :horizontal-extra-fields="props.horizontalExtraFields"
                       :horizontal="props.horizontal"
                       v-model="email"
                       @logged="emitLogged()"
                       @registered="emitRegister()"/>
      </q-tab-panel>
    </q-tab-panels>

    <q-separator/>

    <!--Social Auth-->
    <div class="socialAuth q-py-sm text-center" v-if="!isBackend">
      <div class="text-grey-6 q-mb-xs">{{$tr('quser.layout.message.quickAccess')}}</div>
      <!--google-->
      <google-auth @logged="emitLogged()"/>
      <!--google-->
      <facebook-auth @logged="emitLogged()" class="q-ml-sm"/>
    </div>
  </q-card>
</template>
<script>
  //components
  import loginForm from '@imagina/quser/_components/auth/login'
  import registerForm from '@imagina/quser/_components/auth/register'
  import googleAuth from '@imagina/quser/_components/socialAuth/google'
  import facebookAuth from '@imagina/quser/_components/socialAuth/facebook'

  export default {
    props: {
      horizontal: {type: Boolean, default: false},
      horizontalExtraFields: {type: Boolean, default: false}
    },
    components: {
      loginForm,
      registerForm,
      googleAuth,
      facebookAuth
    },
    watch: {},
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {
        props: {},
        tabModel: 'tab-login',//'tab-login',
        email: null,
      }
    },
    computed: {
      withRegister() {
        let hasSetting = this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::registerUsers')
        return (hasSetting && !this.isBackend) ? true : false
      },
      isBackend() {
        let configApp = config('app')
        return configApp.isBackend
      }
    },
    methods: {
      init() {
        this.props = this.$clone(this.$props)
      },
      emitRegister() {
        this.tabModel = 'tab-login'
        this.$emit('registered', this.email)
      },
      emitLogged() {
        this.$emit('logged')
      }
    }
  }
</script>
<style lang="stylus">
  #authLoginRegister
    #formAuthPage
      &.form-content
        max-width 100%

        .form-title
          color $blue-grey
          text-align center
          border-bottom 2px solid #f1f1f1
          font-size 34px
          margin 0 0 10px 0

        .input-title
          font-size 16px

          .q-icon
            margin-right 5px
</style>
