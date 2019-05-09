<template>
  <div class="">
    <q-layout class="flex flex-center q-pt-xl">
      <q-page-container>
        <q-page>

          <div class="row shadow-1 q-mx-md q-mt-xl" style="width: 550px;">
            <div id="form-login-left" class="col-xs-12">
              <div class="bg-color flex flex-center">
                <img src="../../../../src/assets/image/logo-login.png" style="width: auto; max-height: 100px">
              </div>
            </div>

            <div id="form-login-right"
              class="col-xs-12"
              style="padding: 30px 25px">
              <h4 class="text-primary text-center q-mt-none q-mb-md q-pb-xs">
                REGISTRO
              </h4>
              <!-- USER -->
              <q-field
                :error="$v.form.first_name.$error"
                error-label="This field is required"
                class="q-mb-md">
                <q-input 
                  autofocus
                  autocomplete="off"
                  v-model="form.first_name"
                  type="text"
                  :before="[{icon: 'person'}]"
                  float-label="First Name"
                />
              </q-field>


              <q-field
                :error="$v.form.last_name.$error"
                error-label="This field is required"
                class="q-mb-md">
                <q-input name="email"
                  autofocus
                  autocomplete="off"
                  v-model="form.last_name"
                  type="text"
                  :before="[{icon: 'person'}]"
                  float-label="Last Name"
                />
              </q-field>

              <q-field
                :error="$v.form.email.$error"
                error-label="This field is required"
                class="q-mb-md">
                <q-input name="email"
                  autofocus
                  autocomplete="off"
                  v-model="form.email"
                  type="text"
                  :before="[{icon: 'email'}]"
                  float-label="Email"
                />
              </q-field>

              <q-field
                :error="$v.form.password.$error"
                error-label="This field is required"
                class="q-mb-md">
                <q-input name="email"
                  autofocus
                  autocomplete="off"
                  v-model="form.password"
                  type="password"
                  :before="[{icon: 'lock'}]"
                  float-label="Password"
                />
              </q-field>

              <q-field
                :error="$v.form.password_confirmation.$error"
                error-label="This field is required"
                class="q-mb-md">
                <q-input name="email"
                  autofocus
                  autocomplete="off"
                  v-model="form.password_confirmation"
                  type="password"
                  :before="[{icon: 'lock'}]"
                  float-label="Password Confirmation"/>
              </q-field>      

              <div class="text-center q-pt-lg">
                <q-btn :loading="loading_login"
                  color="primary"
                  name="submit"
                  @click="registerUser()">
                  Register
                  <span slot="loading">
                      <q-spinner-hourglass class="on-left"/>
                      VALIDATING...
                    </span>
                </q-btn>
              </div>
            </div>
          </div>

        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
    //Plugins
    import {required, email, numeric, minLength} from 'vuelidate/lib/validators';
    //Services
    import authService from '@imagina/quser/_services/profile/index';

  export default {
    data() {
      return {
        loading_login: false,
        form: {
          last_name: '',
          first_name: '',
          email: '',
          password: '',
          password_confirmation: '',
          roles: [],
          public_form: true,
          status: 1      
        }
      }
    }, 
    validations: {
      form: {
        last_name: {required},
        first_name: {required},
        email: {required, email},
        password: {required},
        password_confirmation: {required},
      }
    },
    methods:{
      registerUser(){
        this.$v.$touch();
        if (this.$v.$error) {
          alert.error('Please review fields again.', 'bottom');
          return
        }
        let data = {attributes:this.form}
        userService.register(data)
        .then(response=>{
          this.$router.push({name:"auth.login"})
        })
        .catch(error=>{
          console.warn(error)
        })
      }
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

