<template>
  <div id="authLoginRegister" class="flex flex-center">
    <div id="formLoginContent" class="q-pa-md">
      <!--Logo-->
      <div class="text-center">
        <img id="logo" :src="$store.getters['qsiteApp/getSettingMediaByName']('isite::logo1').path"></img>
      </div>
      <!--Form-->
      <div class="box q-mb-md">
        <login-form @logged="$router.push({name : 'app.home'})" class="full-width"/>
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
import loginForm from '@imagina/quser/_components/auth/login'
import facebookAuth from '@imagina/quser/_components/socialAuth/facebook'
import googleAuth from '@imagina/quser/_components/socialAuth/google'

export default {
  props: {},
  components: {loginForm, facebookAuth, googleAuth},
  beforeRouteEnter(to, from, next) {
    next(vm => vm.fromVueRoute = from.name || false)
  },
  mounted() {
    this.$nextTick(function () {
    })
  },
  data() {
    return {
      fromVueRoute: false,
      appConfig: config('app')
    }
  },
  methods: {}
}
</script>

<style lang="stylus">
#authLoginRegister
  background-color $custom-accent-color
  min-height 100vh

  #formLoginContent
    max-width 400px

    #logo
      max-width 340px
      height 100px
      max-height 240px
      margin-bottom 25px
</style>
