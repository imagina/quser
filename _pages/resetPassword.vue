<template>
  <div id="authResetPassword" class="bg-grey-2 flex flex-center">
    <!--Form-->
    <q-card>
      <q-card-section class="q-py-sm">
        <!--Title-->
        <div class="text-primary text-h6">{{$tr('quser.layout.label.reset')}}</div>

        <q-separator class="q-mt-xs q-mb-md"/>

        <!--Form-->
        <q-form @submit="resetPassword()" autocomplete="off"
                @validation-error="$alert.error($tr('ui.message.formInvalid'))">
          <!--Email field-->
          <q-input name="username" autofocus ref="username" autocomplete="off" outlined dense
                   :label="`${$tr('ui.form.email')} *`" v-model="form.username" type="text" color="blue-grey"
                   class="q-mb-sm" :rules="[
                      val => !!val || $tr('ui.message.fieldRequired'),
                      val => $helper.validateEmail(val) || $tr('ui.message.fieldEmail')]"/>

          <!--Button submit-->
          <div class="text-center">
            <q-btn :loading="loading" color="primary" type="submit" :label="$tr('quser.layout.label.reset')">
              <div slot="loading">
                <q-spinner-oval class="on-left"/>
                {{`${$tr('ui.label.validating')}...`}}
              </div>
            </q-btn>
          </div>
        </q-form>

        <!--Button Login-->
        <div class="text-center q-mt-sm">
          <q-btn flat :label="$tr('quser.layout.label.login')"
                 :to="{name : 'auth.login'}" color="grey-8"/>
        </div>
      </q-card-section>
    </q-card>

    <!--Dialog message-->
    <q-dialog persistent v-model="showMessage">
      <q-card>
        <q-card-section>
          <!--Title-->
          <div class="text-primary text-center text-h6">{{$tr('quser.layout.label.reset')}}</div>
          <!--Message-->
          <p class="text-subtitle1 text-justify">{{$tr('quser.layout.message.reset')}}</p>
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
    min-height 100vh
</style>
