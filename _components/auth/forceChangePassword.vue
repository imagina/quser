<template>
  <div id="authResetPassword" class="flex flex-center content-start">
    <!--Form-->
    <dynamic-form v-model="form" :blocks="dynamicForm.blocks" @submit="changePassword()" no-actions
                  :title="$tr('iprofile.cms.label.changePassword').toUpperCase()" class="q-mb-md"
                  default-col-class="col-12" ref="changePasswordForm"/>
    <!--Actions-->
    <div class="row justify-between full-width">
      <!--Login-->
      <q-btn :label="$tr('iprofile.cms.label.login')" unelevated no-caps rounded text-color="blue-grey"
             :to="{name : 'auth.login',query : this.$route.query}" color="blue-grey-1"/>
      <!-- Submit -->
      <q-btn :loading="loading" type="submit" color="primary" rounded unelevated no-caps
             @click="$refs.changePasswordForm.changeStep('next', true)">
        {{ $tr('iprofile.cms.label.reset') }}
        <template v-slot:loading>
          <q-spinner-oval/>
        </template>
      </q-btn>
    </div>
  </div>
</template>

<script>
import crud from "modules/qcrud/_services/baseService";

export default {
  data() {
    return {
      form: {},
      loading: false,
    }
  },
  computed: {
    dynamicForm() {
      return {
        actions: {
          submit: {
            label: this.$tr('iprofile.cms.label.reset'),
            color: 'primary',
            icon: null
          }
        },
        blocks: [
          {
            //title: 'Main Block',
            name: 'main',
            fields: {
              textInfo: {
                type: 'banner',
                vIf: this.$store.state.quserAuth.shouldChangePassword.shouldChangePassword,
                props: {
                  textColor: 'white',
                  color: 'amber',
                  icon: 'fas fa-exclamation-triangle',
                  message: this.$store.state.quserAuth.shouldChangePassword?.description || ""
                }
              },
              password: {
                value: null,
                type: 'input',
                props: {
                  label: `${this.$trp('isite.cms.form.password')}*`,
                  type: 'password',
                  vIf: this.form.changePassword,
                  rules: [
                    val => !!val || this.$tr('isite.cms.message.fieldRequired'),
                    val => val.length >= 6 || this.$tr('isite.cms.message.fieldMinLeng', {num: 6})
                  ]
                }
              },
              newPassword: {
                value: null,
                type: 'input',
                props: {
                  label: `${this.$tr('iprofile.cms.label.newpassword')}*`,
                  type: 'password',
                  rules: [
                    val => !!val || this.$tr('isite.cms.message.fieldRequired'),
                    val => val.length >= 6 || this.$tr('isite.cms.message.fieldMinLeng', {num: 6})
                  ]
                }
              },
              newPasswordConfirmation: {
                value: null,
                type: 'input',
                props: {
                  label: `${this.$trp('isite.cms.form.checkPassword')}*`,
                  type: 'password',
                  rules: [
                    val => !!val || this.$tr('isite.cms.message.fieldRequired'),
                    val => (this.form.newPassword == val) || this.$tr('isite.cms.message.fieldCheckPassword'),
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
    //Submit change password
    async changePassword() {
      this.loading = true;
      //Request data
      let requestData = {
        attributes: {
          ...this.form,
          email: this.$store.state.quserAuth.userData.email
        }
      }

      //Change password
      this.$crud.post('apiRoutes.quser.changePassword', requestData).then(response => {
        this.$alert.success({
          mode: 'modal',
          title: this.$tr('iprofile.cms.label.changePassword'),
          message: this.$tr('iprofile.cms.message.changend'),
          actions: [
            {
              label: this.$tr('iprofile.cms.label.login'),
              handler: async () => {
                await this.$store.dispatch("quserAuth/AUTH_LOGOUT")
                this.$router.push({name: "auth.login", query: this.$route.query})
                this.loading = false;
              }
            }
          ]
        })
      }).catch(error => {
        this.loading = false
      });
    },
  }
}
</script>

<style lang="scss">
#authResetPassword {
  .format-container {
    position: relative;

    #btnGoLogin {
      position: absolute;
      bottom: 31px;
      left: 26px;

      a {
        border-radius: 10px;
      }
    }
  }

  #progressContent {
    .q-linear-progress {
      background-color: #fff;
      color: #fff !important;
    }
  }
}
</style>
