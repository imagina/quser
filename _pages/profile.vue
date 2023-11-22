<template>
  <div id="profilePage" :key="pageId">
    <!--Page actions-->
    <div class="box box-auto-height q-mb-md">
      <page-actions :title="userData.fullName" @refresh="loadPage"/>
    </div>
    <!--Form-->
    <div id="formProfile" class="relative-position">
      <div class="row q-col-gutter-md">
        <!--Menu-->
        <div id="menuContent" class="col-12 col-md-3">
          <div class="box box-auto-height">
            <!--Profile picture -->
            <div id="profilePicture" v-for="(field, fieldKey) in formsData.profile.fields" :key="fieldKey"
                       :class="field.colClass || 'col-12 q-mb-md'">
                <dynamic-field :field="field" :itemId="userData.id" v-model="form.session[fieldKey]"/>
            </div>
            <q-tabs v-model="menuOption" vertical active-color="primary">
              <q-tab v-for="(opt, keyOpt) in menuOptions" :key="keyOpt" :name="opt.value" :label="opt.label"
                     no-caps v-if="(opt.vIf != undefined) ? opt.vIf : true"/>
            </q-tabs>
          </div>
        </div>
        <!--Form content-->
        <div id="formContent" class="col-12 col-md-9">
          <q-tab-panels v-model="menuOption" animated transition-prev="slide-down" transition-next="slide-up"
                        keep-alive>
            <!--Session-->
            <q-tab-panel name="session">
              <div class="box box-auto-height">
                <!--Title-->
                <div class="box-title row items-center">
                  <q-icon :name="formsData.session.icon" size="22px" class="q-mr-sm"/>
                  {{ formsData.session.title }}
                </div>
                <q-separator class="q-mt-sm q-mb-md"/>
                <!--Form-->
                <q-form @submit="updateUserData(form.session)" ref="formRegister" autocomplete="off"
                        class="row q-col-gutter-x-md"
                        @validation-error="$alert.error($tr('isite.cms.message.formInvalid'))">
                  <!--Fields-->
                  <div v-for="(field, fieldKey) in formsData.session.fields" :key="fieldKey"
                       :class="field.colClass || 'col-12'">
                    <dynamic-field :field="field" v-model="form.session[field.name || fieldKey]"/>
                  </div>
                  <!--Actions-->
                  <div id="profileActions" class="col-12 text-right">
                    <!--Save-->
                    <q-btn :label="$tr('isite.cms.label.save')" rounded unelevated color="green" type="submit"/>
                  </div>
                </q-form>
              </div>
            </q-tab-panel>
            <!--Profile-->
            <q-tab-panel v-if="roleFormId" name="profile">
              <!--Title-->
              <div class="box box-auto-height q-mb-md">
                <div class="box-title row items-center">
                  <q-icon name="fas fa-user" size="22px" class="q-mr-sm"/>
                  {{ $tr('isite.cms.label.profile') }}
                </div>
              </div>
              <!--Form-->
              <dynamic-form v-model="form.profile" v-if="roleFormId && profileFormBlocks.length"
                            formType="grid" :blocks="profileFormBlocks" @submit="updateUserData(form.profile)"/>
            </q-tab-panel>
            <!--Address-->
            <q-tab-panel name="address" v-if="hasPermission.addresses">
              <crud :crud-data="import('@imagina/quser/_crud/address')"
                    @created="$store.dispatch('quserAuth/AUTH_UPDATE')"
                    @updated="$store.dispatch('quserAuth/AUTH_UPDATE')"/>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
      <!--inner loading-->
      <inner-loading :visible="loading"/>
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
      menuOption: 'session',
      profileFormBlocks: [],
      form: {
        session: {},
        profile: {},
        payout: {}
      },
      mainFields: ['firstName', 'lastName']
    }
  },
  computed: {
    //Has permissions
    hasPermission() {
      return {
        addresses: this.$auth.hasAccess('profile.addresses.manage')
      }
    },
    //return formId from current role
    roleFormId() {
      let roleId = this.$store.state.quserAuth.selectedRoleId
      let roles = this.$store.state.quserAuth.userData.roles
      let roleData = roleId ? roles.fond(item => item.id == roleId) : roles[0]

      //Response
      return roleData?.formId || null
    },
    //Profile menu options
    menuOptions() {
      return [
        {label: this.$tr('isite.cms.label.session'), value: 'session'},
        {
          label: this.$tr('isite.cms.label.profile'), value: 'profile',
          vIf: this.roleFormId && this.profileFormBlocks.length ? true : false
        },
        {
          label: this.$trp('isite.cms.label.address'), value: 'address',
          vIf: this.hasPermission.addresses
        }
      ]
    },
    //Return User data
    userData() {
      return this.$clone(this.$store.state.quserAuth.userData)
    },
    //Default form Field
    formsData() {
      return {
        session: {
          icon: 'fas fa-sign-in-alt',
          title: this.$tr('isite.cms.label.session'),
          fields: {
            email: {
              value: this.userData.email,
              type: 'input',
              colClass: 'col-12 col-md-6',
              props: {
                label: `${this.$tr('isite.cms.form.email')}*`,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired'),
                  val => this.$helper.validateEmail(val) || this.$tr('isite.cms.message.fieldEmail')
                ],
              }
            },
            changePassword: {
              value: 0,
              type: 'checkbox',
              colClass: 'col-12 col-md-6',
              props: {
                label: `${this.$tr('isite.cms.message.updatePassword')}`,
                trueValue: 1,
                falseValue: 0,
              }
            },
            password: {
              value: null,
              type: 'input',
              colClass: 'col-12 col-md-6',
              props: {
                label: `${this.$trp('isite.cms.form.password')}*`,
                type: 'password',
                vIf: this.form.session.changePassword,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired'),
                  val => val.length >= 6 || this.$tr('isite.cms.message.fieldMinLeng', {num: 6})
                ]
              }
            },
            passwordConfirmation: {
              value: null,
              type: 'input',
              colClass: 'col-12 col-md-6',
              props: {
                label: `${this.$trp('isite.cms.form.checkPassword')}*`,
                type: 'password',
                vIf: this.form.session.changePassword,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired'),
                  val => (this.form.session.password == val) || this.$tr('isite.cms.message.fieldCheckPassword'),
                ]
              }
            },
          }
        },
        profile: {
          fields: {
            mediasSingle: {
              name: 'mediasSingle',
              value: {},
              type: 'media',
              props: {
                label: this.$tr('iprofile.cms.label.profilePicture'),
                accept: 'images',
                directUpload: true,
                multiple: false,
                zone: 'profile',
                entity: "Modules\\User\\Entities\\Sentinel\\User",
                entityId: null,
              }
            },
          }
        }
      }
    }
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
        this.$store.dispatch('quserAuth/AUTH_UPDATE'),
        this.setProfileFormData(),
        this.getRoleForm()
      ])
      this.pageId = this.$uid()
      this.loading = false
    },
    //Set profile form data
    setProfileFormData() {
      return new Promise((resolve, reject) => {
        let formData = {}
        //Set main fields
        this.mainFields.map(fieldName => formData[fieldName] = this.userData[fieldName])
        //Set fields
        if (this.userData.fields && Array.isArray(this.userData.fields))
          this.userData.fields.forEach(field => {
            formData[field.name] = field.value
          })
        //Set formdata
        this.form.profile = this.$clone(formData)
        resolve(true)
      })
    },
    //Get role form
    getRoleForm() {
      return new Promise((resolve, reject) => {
        if (!this.roleFormId) return resolve(false)
        //reset extra blocks
        this.extraBlocks = []
        //Open loading
        this.loading = true

        //Request Params
        let requestParams = {
          refresh: true,
          params: {include: 'blocks.fields'}
        }

        //Request
        this.$crud.show('apiRoutes.qform.forms', this.roleFormId, requestParams).then(response => {
          //Set extra blocks
          let blocks = response.data.blocks.map(block => {
            return {...block, fields: block.fields.map(field => field.dynamicField)}
          })
          //concat block name to fields
          blocks.forEach((block, blockKey) => {
            let fields = {}
            block.fields.forEach((field, fieldKey) => fields[`${field.name}`] = field)
            blocks[blockKey].fields = fields
          })
          //set to profile blocks
          this.profileFormBlocks = blocks.filter(item => item.name == 'fields')

          if (this.profileFormBlocks && this.profileFormBlocks.length) {
            this.profileFormBlocks[0].fields = {
              mainImage: {
                name: 'mainImage',
                type: 'image',
                colClass: 'col-12'
              },
              ...this.profileFormBlocks[0].fields
            }
          }

          this.loading = false
          resolve(response.data)
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            reject(error)
            this.loading = false
          })
        })
      })
    },
    //update data
    updateUserData(formData = {}) {
      this.loading = true
      //Transform formData to profile
      if (this.menuOption == 'profile') {
        let formDataProfile = {}
        //Order form data by fields
        Object.keys(formData).forEach(fieldName => {
          //Set main fields
          if (this.mainFields.includes(fieldName)) formDataProfile[fieldName] = formData[fieldName]
          else {//Set fields data
            if (!formDataProfile.fields) formDataProfile.fields = []
            formDataProfile.fields.push({name: fieldName, value: formData[fieldName] || ''})
          }
        })
        //Change form data
        formData = this.$clone(formDataProfile)
      }
      //Add userId to form data
      formData = {email: this.userData.email, ...formData, id: this.userData.id, isActivated: true}
      //Request
      this.$crud.update('apiRoutes.quser.users', this.userData.id, formData).then(async response => {
        this.$alert.success({message: this.$tr('isite.cms.message.recordUpdated')})
        this.loading = false
      }).catch(error => {
        this.$alert.error({message: this.$tr('isite.cms.message.recordNoUpdated')})
        this.loading = false
      })
    }
  }
}
</script>

<style lang="stylus">
#profilePage
  #menuContent
    .q-tab__indicator
      width 4px
      border-radius 2px

    .q-tab
      border-bottom 1px solid $grey-3

      &:last-child
        border none

    .q-tab__content
      width 100%

      .q-tab__label
        width 100%
        text-align left

  #formContent
    .q-tab-panels
      background-color transparent

      .q-tab-panel
        padding 0

#profilePicture
  .file-card_img
    height 200px !important
</style>
