<template>
  <div id="formLoginComponent" class="relative-position"
       :style="'max-width: '+(isHorizontal ? '450px' : '300px')">
    <q-form @submit="register()" ref="formContent"
            @validation-error="$alert.error($tr('ui.message.formInvalid'))"
            class="row q-col-gutter-x-sm q-pt-sm " autocomplete="off">
      <!-- Main Image field -->
      <div class="col-12 q-mb-md" v-if="form.fields.mainImage">
        <q-field v-model="form.fields.mainImage.value" borderless
                 :rules="[val => !isValueRequired('mainImage',val) || $tr('ui.message.fieldRequired')]">
          <upload-image v-model="form.fields.mainImage.value" ref="uploadComponent" rounded/>
        </q-field>
      </div>

      <!-- Name field -->
      <div :class="columnsFieldsClass">
        <q-input dense v-model="form.firstName" color="primary" outlined
                 :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                 :label="`${$tr('ui.form.firstName')} *`">
          <template v-slot:prepend>
            <q-icon name="fas fa-user"/>
          </template>
        </q-input>
      </div>

      <!-- Last Name field -->
      <div :class="columnsFieldsClass">
        <q-input dense v-model="form.lastName" color="primary"
                 outlined :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                 :label="`${$tr('ui.form.lastName')} *`">
          <template v-slot:prepend>
            <q-icon name="fas fa-user-friends"/>
          </template>
        </q-input>
      </div>

      <!-- Email field -->
      <div :class="columnsFieldsClass">
        <q-input dense v-model="form.email" color="primary" outlined type="email"
                 :label="`${$tr('ui.form.email')} *`"
                 :rules="[
                  val => !!val || $tr('ui.message.fieldRequired'),
                  val => $helper.validateEmail(val) || $tr('ui.message.fieldEmail')
                 ]">
          <template v-slot:prepend>
            <q-icon name="fas fa-at"/>
          </template>
        </q-input>
      </div>

      <!-- Password field -->
      <div :class="columnsFieldsClass">
        <q-input dense v-model="form.password" type="password" color="primary" outlined
                 :label="`${$tr('ui.form.password')} *`" :rules="[
                  val => !!val || $tr('ui.message.fieldRequired'),
                  val => val.length >= 8 || $tr('ui.message.fieldMinLeng', {num : 8})
                 ]">
          <template v-slot:prepend>
            <q-icon name="fas fa-lock"/>
          </template>
        </q-input>
      </div>

      <!-- comfirm Password field -->
      <div :class="columnsFieldsClass">
        <q-input dense v-model="form.passwordConfirmation" type="password"
                 color="primary" outlined :label="`${$tr('ui.form.checkPassword')} *`"
                 :rules="[
                  val => !!val || $tr('ui.message.fieldRequired'),
                  val => val == form.password || $tr('ui.message.fieldCheckPassword')
                  ]">
          <template v-slot:prepend>
            <q-icon name="fas fa-user-lock"/>
          </template>
        </q-input>
      </div>

      <!-- Phone field -->
      <div :class="columnsFieldsClass" v-if="form.fields.cellularPhone">
        <q-input dense mask="phone"
                 :label="`${$tr('ui.form.phone')} ${isFieldRequired('cellularPhone') ? '*' : ''}`"
                 v-model="form.fields.cellularPhone.value" color="primary" outlined
                 unmasked-value :rules="[
                  val => !isValueRequired('cellularPhone',val) || $tr('ui.message.fieldRequired'),
                  val => !val || val.length == 10 || $tr('ui.message.fieldMinLeng',{num : 10})
                 ]">
          <template v-slot:prepend>
            <q-icon name="fas fa-phone"/>
          </template>
        </q-input>
      </div>

      <!-- Identification field -->
      <div :class="columnsFieldsClass" v-if="form.fields.identification">
        <q-input dense v-model.number="form.fields.identification.value" type="number"
                 :label="`${$tr('ui.form.identification')} ${isFieldRequired('identification') ? '*' : ''}`"
                 color="primary" outlined :rules="[
                  val => !isValueRequired('identification',val) || $tr('ui.message.fieldRequired')
                 ]">
          <template v-slot:prepend>
            <q-icon name="fas fa-id-card"/>
          </template>
        </q-input>
      </div>

      <!-- Birthday field -->
      <div :class="columnsFieldsClass" v-if="form.fields.birthday">
        <q-input dense mask="date" v-model="form.fields.birthday.value" color="primary"
                 :rules="[val => !isValueRequired('birthday',val) || $tr('ui.message.fieldRequired')]"
                 :label="`${$tr('ui.form.birthday')} ${isFieldRequired('birthday') ? '*' : ''}`"
                 outlined placeholder="YYYY/MM/DD">
          <template v-slot:prepend>
            <q-icon name="fas fa-birthday-cake"/>
          </template>
          <template v-slot:append>
            <q-icon name="fas fa-calendar-day"/>
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date v-model="form.fields.birthday.value" @input="() => $refs.qDateProxy.hide()"/>
            </q-popup-proxy>
          </template>
        </q-input>
      </div>

      <!--captcha-->
      <captcha v-model="form.captcha" class="full-width" ref="captcha"/>

      <!-- Button Register -->
      <div class="full-width text-center q-mt-sm">
        <q-btn :loading="loading" type="submit" color="primary" name="submit">
          {{$tr('quser.layout.label.createAccount')}}
          <div slot="loading">
            <q-spinner class="on-left"/>
            {{`${$tr('ui.label.loading')}...`}}
          </div>
        </q-btn>
      </div>
    </q-form>

    <!--inner loading-->
    <inner-loading :visible="loading"/>
  </div>
</template>

<script>
  export default {
    props: {
      horizontal: {type: Boolean, default: false},
      horizontalExtraFields: {type: Boolean, default: false}
    },
    components: {},
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        loading: false,
        fullLoading: false,
        isHorizontal: false,
        extraFields: this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::registerExtraFields'),
        form: {
          firstName: null,
          lastName: null,
          email: null,
          password: null,
          passwordConfirmation: null,
          captcha: false,
          fields: {}
        },
      }
    },
    computed: {
      initData() {
        return {
          firstName: null,
          lastName: null,
          email: null,
          password: null,
          passwordConfirmation: null,
          fields: {}
        }
      },
      columnsFieldsClass() {
        this.isHorizontal = this.$clone(this.horizontal)
        if (this.horizontalExtraFields && this.extraFields.length) this.isHorizontal = true
        if (this.isHorizontal) {
          return 'col-12 col-md-6'
        } else {
          return 'col-12'
        }
      }
    },
    methods: {
      //Init template
      async init() {
        let captcha = this.$clone(this.form.captcha)//Save captcha
        this.form = this.$clone(this.initData)//inti form
        this.form.captcha = captcha//Add captch
        //Reset component image
        if (this.$refs.uploadComponent) {
          this.$refs.uploadComponent.removeFile()
        }
        this.orderExtraFields()//Order extra fields
      },
      //Order extra fields
      orderExtraFields() {
        this.extraFields.forEach(item => {
          if (item.active) {
            this.$set(this.form.fields, item.field, {
              name: item.field, value: null
            })
          }
        })
      },
      //Login
      async register() {
        if (!this.inRequest) {
          if (this.checkedCaptcha()) {
            this.loading = true
            let data = this.$clone(this.form)
            data.fields = this.$helper.convertToBackField(this.form.fields)
            this.$crud.create('apiRoutes.quser.register', data).then(response => {
              this.callbackRequest(true, response.data)
            }).catch(error => {
              this.callbackRequest(false, error)
            })
          }
        }
      },
      //check if captcha is defined
      checkedCaptcha() {
        let captcha = this.form.captcha
        let response = false
        if (captcha && captcha.token) response = true
        if (!response) this.$alert.error({message: this.$tr('ui.message.requiredCaptcha')})

        return response
      },
      //Action after request
      callbackRequest(success = true, response) {
        this.loading = false
        this.$refs.captcha.reset()
        this.$refs.formContent.resetValidation()
        let message = `${this.$tr('quser.layout.message.activateAccount')} ${this.form.email}`

        if (success) {
          if (!response.checkEmail) message = ''
          //Dialog to go to iniciar sesión when id register
          this.$q.dialog({
            title: this.$tr('ui.message.recordCreated'),
            message: message,
            color: 'blue-grey',
            ok: this.$tr('quser.layout.label.login'),
            cancel: false,
            noBackdropDismiss: true,
            noEscDismiss: true,
          }).onOk(async data => {
            this.login(response.checkEmail)
          })
        } else {
          console.error('[auth.register]', response)
          if (response) {//Message Vali
            let errorMsg = JSON.parse(response)
            if (errorMsg.email) {
              this.$alert.error({
                message: this.$tr('quser.layout.message.emailExist'),
                pos: 'bottom', timeOut: 4000
              })
            } else {
              this.$alert.error({message: `${this.$tr('ui.message.recordNoCreated')}`})
            }
          }
        }
      },
      //Login user or redirect to from login acooding "check email" from backend
      login(checkEmail) {
        if (!checkEmail) {//Login
          this.fullLoading = true
          let data = {
            username: this.form.email, password: this.form.password
          }
          this.$store.dispatch('quserAuth/AUTH_REQUEST', data).then((response) => {
            this.fullLoading = false
            this.$emit('logged')
          }).catch(error => {
            this.fullLoading = false
          })
        } else {//Emmit event
          this.$emit('registered', this.form.email)
          this.$emit('input', this.form.email)
          this.init()//Init form
        }
      },
      //Validte if field is required
      isFieldRequired(name, value) {
        let field = this.extraFields.find(item => item.field == name)
        return field.required || false
      },
      //Vlaidte if field is required
      isValueRequired(name, value) {
        let field = this.extraFields.find(item => item.field == name)
        if (field && field.required && !value) return true
        return false
      }
    }
  }
</script>

<style lang="stylus">
</style>
