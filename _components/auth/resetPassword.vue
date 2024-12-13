<template>
  <div id="authResetPassword">
    <div id="formResetPasswordContent">
      <div v-if="settings.authRegisterCaption && (settings.authRegisterCaption != 'null')"
         class="text-center text-caption text-grey-8 q-mb-md">
      {{ settings.authRegisterCaption }}
      </div>
      <!--Dynamic form-->
      <div id="formContent">
        <dynamic-form v-model="form" :blocks="dynamicForm.blocks" @submit="resetPassword()" :actions="dynamicForm.actions"
                      :title="$tr('iprofile.cms.label.resetPassword').toUpperCase()" class="q-mb-md" :loading="loading"
                      default-col-class="col-12" :use-captcha="settings.activateCaptcha ? true : false" />
      </div>
      <!--Login-->
      <div class="text-center full-width">
        <q-btn :label="$tr('iprofile.cms.label.login')" unelevated no-caps
              :to="{name : 'auth.login',query : this.$route.query}" color="blue-grey" rounded flat/>
      </div>
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
      form: null,
      modal: {
        show: false,
        message: null
      }
    };
  },
  computed: {
    //Get settings data
    settings() {
      return {
        politics: this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::registerUserWithPoliticsOfPrivacy'),
        terms: this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::registerUserWithTermsAndConditions'),
        authRegisterCaption: this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::authRegisterCaption'),
        activateCaptcha: parseInt(this.$store.getters['qsiteApp/getSettingValueByName']('isite::activateCaptcha')),
      }
    },
    dynamicForm(){
      return {
        actions: {
          submit: {
            label: this.$tr('isite.cms.label.reset'),
            color: 'primary',
            icon: null
          },
          login: {
            label: this.$tr('iprofile.cms.label.login'),
            to: {
              name : 'auth.login',
              query : this.$route.query
            },
            color: "blue-grey-1",
            textColor:"blue-grey"
          }
        },
        blocks: [
          {
            name: 'main',
            fields: {
              username: {
                value: null,
                type: 'input',
                //colClass: 'col-12',
                props: {
                  label: `${this.$tr('isite.cms.form.email')}*`,
                  rules: [
                    val => !!val || this.$tr('isite.cms.message.fieldRequired'),
                    val => this.$helper.validateEmail(val) || this.$tr('isite.cms.message.fieldEmail')
                  ]
                }
              },
            }
          }
        ]
      }
    }
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
