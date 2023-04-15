<template>
  <div id="formLoginComponent" class="relative-position">
    <!--Caption-->
    <div v-if="settings.authRegisterCaption && (settings.authRegisterCaption != 'null')"
         class="text-center text-caption text-grey-8 q-mb-md">
      {{ settings.authRegisterCaption }}
    </div>
    <!--Dynamic form-->
    <div id="formContent">
      <dynamic-form v-model="form" :blocks="dynamicForm.blocks" @submit="register()" :actions="dynamicForm.actions"
                    :title="$tr('iprofile.cms.label.createAccount').toUpperCase()" class="q-mb-md" :loading="loading"
                    default-col-class="col-12" :use-captcha="settings.activateCaptcha ? true : false"/>
    </div>
    <!--Login-->
    <div class="text-center full-width">
      <q-btn :label="$tr('iprofile.cms.label.login')" unelevated no-caps
             :to="{name : 'auth.login',query : this.$route.query}" color="blue-grey" rounded flat/>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  watch: {
    async watchRoleId(newValue, oldValue) {
      //Call role form
      if (newValue && (newValue != this.selectedRoleId)) {
        this.selectedRoleId = this.$clone(newValue)
        await this.getRoleForm()
      }
      //set roleId selected.
      if (!newValue && this.selectedRoleId) this.form['role-roleId'] = this.$clone(this.selectedRoleId)
    }
  },
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
      extraBlocks: [],
      selectedRoleId: null,
      mainFields: ['roleId', 'email', 'password', 'passwordConfirmation', 'firstName', 'lastName', 'captcha'],
    }
  },
  props: {
    rolesToRegister: {
      type: String,
      default: 'iprofile::rolesToRegister'
    }
  },
  computed: {
    dynamicForm() {
      //Instace response
      let response = {
        actions: {
          submit: {
            label: this.$tr('iprofile.cms.label.createAccount'),
            color: 'primary',
            icon: null
          }
        },
        blocks: [
          {
            //title: 'Main Block',
            name: 'main',
            fields: {
              email: {
                value: null,
                type: 'input',
                colClass: 'col-12',
                props: {
                  label: `${this.$tr('isite.cms.form.email')}*`,
                  rules: [
                    val => !!val || this.$tr('isite.cms.message.fieldRequired'),
                    val => this.$helper.validateEmail(val) || this.$tr('isite.cms.message.fieldEmail')
                  ]
                }
              },
              password: {
                value: null,
                type: 'input',
                colClass: 'col-12',
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
              passwordConfirmation: {
                value: null,
                type: 'input',
                colClass: 'col-12',
                props: {
                  label: `${this.$trp('isite.cms.form.checkPassword')}*`,
                  type: 'password',
                  vIf: this.form.changePassword,
                  rules: [
                    val => !!val || this.$tr('isite.cms.message.fieldRequired'),
                    val => (this.form['main-password'] == val) || this.$tr('isite.cms.message.fieldCheckPassword'),
                  ]
                }
              },
              ...(this.termsAndConditions ? {terms: this.termsAndConditions} : {})
            }
          },
          ...this.$clone(this.extraBlocks)
        ]
      }

      //Add blocks to auth roles
      if (this.authRoles && (this.authRoles.length >= 2)) {
        response.blocks.unshift({
          //title: 'Role Block',
          name: 'role',
          fields: {
            roleId: {
              value: null,
              type: 'optionGroup',
              colClass: 'col-12',
              props: {
                options: this.authRoles.map(item => {
                  return {label: `${this.$tr('iprofile.cms.label.registerAs')} ${item.name}`, value: item.id}
                }),
                color: 'secondary',
                rules: [val => !!val || this.$tr('isite.cms.message.fieldRequired')]
              }
            }
          }
        })
      }

      //concat block name to fields
      response.blocks.forEach((block, blockKey) => {
        let fields = {}
        Object.keys(block.fields).forEach(fieldKey =>
          fields[`${block.name}-${fieldKey}`] = {...block.fields[fieldKey], name: `${block.name}-${fieldKey}`}
        )
        response.blocks[blockKey].fields = fields
      })

      //Response
      return response
    },
    //Get settings data
    settings() {
      return {
        politics: this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::registerUserWithPoliticsOfPrivacy'),
        terms: this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::registerUserWithTermsAndConditions'),
        rolesToRegister: this.$store.getters['qsiteApp/getSettingValueByName'](this.rolesToRegister) ||
          this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::rolesToRegister'),
        authRegisterCaption: this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::authRegisterCaption'),
        activateCaptcha: parseInt(this.$store.getters['qsiteApp/getSettingValueByName']('isite::activateCaptcha')),
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
        concatData += `<a href="${settings.politics}" target="_blank" class="text-green"><b>${this.$tr('iprofile.cms.message.privacyPolicy')}</b></a>,`
      if (settings.terms)
        concatData += `<a href="${settings.terms}" target="_blank" class="text-green"><b>${this.$tr('iprofile.cms.message.termsAndConditions')}</b></a>,`

      //Default response
      let response = {
        name: 'terms',
        value: false,
        type: 'checkbox',
        props: {
          rules: [val => !!val || this.$tr('isite.cms.message.fieldRequired')],
          label: this.$tr('iprofile.cms.message.privacyData', {
            concatData: concatData,
            siteName: this.$store.getters['qsiteApp/getSettingValueByName']('core::site-name')
          }),
        }
      }

      //Response
      return response
    },
    //To watch roleID
    watchRoleId() {
      return this.form['role-roleId']
    }
  },
  methods: {
    //Init template
    async init() {
      this.getAuthRoles()
    },
    //Get auth roles
    getAuthRoles() {
      return new Promise((resolve, reject) => {
        //validate setting
        if (!this.settings.rolesToRegister) return reject(false)
        this.loading = true
        //Request params
        let requestParams = {
          refresh: true,
          params: {
            include: 'forms.fields',
            filter: {id: this.settings.rolesToRegister}
          }
        }
        //Request
        this.$crud.index('apiRoutes.quser.roles', requestParams).then(response => {
          this.authRoles = response.data
          this.loading = false
          if (response.data.length == 1) this.getRoleForm()
          resolve(response.data)
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            this.loading = false
            reject(error)
          })
        })
      })
    },
    //Get form fields
    getRoleForm() {
      return new Promise((resolve, reject) => {
        //reset extra blocks
        this.extraBlocks = []
        //Get Role selected
        let roleSelected = !this.form['role-roleId'] ? this.authRoles[0] :
          this.authRoles.find(item => item.id == this.form['role-roleId'])

        //validate role
        if (!roleSelected || !roleSelected.formId) return reject(false)

        //Open loading
        this.loading = true

        //Request Params
        let requestParams = {
          refresh: true,
          params: {include: 'blocks.fields'}
        }

        //Request
        this.$crud.show('apiRoutes.qform.forms', roleSelected.formId, requestParams).then(response => {
          //Set extra blocks
          let extraBlocks = response.data.blocks.map(block => {
            return {...block, fields: block.fields.map(field => field.dynamicField)}
          })
          //concat block name to fields
          extraBlocks.forEach((block, blockKey) => {
            let fields = {}
            block.fields.forEach((field, fieldKey) => fields[`${field.name}`] = field)
            extraBlocks[blockKey].fields = fields
          })
          //set data
          this.extraBlocks = this.$clone(extraBlocks)
          resolve(response.data)
          this.loading = false
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            reject(error)
            this.loading = false
          })
        })
      })
    },
    //Get formData
    getFormData() {
      let form = this.$clone(this.form)
      let currentDate = new Date()

      //Instance respons, with default hidne data
      let response = {
        timezone: (currentDate.getTimezoneOffset() / 60),
        language: (navigator.language || navigator.userLanguage)
      }

      //order form data
      this.dynamicForm.blocks.forEach(block => {
        Object.keys(form).forEach(fieldKey => {
          //Get field name, removed block name from fieldKey
          let fieldName = fieldKey.replace(`${block.name}-`, '')
          //Set data by blocks, group data by block name, and keep to main level the mainField from fields and main blocks
          if (['fields', 'main', 'role'].includes(block.name) && this.mainFields.includes(fieldName))
            response[fieldName] = form[fieldKey]
          else if (Object.keys(block.fields).includes(fieldKey)) {
            if (!response[block.name]) response[block.name] = {}
            response[block.name][fieldName] = form[fieldKey]
          }
        })
      })

      //Response
      return {attributes: this.$helper.toSnakeCase(response)}
    },
    //Login
    async register() {
      this.loading = true
      //get formData
      let formData = this.$clone(this.getFormData())
      //Request
      this.$crud.post('apiRoutes.quser.register', formData).then(response => {
        //Auth Data
        let authData = {username: formData.attributes.email, password: formData.attributes.password}
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

  #formContent
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
