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
          <div class="box">
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
                        class="row q-col-gutter-x-md" @validation-error="$alert.error($tr('ui.message.formInvalid'))">
                  <!--Fields-->
                  <div v-for="(field, fieldKey) in formsData.session.fields" :key="fieldKey"
                       :class="field.colClass || 'col-12'">
                    <dynamic-field :field="field" v-model="form.session[field.name || fieldKey]"/>
                  </div>
                  <!--Actions-->
                  <div id="profileActions" class="col-12 text-right">
                    <!--Save-->
                    <q-btn :label="$tr('ui.label.save')" rounded unelevated color="green" type="submit"/>
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
                  {{ $tr('ui.label.profile') }}
                </div>
              </div>
              <!--Form-->
              <dynamic-form v-model="form.profile" v-if="roleFormId && profileFormBlocks.length"
                            formType="grid" :blocks="profileFormBlocks" @submit="updateUserData(form.profile)"/>
            </q-tab-panel>
            <!--Address-->
            <q-tab-panel name="address">
              <crud :crud-data="import('@imagina/quser/_crud/address')"
                    @created="$store.dispatch('quserAuth/AUTH_UPDATE')"
                    @updated="$store.dispatch('quserAuth/AUTH_UPDATE')"/>
            </q-tab-panel>
            <!--Payment method-->
            <q-tab-panel name="paymentMethod">
              <!--Title-->
              <div class="box box-auto-height q-mb-md">
                <div class="box-title row items-center">
                  <q-icon name="fas fa-file-invoice-dollar" size="22px" class="q-mr-sm"/>
                  {{ $tr('ui.label.paymentMethod') }}
                </div>
              </div>
              <!--Help Caption-->
              <div class="q-mb-md">
                <q-banner v-if="payoutBannerHelp" rounded dense :class="payoutBannerHelp.class">
                  <template v-slot:avatar>
                    <q-icon :name="payoutBannerHelp.icon" color="white"/>
                  </template>
                  <div class="text-white">{{ payoutBannerHelp.message }}</div>
                  <template v-slot:action v-if="payout.account && payout.account.urlPanel">
                    <q-btn flat color="white" label="Ver mi Panel"
                           @click="$helper.openExternalURL(payout.account.urlPanel)"/>
                  </template>
                </q-banner>
              </div>
              <!--Form-->
              <dynamic-form v-if="payout.paymentMethod.formId && !payout.account.urlPanel"
                            v-model="form.payout" form-type="grid"
                            :form-id="payout.paymentMethod.formId" @submit="connectPayout"/>
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
      menuOption: 'profile',
      profileFormBlocks: [],
      form: {
        session: {},
        profile: {},
        payout: {}
      },
      payout: {
        paymentMethod: false,
        account: false
      },
      mainFields: ['firstName', 'lastName']
    }
  },
  computed: {
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
        {label: this.$tr('ui.label.session'), value: 'session'},
        {label: this.$tr('ui.label.profile'), value: 'profile', vIf: this.roleFormId},
        {label: this.$trp('ui.label.address'), value: 'address'},
        {label: this.$tr('ui.label.paymentMethod'), value: 'paymentMethod'}
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
          title: this.$tr('ui.label.session'),
          fields: {
            email: {
              value: this.userData.email,
              type: 'input',
              colClass: 'col-12 col-md-6',
              props: {
                label: `${this.$tr('ui.form.email')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired'),
                  val => this.$helper.validateEmail(val) || this.$tr('ui.message.fieldEmail')
                ],
              }
            },
            changePassword: {
              value: 0,
              type: 'checkbox',
              colClass: 'col-12 col-md-6',
              props: {
                label: `${this.$tr('ui.message.updatePassword')}`,
                trueValue: 1,
                falseValue: 0,
              }
            },
            password: {
              value: null,
              type: 'input',
              colClass: 'col-12 col-md-6',
              props: {
                label: `${this.$trp('ui.form.password')}*`,
                type: 'password',
                vIf: this.form.session.changePassword,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired'),
                  val => val.length >= 6 || this.$tr('ui.message.fieldMinLeng', {num: 6})
                ]
              }
            },
            passwordConfirmation: {
              value: null,
              type: 'input',
              colClass: 'col-12 col-md-6',
              props: {
                label: `${this.$trp('ui.form.checkPassword')}*`,
                type: 'password',
                vIf: this.form.session.changePassword,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired'),
                  val => (this.form.session.password == val) || this.$tr('ui.message.fieldCheckPassword'),
                ]
              }
            },
          }
        },
        payOut: {
          blocks: [
            {
              fields: {
                paymentMethod: {
                  value: null,
                  type: 'select',
                  //colClass: 'col-12 col-md-6',
                  props: {
                    label: `${this.$tr('ui.label.paymentMethod')}*`,
                    rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
                  },
                  loadOptions: {}
                }
              }
            }
          ]
        }
      }
    },
    //help banner to payout
    payoutBannerHelp() {
      if (!this.payout.account) {//No added
        return {
          class: 'bg-amber q-mt-md',
          icon: 'fas fa-exclamation-triangle',
          message: this.$tr('ui.message.noRegistered')
        }
      } else if (this.payout.account.payoutsEnabled) {//Pending
        return {
          class: 'bg-green q-mt-md',
          icon: 'fas fa-check-circle',
          message: this.$tr('ui.message.ready')
        }
      } else {//Added
        return {
          class: 'bg-info q-mt-md',
          icon: 'fas fa-info-circle',
          message: this.payout.account.urlPanelMsj
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
        this.getRoleForm(),
        this.getPaymentMethod(),
        this.getPayoutData()
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

          this.loading = false
          resolve(response.data)
        }).catch(error => {
          reject(error)
          this.loading = false
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
            formDataProfile.fields.push({name: fieldName, value: formData[fieldName]})
          }
        })
        //Change form data
        formData = this.$clone(formDataProfile)
      }
      //Add userId to form data
      formData = {email: this.userData.email, ...formData, id: this.userData.id, isActivated: true}
      //Request
      this.$crud.update('apiRoutes.quser.users', this.userData.id, formData).then(async response => {
        this.$alert.success({message: this.$tr('ui.message.recordUpdated')})
        this.loading = false
      }).catch(error => {
        this.$alert.error({message: this.$tr('ui.message.recordNoUpdated')})
        this.loading = false
      })
    },
    //get payment method
    getPaymentMethod() {
      return new Promise(resolve => {
        //Request Params
        let requestParams = {
          refresh: true,
          params: {filter: {field: 'name'}}
        }
        //request
        this.$crud.show('apiRoutes.qcommerce.paymentMethods', 'icommercestripe', requestParams).then(response => {
          this.payout.paymentMethod = response.data
          resolve(response.data)
        }).catch(error => resolve(error))
      })
    },
    //Get payout data
    getPayoutData() {
      return new Promise((resolve, reject) => {
        this.$crud.get('apiRoutes.qcommerce.stripe.accountUser', {refresh: true}).then(response => {
          if (response.data && response.data.email) {
            this.payout.account = response.data
            this.form.payout.email = this.$clone(response.data.email)
          }
          resolve(response)
        }).catch(error => {
          this.form.payout = {}
          this.payout.account = false
          resolve(false)
        })
      })
    },
    //connect with payout
    connectPayout() {
      return new Promise((resolve, reject) => {
        this.loading = true
        this.$crud.create('apiRoutes.qcommerce.stripe.connect', this.form.payout).then(response => {
          //Show dialog to finish register
          this.$alert.info({
            mode: 'modal',
            message: this.$tr('ui.message.finishRegister'),
            actions: [{
              label: this.$tr('ui.label.next'),
              color: 'green',
              handler: () => {
                this.$helper.openExternalURL(response.data.accountRegisterLink)
                this.loadPage()
              }
            }],
          })
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
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

</style>
