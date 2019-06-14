<template>
  <div id="formLoginComponent">
    <!-- Name field -->
    <q-field
      :error="$v.form.firstName.$error"
      error-label="Este campo es requerido"
    >
      <div class="input-title">
        <q-icon name="fas fa-user"/>
        Nombre
      </div>
      <q-input name="username"
               autofocus
               autocomplete="off"
               v-model="form.firstName"
               type="text"
               color="blue-grey"
               @keyup.enter="register()"
      />
    </q-field>
    <!-- Last Name field -->
    <q-field
      :error="$v.form.lastName.$error"
      error-label="Este campo es requerido"
    >
      <div class="input-title">
        <q-icon name="fas fa-user-friends"/>
        Apellidos
      </div>
      <q-input name="username"
               autocomplete="off"
               v-model="form.lastName"
               type="text"
               color="blue-grey"
               @keyup.enter="register()"
      />
    </q-field>
    <!-- Email field -->
    <q-field
      :error="$v.form.email.$error"
      error-label="Debe tener formato de e-mail"
    >
      <div class="input-title">
        <q-icon name="fas fa-at"/>
        Email
      </div>
      <q-input name="username"
               autocomplete="off"
               v-model="form.email"
               type="text"
               color="blue-grey"
               @keyup.enter="register()"
      />
    </q-field>
    <!-- Password field -->
    <q-field
      :error="$v.form.password.$error"
      error-label="Debe contener al menos 8 digitos"
    >
      <div class="input-title">
        <q-icon name="fas fa-lock"/>
        Contraseña
      </div>
      <q-input v-model="form.password"
               type="password"
               name="password"
               color="blue-grey"
               @keyup.enter="register()"
      />
    </q-field>
    <!-- comfirm Password field -->
    <q-field
      :error="$v.form.passwordConfirmation.$error"
      error-label="No coincide con la contraseña"
    >
      <div class="input-title">
        <q-icon name="fas fa-user-lock"/>
        Confirmar Contraseña
      </div>
      <q-input v-model="form.passwordConfirmation"
               type="password"
               name="password"
               color="blue-grey"
               @keyup.enter="register()"
      />
    </q-field>
    <!--captcha-->
    <captcha v-model="form.captcha" ref="captcha" />
    <!-- Button login -->
    <div class="text-center q-mt-sm">
      <q-btn :loading="loading"
             color="blue-grey" name="submit"
             @click="register()">
        Completar Registro
        <span slot="loading">
                <q-spinner-mat class="on-left"/>
                Registrando...
              </span>
      </q-btn>
    </div>
  </div>
</template>

<script>
  //Plugins
  import {required, email, sameAs, minLength} from 'vuelidate/lib/validators';
  import _cloneDeep from 'lodash.clonedeep'
  //services
  import authServices from '@imagina/quser/_services/profile/index'
  //components
  import captcha from '@imagina/qsite/_components/captcha'

  export default {
    components :{captcha},
    validations: {
      form: {
        firstName: {required},
        lastName: {required},
        email: {required,email},
        password: {required, minLength: minLength(8)},
        passwordConfirmation: {required, sameAsPassword: sameAs('password')}
      }
    },
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {
        loading : false,
        form: {
          firstName : null,
          lastName : null,
          email: null,
          password: null,
          passwordConfirmation: null,
          captcha: false
        },
      }
    },
    computed : {
      initData(){
        return {
          firstName : null,
          lastName : null,
          email: null,
          password: null,
          passwordConfirmation: null
        }
      }
    },
    methods: {
      //Login
      async register() {
        if (!this.inRequest) {
          this.$v.$touch();
          if (!this.$v.$error) {
            if(this.checkedCaptcha()){
              this.loading = true;
              authServices.crud.create('apiRoutes.profile.register',this.form).then(response => {
                this.callbackRequest()
              }).catch(error => {
                this.callbackRequest(false, error)
              })
            }
          }else{
            this.$helper.alert.error('Revise los campos inválidos','bottom')
          }
        }
      },
      //check if captcha is defined
      checkedCaptcha(){
        let captcha = this.form.captcha
        let response = false
        if(captcha && captcha.token) response = true
        if(!response) this.$helper.alert.error('El reCaptcha es requerido','bottom')
        return response
      },
      //Action after request
      callbackRequest(success = true, error){
        this.$v.$reset()//Reset validations
        this.loading = false
        this.$refs.captcha.reset()

        if(success){
          //Dialog to go to iniciar sesión when id register
          this.$q.dialog({
            title: 'Registro exitoso!',
            color: 'blue-grey',
            ok: 'Iniciar Sesion',
            cancel: false,
            noBackdropDismiss: true,
            noEscDismiss: true,
          }).then(async data => {
            this.$emit('input',this.form.email)
            let captcha = _cloneDeep(this.form.captcha)
            this.form = _cloneDeep(this.initData)//inti form
            this.form.captcha = captcha
          }).catch(() => {})
        }else{
          console.error('[auth.register]',error)
          if(error){//Message Vali
            let errorMsg = JSON.parse(error)
            if(errorMsg.email)
              this.$helper.alert.error(
                'El Email "'+this.form.email+'" ya está registrado',
                'top', false, 4000
              )
          }
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import "~variables";
</style>
