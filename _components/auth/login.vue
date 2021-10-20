<template>
  <div id="formLoginComponent" :style="'max-width: '+(props.horizontal ? '700px' : '400px')">
    <!--Title-->
    <div class="box-title text-uppercase q-mb-sm text-center">
      {{ $tr('quser.layout.label.login') }}
    </div>
    <!--Caption-->
    <div v-if="settings.authLoginCaption && (settings.authLoginCaption != 'null')"
         class="text-center text-caption text-grey-8 q-mb-md">
      {{ settings.authLoginCaption }}
    </div>
    <!--Form-->
    <q-form @submit="authenticate()" class="row q-col-gutter-x-sm q-pt-sm"
            autocorrect="off" autocomplete="off" @validation-error="$alert.error($tr('ui.message.formInvalid'))">
      <!-- User field -->
      <div :class="columnsFieldsClass">
        <q-input name="username" autofocus ref="username" dense
                 v-model="form.username" type="text" color="primary" outlined
                 :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                 :label="$tr('ui.form.email')"/>
      </div>

      <!-- Password field -->
      <div :class="columnsFieldsClass">
        <q-input name="password" ref="password" dense v-model="form.password"
                 :type="isPwd ? 'password' : 'text'" color="primary" outlined
                 :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                 :label="$tr('ui.form.password')">
          <template v-slot:append>
            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd"/>
          </template>
        </q-input>
      </div>

      <!--Actions-->
      <div id="formActions" :class="`row full-width q-mb-md ${withRegister ? 'justify-between' : 'justify-end'}`">
        <!--Register-->
        <q-btn :label="$tr('quser.layout.label.createAccount')" unelevated no-caps v-if="withRegister"
               :to="{name : 'auth.register',query : this.$route.query}" color="blue-grey-1" text-color="blue-grey"
               rounded/>
        <!-- Button login -->
        <q-btn :loading="loading" type="submit" color="primary" rounded unelevated no-caps>
          {{ $tr('quser.layout.label.login') }}
          <template v-slot:loading>
            <q-spinner-oval/>
          </template>
        </q-btn>
      </div>

      <!--Reset Password-->
      <div class="text-center full-width">
        <q-btn :label="$tr('quser.layout.label.resetPassword')" unelevated no-caps
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
      return hasSetting /*&& (config('app.mode') == 'ipanel'))*/ ? true : false
    }
  },
  methods: {
    //init
    init() {
      this.props = this.$clone(this.$props)
      this.setEmail()
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
          this.$alert.error(this.$tr('quser.layout.message.userOrPasswordInvalid'))
          this.loading = false
          this.inRequest = false
        })
      }
    },
    //Set email
    setEmail() {
      let emailFromUrl = this.$route.query.email
      let email = this.email ? this.$clone(this.email) : emailFromUrl
      setTimeout(() => {
        if (email) {
          this.form.username = email
          this.$refs.password.focus()
        } else {
          this.$refs.username.focus()
        }
      }, 200)
    }
  }
}
</script>
<style lang="stylus">
</style>
