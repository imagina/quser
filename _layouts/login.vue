<template>
  <q-page id="pageLogin" class="flex flex-center">

    <div class="row shadow-3 q-mx-md" style="width: 350px">
      <div id="form-login-right"
           class="col-12"
           style="padding: 30px 25px">
        <h4 class="text-primary text-center q-mt-none q-mb-md q-pb-sm"
            style="border-bottom: 2px solid #f1f1f1; font-size: 34px">
          LOGIN
        </h4>
        <!-- USER -->
        <q-field
          :error="$v.form.username.$error"
          error-label="This field is required"
        >
          <q-input name="username"
                   autofocus
                   autocomplete="off"
                   v-model="form.username"
                   type="text"
                   :before="[{icon: 'person'}]"
                   @keyup.enter="authenticate()"
                   float-label="Username or Email"
          />
        </q-field>
        <!-- PASS -->
        <q-field
          :error="$v.form.password.$error"
          error-label="This field is required"
        >
          <q-input v-model="form.password"
                   type="password"
                   name="password"
                   :before="[{icon: 'lock'}]"
                   @keyup.enter="authenticate()"
                   float-label="Password"
          />
        </q-field>

        <!--=== LOGIN ===-->
        <div class="text-center">
          <q-btn :loading="loading_login"
                 color="primary" name="submit"
                 @click="authenticate()">
            LOGIN
            <span slot="loading">
                <q-spinner-hourglass class="on-left"/>
                VALIDATING...
              </span>
          </q-btn>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
  //Plugins
  import {required, email, numeric, minLength} from 'vuelidate/lib/validators';
  //Services
  import authService from '@imagina/quser/_services/profile/index';

  export default {
    data() {
      return {
        form: {
          username: '',
          password: ''
        },
        rememberData: true,
        loading_login: false,
        inRequest : false
      }
    },
    validations: {
      form: {
        username: {required},
        password: {required}
      }
    },
    methods: {
      async authenticate() {
        if(!this.inRequest){
          this.$v.$touch();
          if (!this.$v.$error) {
            this.inRequest = true
            this.loading_login = true;
            const {username, password} = this.form;
            this.$store.dispatch("auth/AUTH_REQUEST", {username, password}).then((response) => {
              this.loading_login = false;
              this.inRequest = false
              this.$router.push({name:'app.config'})
            }).catch(error => {
              this.loading_login = false;
              this.inRequest = false
            });
          }
        }
      },
    }
  }
</script>
<style lang="stylus">
  @import "~variables";
  #pageLogin
    .q-btn
      min-width 140px !important
    #form-login-left
      min-height 150px
      .bg-color
        background-color $primary
        height 100%
        width 100%
</style>
