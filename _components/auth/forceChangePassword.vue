<template>
  <div id="authResetPassword" class="flex flex-center content-start">
    <!--Form-->
    <div class="format-cotainer">
      <dynamic-form v-model="form" :blocks="dynamicForm.blocks" @submit="changePassword()" :actions="dynamicForm.actions"
                  :title="$tr('iprofile.cms.label.changePassword').toUpperCase()" class="q-mb-md"
                  default-col-class="col-12"/>
      <!--Form-->
      <div id="btnGoLogin" class="text-center q-mt-sm">
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
        mainFields: [ 'password', 'newPassword']
      }
    },
    computed: {
      dynamicForm() {
        console.log("storw>>>> ",this.$store.state.quserAuth)
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
                textInfo: {
                  type: 'banner',
                  props: {
                    textColor: 'white',
                    ...this.meetInfoConfig
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
                newPassword: {
                  value: null,
                  type: 'input',
                  colClass: 'col-12',
                  props: {
                    label: `${this.$tr('iprofile.cms.label.newPassword')}*`,
                    type: 'password',
                    vIf: this.form.changePassword,
                  }
                }
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
      meetInfoConfig() {
      //Instance config key
      let configKey = (!this.userResource || !this.userResource.meetingConfig) ? 0 :
          this.userResource.meetingConfig.providerStatus

      //instance banner config
      let configs = {
        //No added to zoom
        0: {
          color: 'amber',
          icon: 'fas fa-exclamation-triangle',
          message: this.$store.state.quserAuth.shouldChangePassword ? this.$store.state.quserAuth.shouldChangePassword.description : this.$tr('isite.cms.form.descriptionForceChangePassword')
        }
      }

      //Response
      return configs[configKey]
    },
    },
    methods: {
      getFormData() {
      const form = this.$clone(this.form)
      //Instance respons, with default hidne data
      const response = {
        password: null,
        newPassword: null,
        email: this.$store.state.quserAuth.userData.email,
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
        this.$store.dispatch("quserAuth/FORCE_PASSWORD_REQUEST", formData).then(response => {
          this.loading = false
          this.$alert.info(response.data.messages[0])
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
</style>
