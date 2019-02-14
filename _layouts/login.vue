<template>
  <q-page class="flex flex-center">

    <div class="row shadow-3 q-mx-md" style="width: 550px">
      <div id="form-login-left" class="col-12 col-md-5">
        <div class="bg-color flex flex-center">
          <img src="../../../../src/assets/image/logo-login.png" style="width: auto; max-height: 100px">
        </div>
      </div>
      <div id="form-login-right"
           class="col-12 col-md-7"
           style="padding: 30px 25px">
        <h4 class="text-primary text-center q-mt-none q-mb-md q-pb-sm"
            style="border-bottom: 2px solid #f1f1f1; font-size: 34px">
          LOGIN
        </h4>
        <!-- USER -->
        <q-field
          :error="$v.form.username.$error"
          error-label="This field is required"
          class="q-mb-md"
        >
          <q-input name="username"
                   autofocus
                   autocomplete="off"
                   v-model="form.username"
                   type="text"
                   :before="[{icon: 'person'}]"
                   @keyup.enter="authenticate()"
                   float-label="Email"
          />
        </q-field>
        <!-- PASS -->
        <q-field
          :error="$v.form.password.$error"
          error-label="This field is required"
          class="q-my-md"
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
        <div class="text-center q-pt-lg">
          <q-btn :loading="loading_login"
                 color="primary"
                 name="submit"
                 @click="authenticate()">
            LOGIN
            <span slot="loading">
                <q-spinner-hourglass class="on-left"/>
                VALIDATING...
              </span>
          </q-btn>
        </div>

        <!--
        <div class="q-subheading text-center text-primary q-pt-md" link>
          Forgot your password?
        </div>
        -->

      </div>
    </div>

  </q-page>
</template>

<script>
  /*Plugins*/
  import {required, email, numeric, minLength} from 'vuelidate/lib/validators';
  import {alert} from '@imagina/qhelper/_plugins/alert'
  import {helper} from '@imagina/qhelper/_plugins/helper'
  import authService from '@imagina/quser/_services/profile/index';
  export default {
    data() {
      return {
        form: {
          username: '',
          password: ''
        },
        rememberData: true,
        loading_login: false
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
        this.$v.$touch();

        if (this.$v.$error) {
          alert.error('Please review fields again.', 'bottom');
        } else {
          this.loading_login = !this.loading_login;
          const {username, password} = this.form;

          this.$store.dispatch("auth/AUTH_REQUEST", {username, password}).then((response) => {
            this.loading_login = !this.loading_login;
          });
        }
      },

    }
  }
</script>
<style lang="stylus">
  @import "~variables";
  #form_login
    width 240px

  #form-login-left
    min-height 150px
    .bg-color
      background-color $primary
      height 100%
      width 100%
</style>
