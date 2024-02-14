<template>
  <div id="formLoginComponent" :style="'max-width: '+(props.horizontal ? '700px' : '400px')">
    <!--Title-->
    <div class="box-title text-uppercase q-mb-sm text-center">
      {{ $tr('iprofile.cms.label.login') }}
    </div>
    <!--Caption-->
    <div v-if="settings.authLoginCaption && (settings.authLoginCaption != 'null')"
         class="text-center text-caption text-grey-8 q-mb-md">
      {{ settings.authLoginCaption }}
    </div>
    <!--Form-->
    <q-form @submit="authenticate()" class="row q-col-gutter-x-sm q-pt-sm"
            autocorrect="off" autocomplete="off" @validation-error="$alert.error($tr('isite.cms.message.formInvalid'))">
      <!-- User field -->
      <div :class="columnsFieldsClass">
        <q-input name="username" autofocus ref="username" dense data-test-id="loginUserNameField"
                 v-model="form.username" type="text" color="primary" outlined
                 :rules="[val => !!val || $tr('isite.cms.message.fieldRequired')]"
                 :label="`${$tr('isite.cms.form.email')} / ${$tr('isite.cms.form.userName')}`"/>
      </div>

      <!-- Password field -->
      <div :class="columnsFieldsClass">
        <q-input name="password" ref="password" dense v-model="form.password"
                 :type="isPwd ? 'password' : 'text'" color="primary" outlined
                 :rules="[val => !!val || $tr('isite.cms.message.fieldRequired')]"
                 :label="$tr('isite.cms.form.password')"
                 data-test-id="loginPasswordField"
        >
          <template v-slot:append>
            <q-icon :name="isPwd ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" class="cursor-pointer"
                    @click="isPwd = !isPwd"/>
          </template>
        </q-input>
      </div>

      <!--Actions-->
      <div id="formActions" :class="`row full-width q-mb-md ${withRegister ? 'justify-between' : 'justify-end'}`">
        <!--Register-->
        <q-btn :label="$tr('iprofile.cms.label.createAccount')" unelevated no-caps v-if="withRegister"
               :to="{name : 'auth.register',query : this.$route.query}" color="blue-grey-1" text-color="blue-grey"
               rounded/>
        <!-- Button login -->
        <q-btn :loading="loading" type="submit" color="primary" rounded unelevated no-caps>
          {{ $tr('iprofile.cms.label.login') }}
          <template v-slot:loading>
            <q-spinner-oval/>
          </template>
        </q-btn>
      </div>

      <!--Reset Password-->
      <div class="text-center full-width">
        <q-btn :label="$tr('iprofile.cms.label.resetPassword')" unelevated no-caps v-if="settings.allowResetPassword"
               :to="{name : 'auth.reset.password',query : this.$route.query}" color="blue-grey" rounded flat/>
      </div>
    </q-form>
  </div>
</template>

<script>
export default {
  props: {
    email: {default: null},
    horizontal: {type: Boolean, default: false}
  },
  emits: ['logged'],
  watch: {
    email() {
      this.setEmail()
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      props: {},
      form: {
        username: '',
        password: ''
      },
      rememberData: true,
      loading: false,
      inRequest: false,
      fromRoute: false,
      isPwd: true
    }
  },
  computed: {
    //Settings
    settings() {
      let response = {
        authLoginCaption: this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::authLoginCaption'),
        allowResetPassword: this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::allowResetPassword'),
      }

      //response
      return response
    },
    columnsFieldsClass() {
      if (this.horizontal) {
        return 'col-12 col-md-6'
      } else {
        return 'col-12'
      }
    },
    withRegister() {
      let hasSetting = this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::registerUsers')
      return (hasSetting && parseInt(hasSetting)) /*&& (config('app.mode') == 'ipanel'))*/ ? true : false
    }
  },
  methods: {
    //init
    init() {
      this.props = this.$clone(this.$props)
      this.setAuthData()
    },
    //Login
    async authenticate() {
      if (!this.inRequest) {
        this.inRequest = true
        this.loading = true
        const {username, password} = this.form
        this.$store.dispatch('quserAuth/AUTH_REQUEST', {username, password}).then((response) => {
          this.loading = false
          this.inRequest = false
          this.$emit('logged')
        }).catch(error => {
          this.$alert.error(this.$tr('iprofile.cms.message.userOrPasswordInvalid'))
          this.loading = false
          this.inRequest = false
        })
      }
    },
    //Set AuthData
    setAuthData() {
      let emailFromUrl = this.$route.query.email
      let email = this.email ? this.$clone(this.email) : emailFromUrl
      let passwordFromUrl = this.$route.query.password
      setTimeout(() => {
        email ? this.form.username = email : false;
        if (email) {
          this.form.username = email
          this.$refs.password.focus()
          if (passwordFromUrl) {
            this.form.password = passwordFromUrl
            this.authenticate();
          }
        } else {
          this.$refs.username.focus()
        }
      }, 200)
    }
  }
}
</script>
<style lang="scss">
</style>
