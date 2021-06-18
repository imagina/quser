<template>
  <div id="profilePage" :key="pageId">
    <!--Form-->
    <div id="formProfile" class="col-12 q-mb-md">
      <div class="row relative-position q-col-gutter-md">
        <!--Forms-->
        <div v-for="(formData, keyForm) in formsData" :key="keyForm" class="col-12 col-lg-6 offset-lg-3">
          <div class="box">
            <!--Title-->
            <div class="box-title row items-center">
              <q-icon :name="formData.icon" size="22px" class="q-mr-sm"/>
              {{ formData.title }}
            </div>
            <q-separator class="q-mt-sm q-mb-md"/>

            <!--Form-->
            <q-form @submit="updateData" ref="formRegister" autocomplete="off" class="row q-col-gutter-x-md"
                    @validation-error="$alert.error($tr('ui.message.formInvalid'))">
              <!--Fields-->
              <dynamic-field v-for="(field, fieldKey) in formData.fields" :key="fieldKey" :field="field"
                             v-model="form[field.name || fieldKey]" class="col-12"/>
              <!--Actions-->
              <div id="profileActions" class="col-12 text-right">
                <!--Save-->
                <q-btn :label="$tr('ui.label.save')" rounded unelevated color="green" type="submit"/>
              </div>
            </q-form>
          </div>
          <!--Address CRUD-->
          <div v-if="keyForm == 'session'" class="q-mt-md">
            <crud :crud-data="import('@imagina/quser/_crud/address')"
                  @created="$store.dispatch('quserAuth/AUTH_UPDATE')"
                  @updated="$store.dispatch('quserAuth/AUTH_UPDATE')"/>
          </div>
        </div>

        <!--inner loading-->
        <inner-loading :visible="loading"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  beforeDestroy() {
    this.$root.$off('page.data.refresh')
  },
  props: {},
  components: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      pageId: this.$uid(),
      success: false,
      form: {}
    }
  },
  computed: {
    //User data
    userData() {
      //Get user data
      let userData = this.$clone(this.$store.state.quserAuth.userData)
      //Get fields data
      let fieldsData = this.$helper.convertToFrontField([
        {name: 'cellularPhone', value: null},
        {name: 'birthday', value: null},
        {name: 'documentType', value: null},
        {name: 'documentNumber', value: null},
        {name: 'mainImage', value: null},
        {name: 'email', value: null},
        {name: 'socialNetworks', value: []},
        {name: 'contacts', value: []},
        {name: 'products', value: []}
      ], userData.fields)

      //Set data in form
      return {
        id: this.$clone(userData.id),
        firstName: this.$clone(userData.firstName),
        lastName: this.$clone(userData.lastName),
        email: this.$clone(userData.email),
        cellularPhone: this.$clone(fieldsData.cellularPhone.value),
        documentType: this.$clone(fieldsData.documentType.value),
        documentNumber: this.$clone(fieldsData.documentNumber.value),
        birthday: this.$clone(fieldsData.birthday.value),
        mainImage: this.$clone(fieldsData.mainImage.value)
      }
    },
    //Extra fields from setting
    extraFields() {
      return this.$clone(this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::registerExtraFields'))
    },
    //Default form Field
    formsData() {
      return {
        profile: {
          icon: 'fas fa-user-circle',
          title: this.$tr('ui.label.profile'),
          fields: {
            mainImage: {
              value: this.userData.mainImage,
              type: 'uploader',
              props: {
                maxFiles: 1,
                accept: 'images',
                helpText: this.$tr('ui.message.uploadImage'),
                emitBase64: true,
                rules: (!this.extraFields.mainImage || !this.extraFields.mainImage.required) ? [] :
                  [val => !!val || this.$tr('ui.message.fieldRequired')]
              }
            },
            firstName: {
              value: this.userData.firstName,
              type: 'input',
              props: {
                label: `${this.$trp('ui.form.firstName')} *`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ]
              }
            },
            lastName: {
              value: this.userData.lastName,
              type: 'input',
              props: {
                label: `${this.$trp('ui.form.lastName')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            cellularPhone: {
              value: this.userData.cellularPhone,
              type: 'input',
              props: {
                label: this.$tr('ui.label.phone') + (this.extraFields.cellularPhone && this.extraFields.cellularPhone.required ? '*' : ''),
                mask: 'phone',
                clearable: true,
                unmaskedValue: true,
                rules: !this.extraFields.cellularPhone || !this.extraFields.cellularPhone.required ? [] : [
                  val => !val || val.length == 10 || this.$tr('ui.message.fieldMinLeng', {num: 10})
                ]
              }
            },
            documentType: {
              value: this.userData.documentType,
              type: 'select',
              props: {
                label: this.$tr('ui.form.identificationType') + (this.extraFields.documentType && this.extraFields.documentType.required ? '*' : ''),
                rules: !this.extraFields.documentType || !this.extraFields.documentType.required ? [] :
                  [val => !!val || this.$tr('ui.message.fieldRequired')],
                options: this.extraFields.documentType ? this.extraFields.documentType.options.filter(item =>
                  this.extraFields.documentType.availableOptions.indexOf(item.value) >= 0
                ) : []
              }
            },
            documentNumber: {
              value: this.userData.documentNumber,
              type: 'input',
              props: {
                type: 'number',
                label: this.$tr('ui.form.identification') + (this.extraFields.documentType && this.extraFields.documentType.required ? '*' : ''),
                rules: !this.extraFields.documentType || !this.extraFields.documentType.required ? [] :
                  [val => !!val || this.$tr('ui.message.fieldRequired')]
              }
            },
            birthday: {
              value: this.userData.birthday,
              type: 'date',
              props: {
                label: this.$tr('ui.label.birthday') + (this.extraFields.birthday && this.extraFields.birthday.required ? '*' : ''),
                clearable: true,
                rules: !this.extraFields.birthday || !this.extraFields.birthday.required ? [] :
                  [val => !!val || this.$tr('ui.message.fieldRequired')]
              }
            }
          }
        },
        session: {
          icon: 'fas fa-sign-in-alt',
          title: this.$tr('ui.label.session'),
          fields: {
            email: {
              value: this.userData.email,
              type: 'input',
              props: {
                label: `${this.$tr('ui.form.email')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired'),
                  val => this.$helper.validateEmail(val) || this.$tr('ui.message.fieldEmail')
                ],
              }
            },
            changePassword: {
              value: false,
              type: 'checkbox',
              props: {
                label: `${this.$tr('ui.message.updatePassword')}`,
              }
            },
            password: {
              value: null,
              type: 'input',
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
      }
    },
  },
  methods: {
    //init
    async init() {
      this.loadPage()
      this.$root.$on('page.data.refresh', () => {
        this.loadPage()
      })
    },
    //Refresh page actions
    async loadPage() {
      this.loading = true
      await Promise.all([
        this.$store.dispatch('qsiteApp/GET_SITE_SETTINGS'),
        this.$store.dispatch('quserAuth/AUTH_UPDATE')
      ])
      this.pageId = this.$uid()
      this.form = {}
      this.loading = false
    },
    //Get form data
    getFormData() {
      let userData = this.$clone(this.$store.state.quserAuth.userData)
      let formData = this.$clone(this.form)

      //Default response
      let response = {
        id: this.$store.state.quserAuth.userId,
        isActivated: 1,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        fields: []
      }

      //Set fields data
      for (var fieldName in formData) {
        if (!response[fieldName]) {
          response.fields.push({
            name: fieldName,
            value: formData[fieldName]
          })
        }
      }

      //Set password
      if (formData.changePassword && formData.password) {
        response.password = formData.password
        response.passwordConfirmation = formData.passwordConfirmation
      }

      //Response
      return response
    },
    //update data
    updateData() {
      this.loading = true//Loading
      let formData = this.getFormData()//get form data

      //Request
      this.$crud.update('apiRoutes.quser.users', formData.id, formData).then(async response => {
        this.$alert.success({message: this.$tr('ui.message.recordUpdated')})
        this.loadPage()
      }).catch(error => {
        this.$alert.error({message: this.$tr('ui.message.recordNoUpdated')})
        this.loading = false
      })
    }
  }
}
</script>

<style lang="stylus">
#profilePage
  .form-title
    color $primary
</style>
