<template>
  <div id="formLoginComponent" class="relative-position"
       :style="'max-width: '+(isHorizontal ? '450px' : '300px')">
    <div class="row gutter-x-sm">
      <!-- Main Image field -->
      <div class="col-12" v-if="form.fields.mainImage">
        <q-field
          :error-label="$tr('ui.message.fieldRequired')" class="text-center"
          :error="$v.form.fields.mainImage ? $v.form.fields.mainImage.value.$error : false"
        >
          <upload-image v-model="form.fields.mainImage.value" ref="uploadComponent" rounded/>
        </q-field>
      </div>
      <!-- Name field -->
      <div :class="columnsFieldsClass">
        <q-field
          :error="$v.form.firstName.$error"
          :error-label="$tr('ui.message.fieldRequired')"
        >
          <div class="input-title">
            <q-icon name="fas fa-user"/>
            {{`${$tr('ui.form.firstName')} *`}}
          </div>
          <q-input name="username"
                   autofocus
                   autocomplete="off"
                   v-model="form.firstName"
                   type="text"
                   color="blue-grey"
                   @keyup.enter="register()"
          />
        </q-field>
      </div>
      <!-- Last Name field -->
      <div :class="columnsFieldsClass">
        <q-field
          :error="$v.form.lastName.$error"
          :error-label="$tr('ui.message.fieldRequired')"
        >
          <div class="input-title">
            <q-icon name="fas fa-user-friends"/>
            {{`${$tr('ui.form.lastName')} *`}}
          </div>
          <q-input name="username"
                   autocomplete="off"
                   v-model="form.lastName"
                   type="text"
                   color="blue-grey"
                   @keyup.enter="register()"
          />
        </q-field>
      </div>
      <!-- Phone field -->
      <div :class="columnsFieldsClass" v-if="form.fields.cellularPhone">
        <q-field
          error-label="Debe contener al menos 10 digitos" :count="14"
          :error="$v.form.fields.cellularPhone ? $v.form.fields.cellularPhone.value.$error : false"
        >
          <div class="input-title">
            <q-icon name="fas fa-phone"/>
            {{`${$tr('ui.form.phone')}`}}
            <span v-if="$v.form.fields.cellularPhone">*</span>
          </div>
          <q-input v-model="form.fields.cellularPhone.value"
                   @input="maskPhone" color="blue-grey"
                   type="text" inputmode="numeric"
                   pattern="[0-9]*" :maxlength="14"
                   @keyup.enter="register()"
          />
        </q-field>
      </div>
      <!-- Birthday field -->
      <div :class="columnsFieldsClass" v-if="form.fields.birthday">
        <q-field
          :error-label="$tr('ui.message.fieldRequired')"
          :error="$v.form.fields.birthday ? $v.form.fields.birthday.value.$error : false"
        >
          <div class="input-title">
            <q-icon name="fas fa-birthday-cake"/>
            {{`${$tr('ui.form.birthday')}`}}
            <span v-if="$v.form.fields.birthday">*</span>
          </div>
          <q-datetime v-model="form.fields.birthday.value" color="blue-grey" type="date"/>
        </q-field>
      </div>
      <!-- Identification field -->
      <div :class="columnsFieldsClass" v-if="form.fields.identification">
        <q-field
          :error-label="$tr('ui.message.fieldRequired')"
          :error="$v.form.fields.identification ? $v.form.fields.identification.value.$error : false"
        >
          <div class="input-title">
            <q-icon name="fas fa-id-card"/>
            {{`${$tr('ui.form.identification')}`}}
            <span v-if="$v.form.fields.identification">*</span>
          </div>
          <q-input autocomplete="off"
                   v-model="form.fields.identification.value"
                   type="number"
                   color="blue-grey"
                   @keyup.enter="register()"
          />
        </q-field>
      </div>
      <!-- Email field -->
      <div :class="columnsFieldsClass">
        <q-field
          :error="$v.form.email.$error"
          :error-label="$tr('ui.message.fieldEmail')"
        >
          <div class="input-title">
            <q-icon name="fas fa-at"/>
            {{`${$tr('ui.form.email')} *`}}
          </div>
          <q-input name="username"
                   autocomplete="off"
                   v-model="form.email"
                   type="text"
                   color="blue-grey"
                   @keyup.enter="register()"
          />
        </q-field>
      </div>
      <!-- Password field -->
      <div :class="columnsFieldsClass">
        <q-field
          :error="$v.form.password.$error"
          :error-label="$tr('ui.message.fieldMinLeng', {num : 8})"
          :count="8"
        >
          <div class="input-title">
            <q-icon name="fas fa-lock"/>
            {{`${$tr('ui.form.password')} *`}}
          </div>
          <q-input v-model="form.password"
                   type="password"
                   name="password"
                   color="blue-grey"
                   @keyup.enter="register()"
          />
        </q-field>
      </div>
      <!-- comfirm Password field -->
      <div :class="columnsFieldsClass">
        <q-field
          :error="$v.form.passwordConfirmation.$error"
          :error-label="$tr('ui.message.fieldCheckPassword')"
          :count="8"
        >
          <div class="input-title">
            <q-icon name="fas fa-user-lock"/>
            {{`${$tr('ui.form.checkPassword')} *`}}
          </div>
          <q-input v-model="form.passwordConfirmation"
                   type="password"
                   name="password"
                   color="blue-grey"
                   @keyup.enter="register()"
          />
        </q-field>
      </div>
    </div>
    <!--captcha-->
    <captcha v-model="form.captcha" class="q-my-md" ref="captcha"/>
    <!-- Button Register -->
    <div class="text-center q-mt-sm">
      <q-btn :loading="loading"
             color="blue-grey" name="submit"
             @click="register()">
        {{$tr('quser.layout.label.createAccount')}}
        <span slot="loading">
          <q-spinner-mat class="on-left"/>
          {{`${$tr('ui.label.loading')}...`}}
        </span>
      </q-btn>
    </div>
    <!--inner loading-->
    <inner-loading :visible="fullLoading" />
  </div>
</template>

<script>
  //Plugins
  import {required, email, sameAs, minLength, requiredIf} from 'vuelidate/lib/validators';
  import _cloneDeep from 'lodash.clonedeep'

  //components
  import captcha from '@imagina/qsite/_components/captcha'
  import uploadImage from 'src/components/uploadImage'
  import innerLoading from 'src/components/master/innerLoading'

  export default {
    props: {
      horizontal: {type: Boolean, default: false},
      horizontalExtraFields: {type: Boolean, default: false}
    },
    components: {uploadImage, captcha, innerLoading},
    validations() {
      return this.initValidations()
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        loading: false,
        fullLoading : false,
        isHorizontal: false,
        extraFields: this.$store.getters['qsiteSettings/getSettingValueByName']('iprofile::registerExtraFields'),
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
        if (this.isHorizontal) return 'col-12 col-md-6'
        else return 'col-12'
      }
    },
    methods: {
      //Init template
      async init() {
        let captcha = _cloneDeep(this.form.captcha)//Save captcha
        this.form = _cloneDeep(this.initData)//inti form
        this.form.captcha = captcha//Add captch
        //Reset component image
        if (this.$refs.uploadComponent)
          this.$refs.uploadComponent.removeFile()
        this.orderExtraFields()//Order extra fields
      },
      //Order extra fields
      orderExtraFields() {
        this.extraFields.forEach(item => {
          if (item.active)
            this.$set(this.form.fields, item.field, {
              name: item.field, value: null
            })
        })
      },
      //Login
      async register() {
        if (!this.inRequest) {
          this.$v.$touch();
          if (!this.$v.$error) {
            if (this.checkedCaptcha()) {
              this.loading = true;
              let data = this.$clone(this.form)
              data.fields = this.$helper.convertToBackField(this.form.fields)
              this.$crud.create('apiRoutes.quser.register', data).then(response => {
                this.callbackRequest(true, response.data)
              }).catch(error => {
                this.callbackRequest(false, error)
              })
            }
          } else {
            this.$alert.error({message: this.$tr('ui.message.formInvalid'), pos: 'bottom'})
          }
        }
      },
      //check if captcha is defined
      checkedCaptcha() {
        let captcha = this.form.captcha
        let response = false
        if (captcha && captcha.token) response = true
        if (!response) this.$alert.error({message : this.$tr('ui.message.requiredCaptcha')})

        return response
      },
      //Action after request
      callbackRequest(success = true, response) {
        this.$v.$reset()//Reset validations
        this.loading = false
        this.$refs.captcha.reset()
        let message = `${$tr('quser.layout.message.activateAccount')} this.form.email`

        if (success) {
          if (!response.checkEmail) message =''
          //Dialog to go to iniciar sesión when id register
          this.$q.dialog({
            title: this.$tr('ui.message.recordCreated'),
            message: message,
            color: 'blue-grey',
            ok: this.$tr('quser.layout.label.login'),
            cancel: false,
            noBackdropDismiss: true,
            noEscDismiss: true,
          }).then(async data => {
            this.login(response.checkEmail)
          }).catch(() => {
          })
        } else {
          console.error('[auth.register]', response)
          if (response) {//Message Vali
            let errorMsg = JSON.parse(response)
            if (errorMsg.email)
              this.$alert.error({
                message: this.$tr('quser.layout.message.emailExist'),
                pos: 'bottom', timeOut: 4000
              })
            else this.$alert.error({message: `${this.$tr('ui.message.recordNoCreated')}`})
          }
        }
      },
      //Login user or redirect to from login acooding "check email" from backend
      login(checkEmail) {
        if (!checkEmail) {//Login
          this.fullLoading = true;
          let data = {
            username: this.form.email, password: this.form.password
          }
          this.$store.dispatch("quserAuth/AUTH_REQUEST", data).then((response) => {
            this.fullLoading = false;
            this.$emit('logged')
          }).catch(error => {
            this.fullLoading = false;
          });
        } else {//Emmit event
          this.$emit('registered', this.form.email)
          this.$emit('input', this.form.email)
          this.init()//Init form
        }
      },
      //Mask phone
      maskPhone() {
        this.$nextTick(() => {
          let phone = this.$clone(this.form.fields.cellularPhone.value)
          let maskedPhone = this.$helper.maskPhone(phone)
          this.form.fields.cellularPhone.value = this.$clone(maskedPhone)
        })
      },
      //Init validations
      initValidations() {
        let response = {
          form: {
            firstName: {required},
            lastName: {required},
            email: {required, email},
            password: {required, minLength: minLength(8)},
            passwordConfirmation: {required, sameAsPassword: sameAs('password')},
          }
        }

        //Add validation to extrafields
        this.extraFields.forEach(item => {
          if (!response.form.fields) response.form.fields = {}
          if (item.active && item.required)
            response.form.fields[item.field] = {value: {required}}
        })

        return response
      }
    }
  }
</script>

<style lang="stylus">
  @import "~variables";
</style>
