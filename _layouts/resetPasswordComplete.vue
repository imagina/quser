<template>
  <div id="authResetPassword" class="bg-grey-2 flex flex-center">
    <!--Form-->
    <q-card>
      <q-card-section class="q-py-sm">
        <!--Title-->
        <div class="text-primary text-h6">{{$tr('quser.layout.label.reset')}}</div>

        <q-separator class="q-mt-xs q-mb-md"/>

        <!--Form-->
        <q-form @submit="changePassword()" autocomplete="off"
                @validation-error="$alert.error($tr('ui.message.formInvalid'))">
          <!--Password-->
          <q-input name="username" autofocus ref="username" autocomplete="off" outlined dense
                   :label="`${$tr('ui.form.password')} *`" v-model="form.password" type="password" color="blue-grey"
                   :rules="[val => !!val || $tr('ui.message.fieldRequired')]"/>

          <!--Email field-->
          <q-input name="username" ref="username" autocomplete="off" outlined dense
                   :label="`${$tr('ui.form.checkPassword')} *`" v-model="form.passwordConfirmation"
                   type="password" color="blue-grey" :rules="[
                    val => !!val || $tr('ui.message.fieldRequired'),
                    val => val == form.password || $tr('ui.message.fieldCheckPassword')
                   ]"/>

          <!--Button submit-->
          <div class="text-center">
            <q-btn :loading="loading" color="primary" type="submit"
                   :label="$tr('quser.layout.label.resetPassword')">
              <div slot="loading">
                <q-spinner-oval class="on-left"/>
                {{`${$tr('ui.label.validating')}...`}}
              </div>
            </q-btn>
          </div>
        </q-form>

        <!--Button Login-->
        <div class="text-center q-mt-sm">
          <q-btn flat label="Iniciar sesion" :to="{name : 'auth.login'}" color="grey-8"/>
        </div>
      </q-card-section>
    </q-card>

    <!--Dialog message-->
    <q-dialog persistent v-model="showMessage">
      <q-card>
        <q-card-section>
          <!--Title-->
          <div class="text-positive text-center text-h6">
            <q-icon name="fas fa-check" size="20px"/>
            {{$tr('ui.label.ready')}}
          </div>

          <!--Message-->
          <p class="text-subtitle1 text-justify">
            {{$tr('quser.layout.message.changend')}}
          </p>
          <!--Button login-->
          <div class="text-center q-mt-sm">
            <q-btn :label="$tr('quser.layout.label.login')"
                   :to="{name : 'auth.login', query : {email : email}}" color="primary"/>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          password: null,
          passwordConfirmation: null,
        },
        email : '',
        showMessage: false,
        loading: false,
      }
    },
    methods: {
      //send
      async changePassword() {
        this.loading = true;
        //Request params
        let requestParams = {
          password: this.form.password,
          passwordConfirmation: this.form.passwordConfirmation,
          userId: this.$route.params.userId,
          token: this.$route.params.token
        }

        this.$store.dispatch("quserAuth/CHANGED_PASSWORD_REQUEST", requestParams).then(response => {
          this.loading = false
          if(response.data && response.data.email) this.email = response.data.email
          this.showMessage = true
        }).catch(error => {
          this.$alert.error(this.$tr('ui.message.errorRequest'))
          this.loading = false
        });
      },
    }
  }
</script>

<style lang="stylus">
  #authResetPassword
    min-height 100vh
</style>
