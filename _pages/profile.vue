<template>
  <q-page id="profilePage" class="q-layout-page layout-padding backend-page">

    <!--Forms-->
    <div class="row q-col-gutter-md">
      <!--Form Left-->
      <div class="col-12 col-md-5 col-lg-4 col-xl-3"
           v-if="success">
        <q-form @submit="updateData" ref="formRegister" class="box relative-position" autocomplete="off"
                @validation-error="$alert.error($tr('ui.message.formInvalid'))">
          <!--Image-->
          <upload-image v-model="form.fields.mainImage.value"/>
          <!--First Name-->
          <q-input v-model="form.firstName" outlined dense :label="`${$trp('ui.form.firstName')} *`"
                   :rules="[val => !!val || $tr('ui.message.fieldRequired')]"/>
          <!--Last Name-->
          <q-input v-model="form.lastName" outlined dense :label="`${$trp('ui.form.lastName')} *`"
                   :rules="[val => !!val || $tr('ui.message.fieldRequired')]"/>
          <!--Email-->
          <q-input v-model="form.email" outlined dense :label="`${$trp('ui.form.email')} *`"
                   :rules="[
                     val => !!val || $tr('ui.message.fieldRequired'),
                     val => $helper.validateEmail(val) || $tr('ui.message.fieldEmail')
                   ]"/>
          <!--Cellular phone-->
          <q-input outlined dense v-model="form.fields.cellularPhone.value" unmasked-value
                   inputmode="numeric" mask="(###) ### - ####" :label="`${$tr('ui.form.phone')} *`"
                   :rules="[val => !!val || $tr('ui.message.fieldRequired')]"/>
          <!--Identifiction-->
          <q-input type="text" outlined dense v-model="form.fields.identification.value"
                   :label="$tr('ui.form.identification')"/>
          <!--Birthday-->
          <q-input dense mask="date" v-model="form.fields.birthday.value" color="primary"
                   unmasked-value :label="$tr('ui.form.birthday')" outlined placeholder="YYYY/MM/DD">
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
          <!--Update button-->
          <div class="text-right q-mt-sm">
            <q-btn color="positive" :loading="loading" type="submit"
                   icon="fas fa-save" :label="$tr('ui.label.save')"/>
          </div>
          <!--Inner loafing-->
          <inner-loading :visible="loading"/>
        </q-form>
      </div>
      <!--Form Right-->
      <div class="col-12 col-md-7 col-lg-8 col-xl-9"
           v-if="success">
        <!--Crud Address-->
        <crud :crud-data="import('@imagina/quser/_crud/address')"
              @created="$store.dispatch('quserAuth/AUTH_UPDATE')"
              @updated="$store.dispatch('quserAuth/AUTH_UPDATE')"/>
        <!--Crud Contacts-->
        <crud class="q-my-md" :crud-data="import('@imagina/quser/_crud/contacts')"
              @created="$store.dispatch('quserAuth/AUTH_UPDATE')"
              @updated="$store.dispatch('quserAuth/AUTH_UPDATE')"/>
        <!--Crud social Networks-->
        <crud class="q-my-md" :crud-data="import('@imagina/quser/_crud/socialNEtwork')"
              @created="$store.dispatch('quserAuth/AUTH_UPDATE')"
              @updated="$store.dispatch('quserAuth/AUTH_UPDATE')"/>
      </div>
    </div>
  </q-page>
</template>

<script>
  export default {
    props: {},
    components: {},
    watch: {},
    mounted () {
      this.$nextTick(function () {
        this.init()
      })
    },
    data () {
      return {
        loading: false,
        success: false,
        form: {
          firstName: null,
          lastName: null,
          email: null,
          fields: {}
        }
      }
    },
    computed: {
      defaultFields () {
        return [
          { name: 'cellularPhone', value: null },
          { name: 'birthday', value: null },
          { name: 'identification', value: null },
          { name: 'mainImage', value: {} },
          { name: 'email', value: null },
          { name: 'socialNetworks', value: [] },
          { name: 'contacts', value: [] },
          { name: 'products', value: [] }
        ]
      }
    },
    methods: {
      //init
      async init () {
        this.loading = true//Loading
        this.form.fields = this.$clone(this.defaultFields)//Set default fields
        await this.setUserData()//Set user data
        this.success = true//Success page
        this.loading = false//Loading
      },
      //Set user data
      async setUserData () {
        let sessionData = await this.$cache.get.item('sessionData')//Get data from storage
        let userData = this.$clone(sessionData.userData)//Get user data
        //Convert fields
        userData.fields = this.$helper.convertToFrontField(this.defaultFields, userData.fields)

        //Set data in form
        this.form.id = this.$clone(userData.id)
        this.form.activated = this.$clone(userData.activated)
        this.form.firstName = this.$clone(userData.firstName)
        this.form.lastName = this.$clone(userData.lastName)
        this.form.email = this.$clone(userData.email)
        this.form.fields = this.$helper.convertToFrontField(this.defaultFields, userData.fields)
      },
      //update data
      updateData () {
        this.loading = true//Loading
        let data = this.$clone(this.form)//Fet form data
        data.fields = this.$helper.convertToBackField(data.fields)//Convert fields

        //Request
        this.$crud.update('apiRoutes.quser.users', data.id, data).then(response => {
          this.$alert.success({ message: this.$tr('ui.message.recordUpdated') })
          this.loading = false//Login
          this.updateUserData()//update local userData
        }).catch(error => {
          console.error('[UPDATE PROFILE] ', error)
          this.$alert.error({ message: this.$tr('ui.message.recordNoUpdated') })
          this.loading = false
        })
      },
      //Update user local data
      async updateUserData () {
        let userData = this.$clone(this.form)//Get form data
        let sessionData = await this.$cache.get.item('sessionData')//Get session data
        userData.fields = this.$helper.convertToBackField(userData.fields)//Convert fields
        sessionData.userData = this.$clone(Object.assign({}, sessionData.userData, userData))//Merge with current data
        await this.$store.dispatch('quserAuth/AUTH_UPDATE')//Update session data
      }
    }
  }
</script>

<style lang="stylus">
  #profilePage
    .form-title
      color $primary
</style>
