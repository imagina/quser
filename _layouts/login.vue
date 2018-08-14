<template>
  <q-page class="flex flex-center">

    <div class="row shadow-3 q-mx-xl" style="width: 550px">
      <div id="form-login-left" class="col-md-5">
        <div class="bg-color flex flex-center">
          <img src="../_assets/image/logo_white.png" alt="">
        </div>
      </div>
      <div id="form-login-right"
           class="col-md-7"
           style="padding: 30px 25px">
        <h4 class="text-primary text-center q-mt-none q-mb-xl q-pb-lg"
            style="border-bottom: 2px solid #f1f1f1; font-size: 34px">
          LOGIN
        </h4>
        <!-- USER -->
        <q-field
          :error="$v.form.username.$error"
          error-label="This field is required"
          class="q-mb-xl"
        >
          <q-input name="email"
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
          class="q-my-xl"
        >
          <q-input v-model="form.password"
                   type="password"
                   name="password"
                   :before="[{icon: 'lock'}]"
                   @keyup.enter="authenticate()"
                   float-label="Password"
          />
        </q-field>

        <div class="text-right q-pb-xl">
          <q-checkbox v-model="rememberData" label="Remember me"/>
        </div>

        <!--=== LOGIN ===-->
        <div class="text-center">
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

        <div class="q-subheading text-center text-primary q-pt-xl" link>
          Forgot your password?
        </div>

      </div>
    </div>

  </q-page>
</template>

<script>
  import {required, email, numeric, minLength} from 'vuelidate/lib/validators';
  import {alert} from 'src/plugins/alert'

  export default {
    data() {
      return {
        form: {
          username: null,
          password: null
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

          this.$store.dispatch("auth/AUTH_REQUEST", {username, password}).then(response => {
            this.loading_login = !this.loading_login;
          });
        }
      },

    }
  }
</script>
<style lang="stylus">
  #form_login
    width 240px

  #form-login-left
    background-image url('../_assets/background_login.png')
    min-height 150px
    .bg-color
      background-color rgba(2, 123, 227, 0.71)
      height 100%
      width 100%
</style>
