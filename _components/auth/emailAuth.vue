<template>
  <div id="formLoginEmailComponent">
    <div v-if="sent">
      <div>
        <!--Title-->
        <div class="text-h6 text-center box-title">{{ $tr('iprofile.cms.form.checkYourEmail') }}</div>
        <!-- Content -->
        <div class="text-body2 text-justify q-mt-md" v-html="sentEmailLabel">
        </div>
      </div>
      <div class="q-mt-xl text-center">
        <div class="text-body2">
          <span class="text-weight-bold">{{ $tr('iprofile.cms.form.notReceivedEmail') }}</span>
        </div>
        <div class="text-body2">
          {{ $tr('iprofile.cms.form.checkYourSpamFolder') }}
        </div>
        <q-btn 
          class="q-mt-lg"
          @click="init()"        
          :label="$tr('iprofile.cms.form.resendEmail')"
          color="primary"
          rounded
          unelevated
          no-caps
        />
      </div>
    </div>
    <div v-else>
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
      email: '',
      sentEmailLabel: '',
      sent: false, 
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
    init() {
      this.loading = false
      this.email = ''
      this.sentEmailLabel = false
      this.sent = false
    },

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
        this.sentEmailLabel = this.$tr('iprofile.cms.form.sendEmailToVerify', { email: this.email })
        this.sent = true
        this.loading = false
      }).catch(error => this.$alert.error({ message: error }))
    }
  }
}
</script>
<style lang="stylus">
</style>