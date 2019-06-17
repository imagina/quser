<template>
  <div id="formAuthPage" class="form-content shadow-1 q-px-md backend-page">
    <!--Tabs to toogle between login and register form-->
    <q-tabs inverted v-model="tabModel" align="justify" color="blue-grey">
      <!-- Tabs Title -->
      <q-tab slot="title" name="tab-login" label="Iniciar Sesión"
             @select="metaTitle = 'Iniciar Sesión'"/>
      <q-tab slot="title" name="tab-register" label="Crear Cuenta"
             @select="metaTitle = 'Crear Cuenta'" v-if="withRegister"/>

      <!-- Tab Pane Login -->
      <q-tab-pane name="tab-login" keep-alive>
        <login-form @logged="emitCreate()" :email="email"/>
      </q-tab-pane>
      <!-- Tab Pane Register -->
      <q-tab-pane name="tab-register" keep-alive v-if="withRegister">
        <register-form v-model="email" @registered="emitRegister()"/>
      </q-tab-pane>
    </q-tabs>
  </div>
</template>
<script>
  //components
  import loginForm from '@imagina/quser/_components/auth/login'
  import registerForm from '@imagina/quser/_components/auth/register'

  export default {
    meta() {
      return {
        title: this.metaTitle,
      }
    },
    props: {},
    components: {loginForm, registerForm},
    watch: {},
    mounted() {
      this.$nextTick(function () {
        let configApp = config('app')
        this.withRegister = configApp.registerUsers
      })
    },
    data() {
      return {
        withRegister: false,
        metaTitle: 'Iniciar Sesión',
        tabModel: 'tab-login',
        email: null,
      }
    },
    methods: {
      emitRegister(){
        this.tabModel = 'tab-login'
        this.$emit('registered',this.email)
      },
      emitCreate(){
        this.$emit('logged')
      }
    }
  }
</script>
<style lang="stylus">
  @import "~variables";
  #authLoginRegister
    #formAuthPage
      &.form-content
        width 350px

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

        .q-btn
          min-width 140px !important
</style>
