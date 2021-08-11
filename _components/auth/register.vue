<template>
  <div id="formLoginComponent" class="relative-position">
    <!--Dynamic form-->
    <dynamic-form v-model="form" :blocks="dynamicForm.blocks" @submit="register()" :actions="dynamicForm.actions"
                  :title="$tr('quser.layout.label.createAccount').toUpperCase()" class="q-mb-md" :loading="loading"
                  :form-id="dynamicForm.formId" default-col-class="col-12"/>

    <!--Login-->
    <div class="text-center full-width">
      <q-btn :label="$tr('quser.layout.label.login')" unelevated no-caps
             :to="{name : 'auth.login',query : this.$route.query}" color="blue-grey" rounded flat/>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      form: {},
      authRoles: [],
      defaultFields: ['roleId', 'email', 'password', 'passwordConfirmation', 'firstName', 'lastName']
    }
  },
  computed: {
    dynamicForm() {
      //Get Role selected
      let roleSelected = !this.form.roleId ? false : this.authRoles.find(item => item.id == this.form.roleId)
      //Instance default form id
      let defaultFormId = (this.authRoles && (this.authRoles.length == 1)) ? this.authRoles[0].formId : null

      //Instace response
      let response = {
        formId: roleSelected ? roleSelected.formId : defaultFormId,
        actions: {
          submit: {
            label: this.$tr('quser.layout.label.createAccount'),
            color: 'primary',
            icon: null
          }
        },
        blocks: [
          {
            fields: {
              firstName: {
                value: null,
                type: 'input',
                colClass: 'col-12',
                props: {
                  label: `${this.$tr('ui.form.firstName')}*`,
                  rules: [val => !!val || this.$tr('ui.message.fieldRequired')]
                }
              },
              lastName: {
                value: null,
                type: 'input',
                colClass: 'col-12',
                props: {
                  label: `${this.$tr('ui.form.lastName')}*`,
                  rules: [val => !!val || this.$tr('ui.message.fieldRequired')]
                }
              },
              email: {
                value: null,
                type: 'input',
                colClass: 'col-12',
                props: {
                  label: `${this.$tr('ui.form.email')}*`,
                  rules: [
                    val => !!val || this.$tr('ui.message.fieldRequired'),
                    val => this.$helper.validateEmail(val) || this.$tr('ui.message.fieldEmail')
                  ]
                }
              },
              password: {
                value: null,
                type: 'input',
                colClass: 'col-12',
                props: {
                  label: `${this.$trp('ui.form.password')}*`,
                  type: 'password',
                  vIf: this.form.changePassword,
                  rules: [
                    val => !!val || this.$tr('ui.message.fieldRequired'),
                    val => val.length >= 6 || this.$tr('ui.message.fieldMinLeng', {num: 6})
                  ]
                }
              },
              passwordConfirmation: {
                value: null,
                type: 'input',
                colClass: 'col-12',
                props: {
                  label: `${this.$trp('ui.form.checkPassword')}*`,
                  type: 'password',
                  vIf: this.form.changePassword,
                  rules: [
                    val => !!val || this.$tr('ui.message.fieldRequired'),
                    val => (this.form.password == val) || this.$tr('ui.message.fieldCheckPassword'),
                  ]
                }
              },
            }
          }
        ]
      }

      //Add blocks to auth roles
      if (this.authRoles && (this.authRoles.length >= 2)) {
        response.blocks.unshift({
          fields: {
            roleId: {
              value: null,
              type: 'optionGroup',
              colClass: 'col-12',
              props: {
                options: this.authRoles.map(item => {
                  return {label: `${this.$tr('quser.layout.label.registerAs')} ${item.name}`, value: item.id}
                }),
                color: 'secondary',
                rules: [val => !!val || this.$tr('ui.message.fieldRequired')]
              }
            }
          }
        })
      }

      //Response
      return response
    },
    //Get settings data
    settings() {
      return {
        politics: this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::registerUserWithPoliticsOfPrivacy'),
        terms: this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::registerUserWithTermsAndConditions'),
        rolesToRegister: this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::rolesToRegister')
      }
    },
    //Termns and conditions
    termsAndConditions() {
      if (config('app.mode') != 'ipanel') return false
      let settings = this.settings

      //Validate settin data
      if (!settings.politics && !settings.terms) return false

      //Add links to terms and conditions
      let concatData = ''
      if (settings.politics)
        concatData += `<a href="${settings.politics}" target="_blank" class="text-green"><b>${this.$tr('quser.layout.message.privacyPolicy')}</b></a>,`
      if (settings.terms)
        concatData += `<a href="${settings.terms}" target="_blank" class="text-green"><b>${this.$tr('quser.layout.message.termsAndConditions')}</b></a>,`

      //Default response
      let response = {
        message: this.$tr('quser.layout.message.privacyData', {
          concatData: concatData,
          siteName: this.$store.getters['qsiteApp/getSettingValueByName']('core::site-name')
        }),
        field: {
          name: 'terms',
          value: false,
          type: 'checkbox',
          props: {
            rules: [val => !!val || this.$tr('ui.message.fieldRequired')]
          }
        }
      }

      //Response
      return response
    }
  },
  methods: {
    //Init template
    async init() {
      this.getAuthRoles()
    },
    //Get auth roles
    getAuthRoles() {
      if (this.settings.rolesToRegister) {
        this.loading = true
        //Request params
        let requestParams = {
          refresh: true,
          params: {filter: {id: this.settings.rolesToRegister}}
        }
        //Request
        this.$crud.index('apiRoutes.quser.roles', requestParams).then(response => {
          this.authRoles = response.data
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
      }
    },
    //Get formData
    getFormData() {
      let form = this.$clone(this.form)
      let response = {fields: {}}

      //Set form fields to send api
      Object.keys(form).forEach(itemName => {
        if (this.defaultFields.includes(itemName)) response[itemName] = form[itemName]
        else response.fields[itemName] = form[itemName]
      })

      //Response
      return response
    },
    //Login
    async register() {
      this.loading = true
      //Request
      this.$crud.create('apiRoutes.quser.register', this.getFormData()).then(response => {
        //Auth Data
        let authData = {username: this.form.email, password: this.form.password}
        //Login
        this.$store.dispatch('quserAuth/AUTH_REQUEST', authData).then((response) => this.$emit('logged'))
        //Hidden loading
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="stylus">
#formLoginComponent
  max-width 400px

  .q-option-group
    width 100%

    .q-radio
      width 100%
      border 2px solid $secondary
      border-radius $custom-radius-items
      margin-bottom 10px
      padding 10px

      .q-radio__label
        color $blue-grey
</style>
