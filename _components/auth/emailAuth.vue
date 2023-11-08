<template>
  <div id="formLoginEmailComponent">
    <!--Title-->
    <div class="box-title text-uppercase q-mb-sm text-center">
      {{ $tr('iprofile.cms.label.login') }}
    </div>

    <q-form @submit="authenticate()" class="row q-col-gutter-x-sm q-pt-sm"
            autocorrect="off" autocomplete="off" @validation-error="$alert.error($tr('isite.cms.message.formInvalid'))">
      <!-- Email field -->
      <div class="col-12">
        <q-input name="email" autofocus ref="email" dense data-test-id="loginEmailField"
                 v-model="email" type="text" color="primary" outlined
                 :rules="[
                     val => !!val || $tr('isite.cms.message.fieldRequired'),
                     val => $helper.validateEmail(val) || $tr('isite.cms.message.fieldEmail')
                 ]"
                 :label="$tr('isite.cms.form.email')"/>
      </div>

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
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      email: ''
    }
  },
  computed: {},
  methods: {
    init() {
      this.$root.$on('page.data.refresh', () => this.getData(true))
    },
    //Get data
    authenticate() {
      this.loading = true;

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

    }
  }
}
</script>
<style lang="stylus">
</style>