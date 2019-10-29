<template>
  <q-page id="pageResetPassword" class="flex flex-center">

    <!--Form-->
    <div class="row shadow-3 q-mx-md" style="width: 350px">
      <div id="form-login-right" class="col-12"
           style="padding: 30px 25px">

        <!-- TITLE -->
        <h4 class="q-headline text-primary text-center q-mt-none q-mb-md q-pb-sm"
            style="border-bottom: 2px solid #f1f1f1">
          {{$tr('quser.layout.label.resetPassword')}}
        </h4>

        <div v-if="formReset">
          <!-- WARNING -->
          <div class="q-body-1 text-center text-warning q-pb-md q-mb-md"
               style="border-bottom: 2px solid #f1f1f1">
            <q-icon name="warning"></q-icon>
            {{$tr('quser.layout.message.previousReset')}}
          </div>

          <!-- EMAIL -->
          <q-field
            :error="$v.form.email.$error"
            :error-label="$tr('ui.message.fieldEmail')"
          >
            <q-input autocomplete="off"
                     v-model="form.email"
                     :before="[{icon: 'email'}]"
                     :float-label="$tr('ui.form.email')"
            />
          </q-field>

          <!--=== Button Change ===-->
          <div class="text-center q-mt-md">
            <q-btn :loading="loading"
                   color="primary"
                   name="submit"
                   @click="resetPassword()">
              {{$tr('quser.layout.label.resetPassword')}}
              <span slot="loading">
		                			<q-spinner-hourglass class="on-left"/>
		                			 {{`${$tr('ui.label.loading')}...`}}
		              			</span>
            </q-btn>
          </div>

        </div>

        <q-alert color="primary" icon="email" v-if="!formReset">
          {{$tr('quser.layout.message.checkMail')}}
        </q-alert>

        <div class="remembered text-center q-mt-md">
          <router-link :to="{ name: 'auth.login'}" append>
            {{$tr('quser.layout.label.iremembered')}}
          </router-link>
        </div>

      </div>

    </div>

  </q-page>
</template>

<script>
  /*Plugins*/
  import {required, email, numeric, minLength} from 'vuelidate/lib/validators';
  import alert from '@imagina/qhelper/_plugins/alert'
  import {helper} from '@imagina/qhelper/_plugins/helper'
  import authService from '@imagina/quser/_services/profile/index';
  //Services
  import profileServices from '@imagina/quser/_services/profile'
  export default {
    data() {
      return {
        loading: false,
        formReset: true,
        form: {
          email: ''
        },
        inRequest: false
      }
    },
    validations: {
      form: {
        email: {required,email}
      }
    },
    mounted() {
      this.$nextTick(function () {
        //this.setFocus()
      })
    },
    methods: {
      //reset password
      resetPassword() {
        if (!this.inRequest) {//Check is already is in request
          this.$v.$touch();
          if (!this.$v.$error) {//Check if isn't errors in validate form
            this.loading = true
            this.inRequest = true
            profileServices.resetPassword(this.form).then(response => {
              this.formReset = false
              this.loading = false
            }).catch(error => {
              this.$alert.error({message : error, pos : 'top'})
              this.inRequest = false
              this.loading = false
            })
          }else{
            this.$alert.error({message: this.$tr('ui.message.formInvalid'), pos: 'bottom'})
          }
        }
      }
    }
  }
</script>

<style lang="stylus">
  #pageResetPassword
    .q-input
      padding-top 15px
    #form-login-left
      min-height 150px
      .bg-color
        background-color $primary
        height 100%
        width 100%
</style>
