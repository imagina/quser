<template>
  <q-page id="authLoginRegister" class="flex flex-center">
    <div class="form-content shadow-1 q-px-md backend-page">
      <!--Tabs to toogle between login and register form-->
      <q-tabs inverted v-model="tabModel" align="justify" color="blue-grey">
        <!-- Tabs Title -->
        <q-tab slot="title" name="tab-login" label="Iniciar Sesión"
               @select="metaTitle = 'Iniciar Sesión'"/>
        <q-tab slot="title" name="tab-register" label="Crear Cuenta"
               @select="metaTitle = 'Crear Cuenta'" v-if="withRegister"/>

        <!-- Tab Pane Login -->
        <q-tab-pane name="tab-login" keep-alive>
          <login-form @logged="redirect()" :email="email" />
        </q-tab-pane>
        <!-- Tab Pane Register -->
        <q-tab-pane name="tab-register" keep-alive v-if="withRegister">
          <register-form v-model="email" @input="tabModel = 'tab-login'"/>
        </q-tab-pane>
      </q-tabs>
    </div>
  </q-page>
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
    components: {
      loginForm, registerForm
    },
    watch: {
      $route(to, from) {
        this.checkRedirect()
      },
    },
    mounted() {
      this.$nextTick(function () {
        let configApp = config('app')
        this.withRegister = configApp.registerUsers
        this.checkRedirect()
      })
    },
    data() {
      return {
        metaTitle : 'Iniciar Sesión',
        tabModel : 'tab-login',
        email : null,
        withRegister : false,
        redirectTo: false
      }
    },
    methods: {
      //check if redirect to route specific
      async checkRedirect() {
        let route = this.$route.params.from
        if (route) {
          this.redirectTo = route
          //Save data of route in storage
          this.$helper.storage.set('redirect.to.from.login', {
            name: route.name,
            fullPath: route.fullPath,
            meta: route.meta,
            params: route.params,
            path: route.path,
            query: route.query
          })
        } else {
          //Search route in storage
          let fromRoute = await this.$helper.storage.get.item('redirect.to.from.login')
          if (fromRoute) this.redirectTo = fromRoute
        }
      },
      //Redirect after login
      redirect(){
        this.$router.push({name: 'app.config', params: {redirectTo: this.redirectTo}})
      }
    }
  }
</script>

<style lang="stylus">
  @import "~variables";
  #authLoginRegister
    .form-content
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
