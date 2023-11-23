<template>
  <div id="formLoginEmailComponent">
    <!--Title-->
    <div class="box-title text-uppercase q-mb-sm text-center">
      {{ $tr('iprofile.cms.label.login') }}
    </div>

    <q-form @submit="authenticate()" class="row q-col-gutter-x-sm q-pt-sm"
            autocorrect="off" autocomplete="off" @validation-error="$alert.error($tr('isite.cms.message.formInvalid'))">
      <!-- Intro Message -->
      <div class="text-justiy q-mb-md">{{ $tr('iprofile.cms.form.introMessage') }}</div>

      <!-- Email field -->
      <dynamic-field class="col-12" v-model="email" :field="emailConfig"/>

      <!--Actions-->
      <div id="formActions" class="row full-width q-mb-md">
        <!-- Button login -->
        <q-btn :loading="loading" type="submit" color="primary" class="full-width" rounded unelevated no-caps>
          {{ $tr('iprofile.cms.form.emailLogin') }}
          <template v-slot:loading>
            <q-spinner-oval/>
          </template>
        </q-btn>
      </div>
    </q-form>

  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {})
  },
  data() {
    return {
      loading: false,
      email: ''
    }
  },
  computed: {
    emailConfig() {
      return  {
        value: null,
        type: 'input',
        props: {
          label: this.$tr('isite.cms.form.email'),
          rules: [
            val => !!val || this.$tr('isite.cms.message.fieldRequired'),
            val => this.$helper.validateEmail(val) || this.$tr('isite.cms.message.fieldEmail')
          ],
        }
      }
    }
  },
  methods: {
    init() {},
    //Get data
    authenticate() {
      this.loading = true;

      //Create request
      const requestParams = {
        attributes: {
          email: this.email,
          redirectTo: window.location.href
        }
      }

      this.$crud.post('apiRoutes.quser.validateEmail', requestParams).then(response => {
        this.$alert.info({
          mode: 'modal',
          message: this.$tr('iprofile.cms.form.sendEmailToVerify', { email: this.email }),
          actions: [
            {
              label: this.$tr('isite.cms.label.ok'),
              color: 'green',
              handler: () => {
                this.email = '';
                this.loading = false;
              }
            }
          ]
        })
      }).catch(error => this.$alert.error({ message: error }))

    }
  }
}
</script>
<style lang="stylus">
</style>