<template>
  <q-page id="profilePage" class="q-layout-page layout-padding backend-page">

    <!--Forms-->
    <div class="row gutter-sm">
      <!--Form Left-->
      <div class="col-12 col-md-5 col-lg-4 col-xl-3"
           v-if="success">
        <div class="box relative-position">
          <!--Image-->
          <upload-image v-model="form.fields.mainImage.value" class="q-mb-md"/>
          <!--First Name-->
          <q-field :error="$v.form.firstName.$error" :error-label="$tr('ui.message.fieldRequired')">
            <q-input v-model="form.firstName" :stack-label="`${$trp('ui.form.firstName')} *`"/>
          </q-field>
          <!--Last Name-->
          <q-field :error="$v.form.lastName.$error" :error-label="$tr('ui.message.fieldRequired')">
            <q-input v-model="form.lastName" :stack-label="`${$trp('ui.form.lastName')} *`"/>
          </q-field>
          <!--Email-->
          <q-field :error="$v.form.email.$error" :error-label="$tr('ui.message.fieldEmail')">
            <q-input v-model="form.email" :stack-label="`${$trp('ui.form.email')} *`"/>
          </q-field>
          <!--Cellular phone-->
          <q-field :error="$v.form.fields.cellularPhone.value.$error"
                   :error-label="$tr('ui.message.fieldMinLeng', {num : 14})">
            <q-input type="text" v-model="form.fields.cellularPhone.value" pattern="[0-9]*"
                     @input="maskPhone" :maxlength="14" inputmode="numeric"
                     :stack-label="`${$tr('ui.form.phone')} *`"/>
          </q-field>
          <!--Identifiction-->
          <q-input type="text" v-model="form.fields.identification.value"
                   :stack-label="$tr('ui.form.identification')"/>
          <!--Birthday-->
          <q-datetime class="no-shadow"
                      v-model="form.fields.birthday.value"
                      :stack-label="$tr('ui.form.birthday')"
                      format="MMMM DD, YYYY">
          </q-datetime>
          <!--Update button-->
          <div class="text-right q-mt-sm">
            <q-btn color="positive" :loading="loading" @click="updateData"
                   icon="fas fa-save" :label="$tr('ui.label.save')"/>
          </div>
          <!--Inner loafing-->
          <inner-loading :visible="loading"/>
        </div>
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
  //Plugins
  import {required, email, minLength} from 'vuelidate/lib/validators'
  import NotResult from "../../../../src/components/notResults";

  export default {
    props: {},
    components: {NotResult},
    watch: {},
    validations() {
      return {
        form: {
          firstName: {required},
          lastName: {required},
          email: {required, email},
          fields: {
            cellularPhone: {
              value: {required, minLength: minLength(14)}
            }
          }
        }
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
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
      defaultFields() {
        return [
          {name: 'cellularPhone', value: null},
          {name: 'birthday', value: null},
          {name: 'identification', value: null},
          {name: 'mainImage', value: {}},
          {name: 'email', value: null},
          {name: 'socialNetworks', value: []},
          {name: 'contacts', value: []},
          {name: 'products', value: []}
        ]
      }
    },
    methods: {
      //init
      async init() {
        this.loading = true//Loading
        this.form.fields = this.$clone(this.defaultFields)//Set default fields
        await this.setUserData()//Set user data
        this.success = true//Success page
        this.loading = false//Loading
      },
      //Set user data
      async setUserData() {
        let sessionData = await this.$storage.get.item('sessionData')//Get data from storage
        let userData = this.$clone(sessionData.userData)//Get user data
        //Convert fields
        userData.fields = this.$helper.convertToFrontField(this.defaultFields, userData.fields);

        //Set data in form
        this.form.id = this.$clone(userData.id)
        this.form.activated = this.$clone(userData.activated)
        this.form.firstName = this.$clone(userData.firstName)
        this.form.lastName = this.$clone(userData.lastName)
        this.form.email = this.$clone(userData.email)
        this.form.fields = this.$helper.convertToFrontField(this.defaultFields, userData.fields)
      },
      //update data
      updateData() {
        this.$v.$touch()//Validate form
        //Check validation
        if (!this.$v.$error) {
          this.loading = true//Loading
          let data = this.$clone(this.form)//Fet form data
          data.fields = this.$helper.convertToBackField(data.fields)//Convert fields

          //Request
          this.$crud.update('apiRoutes.quser.users', data.id, data).then(response => {
            this.$alert.success({message: this.$tr('ui.message.recordUpdated')})
            this.loading = false//Login
            this.updateUserData()//update local userData
          }).catch(error => {
            console.error('[UPDATE PROFILE] ', error)
            this.$alert.error({message: this.$tr('ui.message.recordNoUpdated')})
            this.loading = false
          })
        } else {
          this.$alert.error({message: this.$tr('ui.message.formInvalid'), pos: 'bottom'})
        }
      },
      //Update user local data
      async updateUserData() {
        let userData = this.$clone(this.form)//Get form data
        let sessionData = await this.$storage.get.item('sessionData')//Get session data
        userData.fields = this.$helper.convertToBackField(userData.fields)//Convert fields
        sessionData.userData = this.$clone(Object.assign({}, sessionData.userData, userData))//Merge with current data
        await this.$store.dispatch('quserAuth/AUTH_UPDATE')//Update session data
      },
      //Mask phone
      maskPhone() {
        this.$nextTick(() => {
          let phone = this.$clone(this.form.fields.cellularPhone.value)
          let maskedPhone = this.$helper.maskPhone(phone)
          this.form.fields.cellularPhone.value = this.$clone(maskedPhone)
        })
      },
    }
  }
</script>

<style lang="stylus">
  @import "~variables";
  #profilePage
    .form-title
      color $primary
</style>
