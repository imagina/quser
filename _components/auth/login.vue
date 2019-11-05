<template>
  <div id="formLoginComponent" :style="'max-width: '+(props.horizontal ? '700px' : '300px')">
    <q-form @submit="authenticate()" class="row q-gutter-x-sm q-pt-sm"
            autocorrect="off" autocomplete="off" @validation-error="$alert.error($tr('ui.message.formInvalid'))">
      <!-- User field -->
      <div :class="columnsFieldsClass">
        <q-input name="username" autofocus ref="username" dense
                 v-model="form.username" type="text" color="primary" outlined
                 :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                 :label="$tr('ui.form.email')">
          <template v-slot:prepend>
            <q-icon name="fas fa-user"/>
          </template>
        </q-input>
      </div>

      <!-- Password field -->
      <div :class="columnsFieldsClass">
        <q-input name="password" ref="password" dense v-model="form.password"
                 type="password" color="primary" outlined
                 :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                 :label="$tr('ui.form.password')">
          <template v-slot:prepend>
            <q-icon name="fas fa-lock"/>
          </template>
        </q-input>
      </div>

      <!-- Button login -->
      <div class="text-center col-12">
        <q-btn :loading="loading" type="submit" color="primary">
          {{$tr('quser.layout.label.login')}}
          <template v-slot:loading>
            <q-spinner-oval class="on-left"/>
            {{$tr('ui.label.validating')}}
          </template>
        </q-btn>

        <q-btn flat :label="$tr('quser.layout.label.resetPassword')" class="q-mt-sm"
               :to="{name : 'auth.reset.password'}" color="grey-8"/>
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
        fromRoute: false
      }
    },
    computed: {
      columnsFieldsClass() {
        if (this.horizontal) {
          return 'col-12 col-md-6'
        } else {
          return 'col-12'
        }
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
