<template>
  <div id="formLoginComponent" :style="'max-width: '+(horizontal ? '700px' : '300px')">
    <div class="row gutter-x-sm">
      <!-- User field -->
      <div :class="columnsFieldsClass">
        <q-field
          :error="$v.form.username.$error"
          :error-label="$tr('ui.message.fieldRequired')"
        >
          <div class="input-title">
            <q-icon name="fas fa-user"/>{{$tr('ui.form.email')}}
          </div>
          <q-input name="username"
                   autofocus
                   ref="username"
                   autocomplete="off"
                   v-model="form.username"
                   type="text"
                   color="blue-grey"
                   @keyup.enter="authenticate()"
          />
        </q-field>
      </div>
      <!-- Password field -->
      <div :class="columnsFieldsClass">
        <q-field
          :error="$v.form.password.$error"
          :error-label="$tr('ui.message.fieldRequired')"
        >
          <div class="input-title">
            <q-icon name="fas fa-lock"/>
            {{$tr('ui.form.password')}}
          </div>
          <q-input v-model="form.password"
                   type="password"
                   name="password"
                   ref="password"
                   color="blue-grey"
                   @keyup.enter="authenticate()"
          />
        </q-field>
      </div>
    </div>
    <!-- Button login -->
    <div class="text-center q-mt-sm">
      <q-btn :loading="loading"
             color="blue-grey" name="submit"
             @click="authenticate()">
        {{$tr('quser.layout.label.login')}}
        <span slot="loading">
          <q-spinner-mat class="on-left"/>
          {{`${$tr('ui.label.validating')}...`}}
        </span>
      </q-btn>
    </div>
  </div>
</template>

<script>
  //Plugins
  import {required, email, numeric, minLength} from 'vuelidate/lib/validators';

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
    validations: {
      form: {
        username: {required},
        password: {required}
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.setEmail()
      })
    },
    data() {
      return {
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
    computed :{
      columnsFieldsClass(){
        if(this.horizontal) return 'col-12 col-md-6'
        else return 'col-12'
      }
    },
    methods: {
      //Login
      async authenticate() {
        if (!this.inRequest) {
          this.$v.$touch();
          if (!this.$v.$error) {
            this.inRequest = true
            this.loading = true;
            const {username, password} = this.form;
            this.$store.dispatch("quserAuth/AUTH_REQUEST", {username, password}).then((response) => {
              this.loading = false;
              this.inRequest = false
              this.$emit('logged')
            }).catch(error => {
              this.loading = false;
              this.inRequest = false
            });
          } else {
            this.$alert.error({message: this.$tr('ui.message.formInvalid'), pos: 'bottom'})
          }
        }
      },
      //Set email
      setEmail() {
        if (this.email) {
          this.form.username = this.$clone(this.email)
          this.$refs.password.focus()
        } else this.$refs.username.focus()
      }
    }
  }
</script>
<style lang="stylus">
  @import "~variables";
</style>
