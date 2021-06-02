<template>
  <div id="authResetPassword" class="flex flex-center">
    <div id="formResetPasswordContent" class="q-px-md">
      <!--Logo-->
      <div class="text-center">
        <img id="logo" :src="$store.getters['qsiteApp/getSettingMediaByName']('isite::logo1').path"></img>
      </div>
      <!--Form-->
      <div class="box">
        <!--Title-->
        <div class="box-title text-uppercase q-mb-sm">
          {{ $tr('quser.layout.label.resetPassword') }}
        </div>

        <!--Form-->
        <q-form @submit="resetPassword()" autocomplete="off"
                @validation-error="$alert.error($tr('ui.message.formInvalid'))">
          <!--Email field-->
          <q-input name="username" autofocus ref="username" autocomplete="off" outlined dense
                   :label="`${$tr('ui.form.email')} *`" v-model="form.username" type="text" color="blue-grey"
                   class="q-mb-sm" :rules="[
                      val => !!val || $tr('ui.message.fieldRequired'),
                      val => $helper.validateEmail(val) || $tr('ui.message.fieldEmail')]"/>

          <!--Actions-->
          <div class="row justify-between">
            <!--Button Login-->
            <q-btn :label="$tr('quser.layout.label.login')" no-caps rounded unelevated
                   :to="{name : 'auth.login'}" color="blue-grey-1" text-color="blue-grey"/>
            <!--Button submit-->
            <q-btn :loading="loading" color="primary" type="submit" :label="$tr('ui.label.reset')"
                   unelevated rounded no-caps>
              <div slot="loading">
                <q-spinner-oval class="on-left"/>
                {{ `${$tr('ui.label.validating')}...` }}
              </div>
            </q-btn>
          </div>
        </q-form>
      </div>
    </div>

    <!--Dialog message-->
    <q-dialog persistent v-model="showMessage">
      <q-card>
        <q-card-section>
          <!--Message-->
          <p class="text-subtitle1 text-justify">{{ $tr('quser.layout.message.passwordUpdated') }}</p>
          <!--Button login-->
          <div class="text-center q-mt-sm">
            <q-btn label="Iniciar sesion" :to="{name : 'auth.login'}" color="primary"/>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  props: {
    email: {default: null},
  },
  watch: {
    email() {
      this.setEmail()
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
        username: ''
      },
      showMessage: false,
      loading: false,
    }
  },
  methods: {
    //Login
    async resetPassword() {
      this.loading = true;
      const {username} = this.form;
      this.$store.dispatch("quserAuth/RESET_PASSWORD_REQUEST", {username}).then((response) => {
        this.loading = false;
        this.showMessage = true
      }).catch(error => {
        this.loading = false;
      });
    },

    //Set email
    setEmail() {
      if (this.email) {
        this.form.username = this.$clone(this.email)
      } else this.$refs.username.focus()
    }
  }
}
</script>

<style lang="stylus">
#authResetPassword
  background-color $custom-accent-color
  min-height 100vh

  #formResetPasswordContent
    max-width 400px
    width 400px

    #logo
      max-width 340px
      height 100px
      max-height 100px
      margin-bottom 25px
</style>
