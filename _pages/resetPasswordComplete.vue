<template>
  <div id="authResetPassword" class="full-width flex flex-center">
    <!-- logo -->
    <div class="wrapp__logo logo-bg-primary q-mb-xl" v-if="!settings.hideLogo">
      <img :src="settings.logo"></img>
    </div>
    <!--Form-->
    page
    <div class="format-cotainer">
      <dynamic-form v-model="form" :blocks="dynamicForm.blocks" @submit="changePassword()" :actions="dynamicForm.actions"
                  :title="$tr('iprofile.cms.label.reset').toUpperCase()" class="q-mb-md"
                  default-col-class="col-12"/>
      <!--Form-->
      <div id="btnGoLogin" class="text-center q-mt-sm ">
        <q-btn class="text-capitalize" flat :label="$tr('iprofile.cms.label.login')" :to="{name : 'auth.login'}" color="grey-8"/>
      </div>
    </div>
    <!--Dialog message-->
    <q-dialog persistent v-model="showMessage">
      <q-card>
        <q-card-section>
          <!--Title-->
          <div class="text-green text-center text-h6">
            <q-icon name="fas fa-check" size="20px"/>
            {{$tr('isite.cms.label.ready')}}
          </div>

          <!--Message-->
          <p class="text-subtitle1 text-justify">
            {{$tr('iprofile.cms.message.changend')}}
          </p>
          <!--Button login-->
          <div class="text-center q-mt-sm">
            <q-btn :label="$tr('iprofile.cms.label.login')"
                   :to="{name : 'auth.login', query : {email : email}}" color="primary"/>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {},
        email : '',
        showMessage: false,
        loading: false,
        mainFields: [ 'password', 'passwordConfirmation']
      }
    },
    computed: {
      settings() {
        //Get auth banner
        let authBanner = this.$store.getters['qsiteApp/getSettingMediaByName']('iprofile::authBanner')

        let response = {
          logo: this.$store.state.qsiteApp.logo,
          authTitle: this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::authTitle'),
          hideLogo: parseInt(this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::hideLogo')),
          authBanner: !authBanner.path || authBanner.path.includes('defaultLogo.jpg') ? false : authBanner
        }

        //response
        return response
      },
      dynamicForm() {
        //Instace response
        let response = {
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
              }
            }
          ]
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
    },
    methods: {
      getFormData() {
      const form = this.$clone(this.form)

      //Instance respons, with default hidne data
      const response = {
        password: null,
        passwordConfirmation: null,
        userId: this.$route.params.userId,
        token: this.$route.params.token
      }

      //order form data
      this.dynamicForm.blocks.forEach(block => {
        Object.keys(form).forEach(fieldKey => {
          //Get field name, removed block name from fieldKey
          let fieldName = fieldKey.replace(`${block.name}-`, '')
          //Set data by blocks, group data by block name, and keep to main level the mainField from fields and main blocks
          if (['main'].includes(block.name) && this.mainFields.includes(fieldName)){
              response[fieldName] = form[fieldKey]
          }
        })
      })
      //Response
      return response
    },
      //send
      async changePassword() {
        this.loading = true;
        let formData = this.$clone(this.getFormData())
        this.$store.dispatch("quserAuth/CHANGED_PASSWORD_REQUEST", formData).then(response => {
          this.loading = false
          if(response.data && response.data.email) this.email = response.data.email
          this.showMessage = true
        }).catch(error => {
          this.$alert.error(this.$tr('isite.cms.message.errorRequest'))
          this.loading = false
        });
      },
    }
  }
</script>

<style lang="stylus">
  #authResetPassword
    min-height 100vh
    flex-direction column
    .format-cotainer
      position relative
      #btnGoLogin
        position absolute
        bottom 31px
        left 26px
        a
          border-radius 10px
    #progressContent
      .q-linear-progress
        background-color #fff
        color #fff !important
    .wrapp__logo
      text-align center
      height 130px
      max-height 270px
      padding 15px
      border-radius 10px
      overflow hidden

      img
        margin-left auto
        margin-right auto
        max-height 100px
        max-width 100%
</style>
