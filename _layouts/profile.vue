<template>
  <q-page id="profilePage" class="q-layout-page layout-padding">
    <!--TITLE-->
    <h1 class="q-headline text-primary">
      <q-icon name="fas fa-user"></q-icon>
      Perfil
    </h1>

    <!--Form-->
    <div class="relative-position backend-page">
      <!--Info Profile-->
      <div class="border-top-color">
        <div class="form-title q-title">
          Información
        </div>
        <!--Form-->
        <div class="row gutter-xs form-container q-py-sm">
          <div class="col-12">
            <div class="row content-end">
              <!--Image-->
              <div class=" text-center col-12 col-md-6 ">
                <img v-if="fields.mainImage.value==''" :src="getImageUrl('/modules/iprofile/img/default.jpg')" alt=""
                     style="border-radius: 50%; max-height: 280px; max-width: 280px;">
                <img v-if="fields.mainImage.value!=''" :src="getImageUrl()" alt=""
                     style="border-radius: 50%; max-height: 280px; max-width: 280px;">
                <div class="row justify-center q-pa-sm">
                  <div class="col-12 col-md-6 ">
                    <q-uploader url="" inverted
                                v-model="fields.mainImage.value"
                                hide-upload-button
                                @add="getSignedUrl"
                                @remove:cancel="fields.mainImage.value=''"
                                color="primary"
                                extensions=".jpg"
                                float-label="Change Photo"/>
                  </div>
                </div>
              </div>
              <!--Form-->
              <div class=" col-12 col-md-6">
                <div class="row gutter-xs q-pa-sm">
                  <!--First Name-->
                  <div class="item-form col-12">
                    <q-field :error="$v.form.firstName.$error"
                             error-label="Este campo es requerido"
                             icon-color="primary"
                             icon="fa fa-user">
                      <q-input v-model="form.firstName" stack-label="Nombres *"/>
                    </q-field>
                  </div>
                  <!--Last Name-->
                  <div class="item-form col-12">
                    <q-field :error="$v.form.lastName.$error"
                             error-label="Este campo es requerido"
                             icon-color="primary"
                             icon="fa fa-user-friends">
                      <q-input v-model="form.lastName" stack-label="Apellidos *"/>
                    </q-field>
                  </div>
                  <!--Email-->
                  <div class="item-form col-12">
                    <q-field
                      :error="$v.form.email.$error"
                      error-label="Debe tener formato de e-mail"
                      icon-color="primary"
                      icon="fa fa-envelope">
                      <q-input v-model="form.email" stack-label="Email *"/>
                    </q-field>

                  </div>
                  <!--Cellular phone-->
                  <div class="item-form col-12">
                    <q-field
                      :error="$v.fields.cellularPhone.value.$error"
                      error-label="Este campo es requerido"
                      :count="14"
                      icon-color="primary"
                      icon="fa fa-phone"
                    >
                      <q-input type="text" clearable v-model="fields.cellularPhone.value"
                               @input="fields.cellularPhone.value = $helper.maskPhone(fields.cellularPhone.value)"
                               :maxlength="14" inputmode="numeric"
                               stack-label="Teléfono *"
                      />
                    </q-field>
                  </div>
                  <!--Identifiction-->
                  <div class=" col-12">
                    <q-field
                      icon="fas fa-id-card"
                      icon-color="primary"
                    >
                      <q-input type="text" v-model="fields.identification.value"
                               stack-label="Cedula*"/>
                    </q-field>
                  </div>
                  <!--Birthday-->
                  <div class="col-12">
                    <q-field
                      icon="cake"
                      icon-color="primary"
                    >
                      <q-datetime class="no-shadow"
                                  v-model="fields.birthday.value"
                                  stack-label="Cumpleaños"
                                  format="MM/DD/YYYY"
                                  clearable>
                      </q-datetime>
                    </q-field>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <!--Other Info-->
      <div class="border-top-color q-mt-md">
        <div class="form-title q-title">
          Other Info
        </div>
        <div class="row gutter-xs q-px-sm">
          <div class="col-12">

            <q-tabs animated swipeable inverted color="primary" align="justify">

              <q-tab default name="address" slot="title" label="Addresses"/>
              <q-tab name="contacts" slot="title" label="Contacts"/>
              <q-tab name="socials" slot="title" label="Social Networks"/>

              <q-tab-pane keep-alive name="address">
                <div class="row gutter-sm">
                  <div class="col-12 col-md-6">

                    <q-field
                      v-if="addressExtrasIsActive('firstName')"
                      :error="$v.address.firstName.$error"
                      error-label="This field is required"
                    >
                      <q-input v-model="address.firstName"
                               clearable
                               stack-label="First Name:"
                               @input="deleteError"
                      />
                    </q-field>
                    <q-field
                      v-if="addressExtrasIsActive('lastName')"
                      :error="$v.address.lastName.$error"
                      error-label="This field is required"
                    >
                      <q-input v-model="address.lastName"
                               clearable
                               stack-label="Last Name:"
                               @input="deleteError"
                      />
                    </q-field>
                    <q-field
                      :error="$v.address.address1.$error"
                      error-label="This field is required"
                    >
                      <q-input v-model="address.address1"
                               clearable
                               stack-label="Address:"
                               @input="deleteError"
                      />
                    </q-field>

                    <q-field>
                      <q-input v-model="address.address2"
                               clearable
                               placeholder="more data address"
                               @input="deleteError"
                      />
                    </q-field>

                    <q-field
                      :error="$v.address.city.$error"
                      error-label="This field is required"
                    >
                      <q-input v-model="address.city"
                               clearable
                               stack-label="City:"
                      />
                    </q-field>
                    <q-field
                      :error="$v.address.state.$error"
                      error-label="This field is required"
                    >
                      <q-input v-model="address.state"
                               clearable
                               stack-label="State:"
                      />
                    </q-field>
                    <q-field
                      :error="$v.address.zipCode.$error"
                      error-label="This field is required"
                    >
                      <q-input v-model="address.zipCode"
                               clearable
                               stack-label="Zip Code:"
                      />
                    </q-field>
                    <q-field
                      :error="$v.address.type.$error"
                      error-label="This field is required"
                    >
                      <q-select
                        stack-label="Type:"
                        v-model="address.type"
                        :options="[
                        {label: 'Default Shipping Address', value: 'shipping'},
                        {label: 'Default Billing Address', value: 'billing'}
                        ]"/>
                    </q-field>

                    <p class="text-negative float-left q-mt-md" v-if="addressExist">This Address Already Exist</p>
                    <q-btn class="float-right q-mt-sm" color="primary" icon="add"
                           :label="addressEdit ? 'Update':'Add Address'" @click="addAddress"/>

                    <q-btn class="float-left q-mt-sm" color="negative" label="Cancel" @click="cancelAddress"
                           v-if="addressEdit"/>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-list highlight>
                      <q-list-header>Addresses Added</q-list-header>
                      <q-item separator v-for="(address, index) in form.addresses" :key="index">
                        <q-item-main>
                          {{index+1}}.
                          {{address.firstName ? address.firstName : ""}}
                          {{address.lastName ? address.lastName+',' : ""}}
                          {{address.address1 +' '+ (address.address2 ? address.address2 : "")}},
                          {{address.state}},
                          {{address.city}},
                          {{address.zipCode}} <br>
                          <q-chip v-if="address.type" color="primary" dense>
                            {{address.type == "shipping" ? "Default Shipping" :
                            address.type == "billing" ? "Default Billing" : ""}}

                          </q-chip>

                        </q-item-main>
                        <q-item-side right>
                          <q-btn round color="positive" icon="edit"
                                 @click="editAddress(address)" size="sm" v-if="!addressEdit"/>
                          <q-btn round color="negative" icon="delete"
                                 @click="deleteAddress(index)" size="sm" class="q-ml-md"/>
                        </q-item-side>
                      </q-item>
                    </q-list>
                  </div>
                </div>
              </q-tab-pane>

              <q-tab-pane keep-alive name="contacts">
                <div class="row gutter-sm">
                  <div class="col-12 col-md-6">


                    <q-field
                      :error="$v.contact.firstName.$error"
                      error-label="This field is required"
                      :count="10"
                    >
                      <q-input v-model="contact.firstName" type="text" placeholder="First Name"
                               @input="deleteError"/>
                    </q-field>

                    <q-field
                      :error="$v.contact.lastName.$error"
                      error-label="This field is required"
                      :count="10"
                    >
                      <q-input v-model="contact.lastName" type="text" placeholder="Last Name"/>
                    </q-field>

                    <q-field
                      :error="$v.contact.cellularPhone.$error"
                      error-label="This field is required"
                      :count="10"
                    >
                      <q-input v-model="contact.cellularPhone" type="text" placeholder="Number Phone"/>
                    </q-field>

                    <q-field
                      :error="$v.contact.email.$error"
                      error-label="This field is required"
                    >
                      <q-input v-model="contact.email" type="text" placeholder="Email"/>
                    </q-field>

                    <p class="text-negative float-left q-mt-md" v-if="contactExist">Already Exist</p>
                    <q-btn class="float-right q-mt-sm" color="primary" icon="add"
                           :label="contactEdit ? 'Save':'Add Contact'" @click="addContact"/>

                    <q-btn class="float-left q-mt-sm" color="negative" label="Cancel" @click="cancelContact"
                           v-if="contactEdit"/>

                  </div>
                  <div class="col-12 col-md-6">
                    <q-list highlight>
                      <q-list-header>Contacts Added</q-list-header>
                      <q-item separator v-for="(contact, index) in fields.contacts.value" :key="index">

                        <q-item-main>
                          {{index+1}}. {{contact.firstName}} {{contact.lastName}} - {{contact.cellularPhone}}
                        </q-item-main>

                        <q-item-side right>
                          <q-btn round color="positive" icon="edit"
                                 @click="editContact(contact)" size="sm" v-if="!contactEdit"/>
                          <q-btn round color="negative" icon="delete"
                                 @click="deleteContact(contact)" size="sm" class="q-ml-md"/>
                        </q-item-side>
                      </q-item>
                    </q-list>
                  </div>
                </div>
              </q-tab-pane>

              <q-tab-pane keep-alive name="socials">
                <div class="row gutter-sm">
                  <div class="col-12 col-md-6">

                    <q-field
                      :error="$v.social.name.$error"
                      error-label="This field is required"
                    >
                      <q-select
                        v-model="social.name"
                        stack-label="Type"
                        :options="socialOptions"
                      />
                    </q-field>

                    <q-field
                      :error="$v.social.value.$error"
                      error-label="This field is required"
                    >
                      <q-input type="text" clearable v-model="social.value"
                               :maxlength="14"
                               stack-label="Value *:"
                      />
                    </q-field>


                    <p class="q-mt-md text-negative float-left" v-if="socialExist">Already Exist</p>

                    <q-btn class="float-right q-mt-sm" color="primary"
                           :label="socialEdit ? 'Save':'Add Social Network'"
                           @click="addSocial"/>

                    <q-btn class="float-left q-mt-sm" color="negative" label="Cancel" @click="cancelSocial"
                           v-if="socialEdit"/>

                  </div>
                  <div class="col-12 col-md-6">
                    <q-list highlight>
                      <q-list-header>Social Networks Added</q-list-header>
                      <q-item separator v-for="(social, index) in fields.socialNetworks.value" :key="index">

                        <q-item-main>
                          {{social.name}}: {{social.value}}
                        </q-item-main>

                        <q-item-side right>
                          <q-btn round color="positive" icon="edit"
                                 @click="editSocial(social)" size="sm" v-if="!socialEdit"/>
                          <q-btn round color="negative" icon="delete"
                                 @click="deleteSocial(social,index)" size="sm" class="q-ml-md"/>
                        </q-item-side>
                      </q-item>
                    </q-list>
                  </div>
                </div>
              </q-tab-pane>
            </q-tabs>
          </div>
        </div>
      </div>

      <!--=== SAVE ===-->
      <div class="col-12 text-center q-py-lg">
        <q-btn :loading="loading" @click="submit" label="Guardar"
               color="primary" icon="fas fa-save"/>
      </div>

      <!--Loading-->
      <inner-loading :visible="loading" label="Updating your profile..."/>
    </div>
  </q-page>
</template>

<script>
  //Components
  import innerLoading from 'src/components/master/innerLoading'
  /*Services*/
  import profileService from '@imagina/quser/_services/profile/index';

  /*Plugins*/
  import {required, email, sameAs, minLength, requiredIf} from 'vuelidate/lib/validators';
  import alert from '@imagina/qhelper/_plugins/alert';
  import {helper} from '@imagina/qhelper/_plugins/helper';

  export default {
    components: {
      innerLoading
    },
    mounted() {
      this.$nextTick(function () {
        this.image = 'profile/img/default.jpg';
        this.getData();
      })
    },
    data() {
      return {
        addressExtraFields: [],
        fieldAux: {},
        field: {
          name: '',
          value: '',
        },

        socialAux: {},
        social: {
          name: '',
          value: '',
        },

        contactAux: {},
        contact: {
          firstName: '',
          lastName: '',
          cellularPhone: '',
          email: ''
        },

        addressExist: false,
        fieldExist: false,
        socialExist: false,
        contactExist: false,

        addressEdit: false,
        fieldEdit: false,
        socialEdit: false,
        contactEdit: false,

        address: {
          firstName: '',
          lastName: '',
          address1: '',
          address2: '',
          city: '',
          state: '',
          zipCode: '',
          type: ''
        },
        addressAux: {},
        fieldOptions: [
          {
            label: 'Evening Phone',
            value: 'eveningPhone',
            disable: false
          },
          {
            label: 'Day Phone',
            value: 'dayPhone',
            disable: false
          },
          {
            label: 'Alternative Email',
            value: 'email',
            disable: false
          },
          {
            label: 'Alternative Cellular Phone',
            value: 'cellularPhone',
            disable: false
          },

        ],
        socialOptions: [
          {
            label: 'Facebook',
            value: 'Facebook',
            color: 'primary'
          },
          {
            label: 'Google +',
            value: 'Google +',
            color: 'negative'
          },
          {
            label: 'LinkedIn',
            value: 'LinkedIn',
            color: 'blue'
          },
          {
            label: 'Twitter',
            value: 'Twitter',
            color: 'light-blue'
          },
          {
            label: 'Instagram',
            value: 'Instagram',
            color: 'deep-purple'
          },
          {
            label: 'Whatsapp',
            value: 'Whatsapp',
            color: 'green'
          },

        ],

        fields: {
          cellularPhone: {value: ''},
          birthday: {value: ''},
          mainImage: {value: ''},
          email: {value: ''},
          identification: {value: ''},
          contacts: {value: []},
          socialNetworks: {value: []},
        },
        loading: false,
        profile: '',
        form: {
          firstName: '',
          lastName: '',
          mainImage: '',
          email: '',
          fields: [],
          addresses: [],
          contacts: {
            name: 'contacts',
            value: []
          },
          socialNetworks: {
            name: 'socialNetworks',
            value: []
          },
        },
        userData: '',
        image: '',

      }
    },
    validations: {
      form: {
        firstName: {required},
        lastName: {required},
        password: {

          minLength: minLength(7)
        },
        password_confirmation: {

          minLength: minLength(7),
          sameAsPassword: sameAs('password')
        },
        email: {required},

      },
      fields: {
        email: {
          value: {email}
        },
        cellularPhone: {
          value: {required}
        }
      },
      field: {
        name: {required},
        value: {required},
      },
      contact: {
        firstName: {required},
        lastName: {required},
        cellularPhone: {required},
        email: {required, email}
      },
      social: {
        name: {required},
        value: {required},
      },
      address: {
        firstName: {
          required: requiredIf(function () {
            let field = this.addressExtraFields.find(field => field.field == 'firstName')
            return field ? field.required : false
          })
        },
        lastName: {
          required: requiredIf(function () {
            let field = this.addressExtraFields.find(field => field.field == 'lastName')
            return field ? field.required : false
          })
        },
        type: {
          required: requiredIf(function () {
            let field = this.addressExtraFields.find(field => field.field == 'type')
            return field ? field.required : false
          })
        },
        address1: {required},
        city: {required},
        state: {required},
        zipCode: {required}
      },
    },
    computed: {},
    methods: {
      getData() {

        let fields = [
          {name: 'cellularPhone', value: ''},
          {name: 'birthday', value: ''},
          {name: 'identification', value: ''},
          {name: 'mainImage', value: ''},
          {name: 'email', value: ''},
          {name: 'socialNetworks', value: []},
          {name: 'contacts', value: []},
          {name: 'products', value: []}
        ]

        helper.storage.get.item('sessionData').then(response => {
          let userData = response.userData
          this.userData = userData;
          this.form = userData;
          this.fields = helper.convertToFrontField(fields, userData.fields);
          this.image = userData.mainimage ? userData.mainimage : 'assets/image/default.jpg';

        })
      },

      initObject(name) {
        switch (name) {
          case 'field':
            this.field = {
              name: '',
              value: '',
            };
            break;
          case 'social':
            this.social = {
              name: '',
              value: '',
            };
            break;
          case 'address':
            this.address = {
              firstName: '',
              lastName: '',
              address1: '',
              address2: '',
              city: '',
              state: '',
              zipCode: '',
              type: ''
            };
            break;
          case 'contact':
            this.contact = {
              firstName: '',
              lastName: '',
              cellularPhone: '',
              email: ''
            };
            break;
        }
      },

      addressExtrasIsActive(name) {
        let field = this.addressExtraFields.find(field => field.field == name)
        return field ? field.active : false
      },

      async getSignedUrl(files) {
        setTimeout(() => {
          this.fields.mainImage.value = this.form.mainimage = files[0].__img.src;
        }, 500)
      },

      getImageUrl(url) {
        let image;
        if (!url) {
          image = this.fields.mainImage.value;
          if (this.fields.mainImage.value.indexOf('data:image') < 0)
            image = config('apiRoutes.api.base_url') + '/' + this.fields.mainImage.value;
        } else
          image = config('apiRoutes.api.base_url') + '/' + url;

        return image;
      },

      addSocial: function () {
        if (!this.profile.social) {
          this.profile.social = [];
        }
        this.profile.social.push({
          label: '',
          color: '',
          desc: '',
        });
      },

      maskPhone(num) {
        return helper.maskPhone(num)
      },

      removeSocial: function (index) {
        this.profile.social.splice(index, 1);
      },

      addLabelAndColor: function (index, label, color) {
        this.profile.social[index].label = label;
        this.profile.social[index].color = color;
      },

      /*check fields required from form*/


      deleteError() {
        this.fieldExist = false;
        this.addressExist = false;
        this.contactExist = false;
      },

      //-------------------------------------------- FIELDS
      addField() {
        this.fieldExist = false
        this.$v.field.$touch()
        if (this.$v.field.$error) {
          alert.error('Please review the fields again.', 'bottom');
          return
        }
        this.$v.field.$reset()
        if (this.fieldEdit) {
          this.form.fields.push(this.field);
          this.initObject('field')
          this.fieldEdit = false;
        } else if (!this.existField() && !this.fieldEdit) {
          //quitar las opciones
          if (this.field.name == 'eveningPhone') {
            this.fieldOptions[0].disable = true;
          } else if (this.field.name == 'dayPhone') {
            this.fieldOptions[1].disable = true;
          } else if (this.field.name == 'email') {
            this.fieldOptions[2].disable = true;
          } else if (this.field.name == 'cellularPhone') {
            this.fieldOptions[3].disable = true;
          }
          this.form.fields.push(this.field);
          this.initObject('field')
        }
      },
      existField() {
        if (this.form.fields.find(item => item.value === this.field.value)) {
          this.fieldExist = true;
          return true;
        } else
          this.fieldExist = false;
        return false;
      },
      cancelField() {
        this.$v.field.$reset()
        this.fieldEdit = false;
        this.form.fields.push(this.fieldAux);
        this.initObject('field')
      },
      editField(data) {
        this.fieldAux = Object.assign({}, data);
        this.fieldExist = false
        var indice = this.form.fields.indexOf(data);
        this.form.fields.splice(indice, 1);

        this.fieldEdit = true;
        this.field = Object.assign({}, data);
      },

      deleteField(data, pos) {
        if (data.name == 'eveningPhone') {
          this.fieldOptions[0].disable = false;
        } else if (data.name == 'dayPhone') {
          this.fieldOptions[1].disable = false;
        } else if (data.name == 'email') {
          this.fieldOptions[2].disable = false;
        } else if (data.name == 'cellularPhone') {
          this.fieldOptions[3].disable = false;
        }
        this.form.fields.splice(pos, 1);
      },

      //-------------------------------------------- SOCIAL NETWORKS
      addSocial() {
        this.socialExist = false
        this.$v.social.$touch()
        if (this.$v.social.$error) {
          alert.error('Please review the fields again.', 'bottom');
          return
        }
        this.$v.social.$reset()
        if (this.socialEdit || (!this.existSocial() && !this.socialEdit)) {
          this.fields.socialNetworks.value.push(this.social);
          this.initObject('social')
          this.socialEdit = false;
        }
      },
      existSocial() {
        if (this.fields.socialNetworks.value.find(item => item.value === this.social.value)) {
          this.socialExist = true;
          return true;
        } else
          this.socialExist = false;
        return false;
      },
      cancelSocial() {
        this.$v.social.$reset()
        this.socialEdit = false;
        this.fields.socialNetworks.value.push(this.socialAux);
        this.initObject('social')
      },
      editSocial(data) {
        this.socialAux = Object.assign({}, data);
        this.socialExist = false
        var indice = this.fields.socialNetworks.value.indexOf(data);
        this.fields.socialNetworks.value.splice(indice, 1);

        this.socialEdit = true;
        this.social = Object.assign({}, data);
      },

      deleteSocial(data, pos) {

        this.fields.socialNetworks.value.splice(pos, 1);
      },


      //-------------------------------------------- ADDRESSES
      addAddress() {
        this.addressExist = false
        this.$v.address.$touch()
        if (this.$v.address.$error) {
          alert.error('Please review the fields again.', 'bottom');
          return
        }
        this.$v.address.$reset()
        if (this.addressEdit || !this.existAddress()) {
          this.refreshAddressTypes();
          this.form.addresses.push(this.address);
          this.initObject('address')
          this.addressEdit = false;
        }
      },
      refreshAddressTypes() {
        if (this.address.type) {
          this.form.addresses.forEach(address => {
            if (address.type == this.address.type) {
              address.type = ""
            }
          })
        }
      },
      editAddress(data) {
        this.addressAux = Object.assign({}, data);
        this.addressEdit = true;
        this.addressExist = false;
        var index = this.form.addresses.indexOf(data);
        this.form.addresses.splice(index, 1);

        this.address = Object.assign({}, data);
      },
      cancelAddress() {
        this.$v.address.$reset()
        this.addressEdit = false;
        this.form.addresses.push(this.addressAux);
        this.initObject('address')
      },
      existAddress() {

        if (this.form.addresses.find(item =>
          item.address1 === this.address.address1
          && item.city === this.address.city
          && item.state === this.address.state
          && item.zipCode === this.address.zipCode)) {
          this.addressExist = true;
          return true;
        } else
          this.addressExist = false;
        return false;
      },
      deleteAddress(index) {
        let address = this.form.addresses.splice(index, 1)[0];
        if (address.id) {
          this.loading = true
          profileService.crud.delete('apiRoutes.profile.addresses', address.id).then(userData => {
            alert.success("address deleted", "top")
            helper.storage.set('userData', this.userData);
            this.loading = false

          })
        }
      },
      //-------------------------------------------- CONTACTS
      addContact() {
        this.contactExist = false
        this.$v.contact.$touch()
        if (this.$v.contact.$error) {
          alert.error('Please review the fields again.', 'bottom');
          return
        }
        this.$v.contact.$reset()

        if (this.contactEdit || !this.existContact()) {
          this.fields.contacts.value.push(this.contact);
          this.initObject('contact')
          this.contactEdit = false;
        }
      },
      editContact(data) {
        this.contactAux = Object.assign({}, data);
        this.contactEdit = true;
        this.contactExist = false;
        var index = this.fields.contacts.value.indexOf(data);
        this.fields.contacts.value.splice(index, 1);
        this.contact = Object.assign({}, data);
      },
      cancelContact() {
        this.$v.contact.$reset()
        this.contactEdit = false;
        this.fields.contacts.value.push(this.contactAux);
        this.initObject('contact')
      },
      existContact() {
        if (this.fields.contacts.value.find(item =>
          item.firstName === this.contact.firstName
          && item.lastName === this.contact.lastName
          && item.cellularPhone === this.contact.cellularPhone
          && item.email === this.contact.email)) {
          this.contactExist = true;
          return true;
        } else
          this.contactExist = false;
        return false;
      },
      deleteContact(data) {
        this.fields.contacts.value.splice(data, 1);
      },

      submit() {
        this.$v.form.$touch();
        this.$v.fields.$touch();

        if (this.$v.form.$error || this.$v.fields.$error) {
          alert.error('Please review your fields again.', 'bottom');
        } else {
          this.saveProfile();
        }
      },

      saveProfile() {

        let data = this.orderDataUpdate()
        this.loading = true
        profileService.crud.update('apiRoutes.profile.users', this.form.id, data).then(response => {


          let params = {
            params: {
              include: 'roles,departments,settings,addresses,fields'
            }
          }
          alert.success('Profile updated', 'top')
          this.loading = false
          profileService.crud.show('apiRoutes.profile.users', this.form.id, params).then(userData => {
            helper.storage.get.item('sessionData').then(response => {
              let userData = response.userData
              userData.data['permissions'] = userData.permissions;
              userData.data['default_route'] = userData.default_route;
            })


          })
          ;

        }).catch(error => {
          alert.error('Profile not updated', 'bottom')
          this.loading = false;
        })
        ;

      },

      orderDataUpdate() {

        let data = {
          id: this.form.id,
          activated: this.form.activated,
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          email: this.form.email,
          fields: helper.convertToBackField(this.fields),
          addresses: this.form.addresses,
        }


        return data
      },
    }
  }

</script>

<style lang="stylus">
  @import "~variables";

  #profilePage
    .border-top-color
      border 1px solid #e0e0e0;
      border-top 3px solid $primary
      padding 0px

    /*=== FORM ===*/

    .form-title
      padding 15px
      background-color $grey-2
      color $primary
      font-weight 500

    .form-container
      padding 10px

      .q-item-main
        flex initial

      .q-item-label
        color $primary
        font-size 16px
        font-weight 500

      .q-item-side
        color $primary
        font-weight 500

</style>
