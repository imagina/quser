<template>
  <div id="formLoginComponent">
    <!-- User field -->
    <q-field
      :error="$v.form.username.$error"
      error-label="Este campo es requerido"
    >
      <div class="input-title">
        <q-icon name="fas fa-user"/>
        Email
      </div>
      <q-input name="username"
               autofocus
               ref="username"
               autocomplete="off"
               v-model="form.username"
               type="text"
               color="blue-grey"
               @keyup.enter="authenticate()"
      />
    </q-field>
    <!-- Password field -->
    <q-field
      :error="$v.form.password.$error"
      error-label="Este campo es requerido"
    >
      <div class="input-title">
        <q-icon name="fas fa-lock"/>
        Contraseña
      </div>
      <q-input v-model="form.password"
               type="password"
               name="password"
               ref="password"
               color="blue-grey"
               @keyup.enter="authenticate()"
      />
    </q-field>
    <!-- Button login -->
    <div class="text-center q-mt-sm">
      <q-btn :loading="loading_login"
             color="blue-grey" name="submit"
             @click="authenticate()">
        Entrar
        <span slot="loading">
          <q-spinner-mat class="on-left"/>
          Validando...
        </span>
      </q-btn>
    </div>
  </div>
</template>

<script>
  //Plugins
  import {required, email, numeric, minLength} from 'vuelidate/lib/validators';
  import _cloneDeep from 'lodash.clonedeep'

  export default {
    props: {
      email: {default: null}
    },
    watch: {
      email() {
        this.setEmail()
      }
    },
    validations: {
      form: {
        username: {required},
        password: {required}
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.setEmail()
      })
    },
    data() {
      return {
        form: {
          username: '',
          password: ''
        },
        rememberData: true,
        loading_login: false,
        inRequest: false,
        fromRoute: false
      }
    },
    methods: {
      //Login
      async authenticate() {
        if (!this.inRequest) {
          this.$v.$touch();
          if (!this.$v.$error) {
            this.inRequest = true
            this.loading_login = true;
            const {username, password} = this.form;
            this.$store.dispatch("auth/AUTH_REQUEST", {username, password}).then((response) => {
              this.loading_login = false;
              this.inRequest = false
              this.$emit('logged')
            }).catch(error => {
              this.loading_login = false;
              this.inRequest = false
            });
          } else {
            this.$helper.alert.error('Revise los campos inválidos', 'bottom')
          }
        }
      },
      //Set email
      setEmail() {
        if (this.email) {
          this.form.username = _cloneDeep(this.email)
          this.$refs.password.focus()
        } else this.$refs.username.focus()
      }
    }
  }
</script>
<style lang="stylus">
  @import "~variables";
</style>
