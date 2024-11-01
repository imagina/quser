<template>
  <div id="authResetPassword">
    <div id="formResetPasswordContent">
      <!--Title-->
      <div class="box-title text-uppercase q-mb-sm text-center">
        {{ $tr('iprofile.cms.label.resetPassword') }}
      </div>

      <!--Form-->
      <q-form @submit="resetPassword()" autocomplete="off"
              @validation-error="$alert.error($tr('isite.cms.message.formInvalid'))">
        <!--Email field-->
        <q-input name="username" autofocus ref="username" autocomplete="off" outlined dense
                 :label="`${$tr('isite.cms.form.email')} *`" v-model="form.username" type="text" color="blue-grey"
                 class="q-mb-sm" :rules="[
                      val => !!val || $tr('isite.cms.message.fieldRequired'),
                      val => $helper.validateEmail(val) || $tr('isite.cms.message.fieldEmail')]" />

        <!--Captcha-->
        <dynamic-field :field="{type : 'captcha'}" v-model="form.captcha" />

        <!--Actions-->
        <div class="row justify-between">
          <!--Button Login-->
          <q-btn :label="$tr('iprofile.cms.label.login')" no-caps rounded unelevated
                 :to="{name : 'auth.login',query : this.$route.query}" color="blue-grey-1" text-color="blue-grey" />
          <!--Button submit-->
          <q-btn :loading="loading" color="primary" type="submit" :label="$tr('isite.cms.label.reset')"
                 unelevated rounded no-caps>
            <template v-slot:loading>
              <q-spinner-oval class="on-left" />
              {{ `${$tr('isite.cms.label.validating')}...` }}
            </template>
          </q-btn>
        </div>
      </q-form>
    </div>

    <!--Dialog message-->
    <q-dialog persistent v-model="modal.show">
      <q-card>
        <q-card-section>
          <!--Message-->
          <p class="text-subtitle1 text-justify">{{ modal.message }}</p>
          <!--Button login-->
          <div class="text-center q-mt-sm">
            <q-btn unelevated rounded :label="$tr('iprofile.cms.label.login')" :to="{name : 'auth.login'}"
                   color="primary" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  props: {
    email: { default: null }
  },
  watch: {
    email() {
      this.setEmail();
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.setEmail();
    });
  },
  data() {
    return {
      loading: false,
      form: {
        username: '',
        captcha: false
      },
      modal: {
        show: false,
        message: null
      }
    };
  },
  methods: {
    //Login
    async resetPassword() {
      this.loading = true;
      const { username, captcha } = this.form;
      this.$store.dispatch('quserAuth/RESET_PASSWORD_REQUEST', { username, captcha }).then((response) => {
        this.loading = false;
        this.modal = {
          show: true,
          message: response.data?.message || this.$tr('iprofile.cms.message.reset')
        };
      }).catch(({ response }) => {
        this.$alert.error(response.data.errors);
        this.loading = false;
      });
    },

    //Set email
    setEmail() {
      if (this.email) {
        this.form.username = this.$clone(this.email);
      } else this.$refs.username.focus();
    }
  }
};
</script>

<style lang="scss">

</style>
