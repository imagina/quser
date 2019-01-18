<template>
  <q-page id="profile">
    <div class="q-layout-page row justify-center layout-padding"
         style="min-height: calc(100vh - 50px);">
      <div style="width: 1100px; max-width: 90vw;">
        <div class="text_title text-blue-9 col-xs-12 q-title text-right">
          <span>PROFILE</span>
        </div>

        <div class="q-py-md q-title col-xs-12 text-negative">
          • EDIT PROFILE
        </div>

        <div class="form-user-data col-12 relative-position">
          <div class="form-title q-title">
            General Info
          </div>
          <div class="row form-container q-py-md">
            <div class="col-12 order-xs-last">
              <div class="row">
                <div class="item_form col-12 col-md-4 q-px-lg q-mb-md">
                  <q-field
                    :error="$v.form.first_name.$error"
                    error-label="This field is required"
                  >
                    <q-input type="text"
                             v-model="form.first_name"
                             float-label="First Name:"
                    />
                  </q-field>

                </div>
                <div class="item_form col-12 col-md-4 q-px-lg q-mb-md">
                  <q-field
                    :error="$v.form.last_name.$error"
                    error-label="This field is required"
                  >
                    <q-input v-model="form.last_name" float-label="Last Name:"/>
                  </q-field>
                </div>
                <div class="item_form col-12 col-md-4 q-px-lg q-mb-md">
                  <q-field
                    :error="$v.form.email.$error"
                    error-label="Email format invalid"
                  >
                    <q-input v-model="form.email" type="email"
                             float-label="Email"/>
                  </q-field>
                </div>
              </div>
            </div>
          </div>
          <div class="form-title q-title">
            Profile Info
          </div>
          <div class="row form-container q-py-md">
            <div class="col-12 order-xs-last">
              <div class="row">
                <div class="item_form q-px-lg q-mx-auto q-mb-lg text-center col-12 relative-position">
                  <img :src="image" alt="" style="border-radius: 50%; max-height: 280px">
                  <div id="contUploadImage">
                    <q-uploader url="" inverted
                                hide-upload-button
                                @add="getSignedUrl"
                                color="primary"
                                extensions=".jpg"
                                float-label="Change Photography"/>
                  </div>
                </div>


                <div class="item_form col-12 q-mb-md">
                  <div class="row">
                    <div class="item_form col-12 col-md-4 q-px-lg q-mb-xl">
                      <q-field
                        icon="phone"
                        icon-color="primary"
                      >
                        <q-input
                          type="text"
                          :maxlength="14"
                          v-model="profile.tel"
                          float-label="Telephone"
                          @input="profile.tel = maskPhone(profile.tel)"/>
                      </q-field>
                    </div>
                    <div class="item_form col-12 col-md-4 q-px-lg q-mb-xl">
                      <q-field
                        icon="phone"
                        icon-color="primary"
                      >
                        <q-input
                          type="text"
                          v-model="profile.ext_number"
                          float-label="Extension Number"/>
                      </q-field>
                    </div>
                    <div class="col-12 col-md-4 q-px-lg q-mb-xl">
                      <q-field
                        icon="cake"
                        icon-color="primary"
                      >
                        <q-datetime class="no-shadow"
                                    v-model="profile.birthday"
                                    float-label="Birthday"
                                    format="YYYY/MM/DD"
                                    clearable>
                        </q-datetime>
                      </q-field>
                    </div>
                    <div class="item_form col-12 col-md-4 q-px-lg q-mb-xl">
                      <q-field
                        icon="chrome_reader_mode"
                        icon-color="primary"
                      >
                        <q-input type="text" v-model="profile.identification" float-label="Identification"/>
                      </q-field>
                    </div>
                    <div class="col-12 col-md-4 q-px-lg q-mb-xl">
                      <q-field
                        icon="person_pin_circle"
                        icon-color="primary"

                      >
                        <q-input type="text" v-model="profile.address" float-label="Address"/>
                      </q-field>
                    </div>
                    <div class="col-12 col-md-4 q-px-lg q-mb-xl">
                      <q-field
                        icon="location_city"
                        icon-color="primary"

                      >
                        <q-input type="text" v-model="profile.city" float-label="City"/>
                      </q-field>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 q-px-lg">
                      <div class="form-title q-title">
                        Social Networks
                        <q-btn
                          round
                          flat
                          class=""
                          icon="add"
                          color="primary"
                          @click="addSocial()"
                          size="sm"
                        />
                      </div>
                      <div class="col-12" style="overflow-x: scroll">
                        <table class="q-table">
                          <thead>
                          <tr>
                            <th>Social Red</th>
                            <th colspan="2">Link</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="(item, index) in profile.social" :key="'row_social_'+index">
                            <td>
                              <div id="socialShare" class="btn-group share-group">
                                <a data-toggle="dropdown" class="btn btn-info principal">
                                  <i :class="'fa '+item.label"></i>
                                </a>
                                <q-btn-dropdown
                                  icon="share">
                                  <!-- dropdown content -->
                                  <q-list link v-for="(red,indexTwo) in redes" :key="indexTwo">
                                    <q-item>
                                      <q-item-main>
                                        <q-item-tile label><a @click="addLabelAndColor(index,red.label,red.color)"
                                                              title="Twitter" data-toggle="tooltip" data-id="fa-twitter"
                                                              class="btn social-link btn-twitter" data-placement="right">
                                          {{red.label}}
                                        </a>
                                        </q-item-tile>
                                      </q-item-main>
                                    </q-item>
                                  </q-list>
                                </q-btn-dropdown>
                                <q-chip
                                  :color="item.color"
                                  small>
                                  {{item.label}}
                                </q-chip>


                              </div>
                            </td>
                            <td>
                              <q-field>
                                <q-input type="text"
                                         v-model="item.desc"
                                         placeholder="@myaccount or /myaccount"
                                />
                              </q-field>
                            </td>
                            <td>
                              <q-btn
                                round
                                class=""
                                icon="delete"
                                color="primary"
                                @click="removeSocial(index)"
                                size="sm"
                              />
                            </td>
                          </tr>


                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pre-Loading -->
          <q-inner-loading :visible="loading" style="background-color: rgba(255, 255, 255, 0.89)">
            <q-spinner-hourglass size="50px" color="primary">
            </q-spinner-hourglass>
            <span class="text-faded">
              Updating your profile...
            </span>
          </q-inner-loading>
        </div>
        <!--=== SAVE ===-->
        <div class="col-12 text-center q-py-lg">
          <q-btn :loading="loading"
                 color="primary"
                 @click="submit">
            Save
          </q-btn>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
  /*Services*/
  import authService from '../_services/profile/auth';
  import profileService from '../_services/profile';

  /*Plugins*/
  import {required, email, sameAs, minLength} from 'vuelidate/lib/validators';
  import {alert} from '@imagina/qhelper/_plugins/alert';
  import {helper} from '@imagina/qhelper/_plugins/helper';

  export default {
    mounted() {
      this.$nextTick(function () {
        this.getData();
      })
    },
    data() {
      return {
        redes: [
          {
            label: 'Facebook',
            color: 'primary'
          },
          {
            label: 'Google +',
            color: 'negative'
          },
          {
            label: 'LinkedIn',
            color: 'blue'
          },
          {
            label: 'Twitter',
            color: 'light-blue'
          },
          {
            label: 'Instagram',
            color: 'deep-purple'
          },
          {
            label: 'Whatsapp',
            color: 'green'
          },
        ],
        loading: false,
        profile: '',
        form: '',
        userData: '',
        image: '',

      }
    },
    validations: {
      form: {
        first_name: {required},
        last_name: {required},
        password: {

          minLength: minLength(7)
        },
        password_confirmation: {

          minLength: minLength(7),
          sameAsPassword: sameAs('password')
        },
        email: {email, required},

      }
    },
    methods: {
      getData() {
        helper.storage.get.item('userData').then(response => {
          this.userData = response
          this.profile = response.profile;
          this.image = this.profile.mainimage;
          this.form = this.userData;
        })
      },

      async getSignedUrl(files) {
        setTimeout(() => {
          this.image = this.profile.mainimage = files[0].__img.src;
        }, 500)
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
      submit() {
        this.$v.$touch();

        if (this.$v.$error) {
          alert.error('Please review your fields again.', 'bottom');
        } else {
          this.saveProfile();
        }
      },

      saveProfile() {
        this.loading = true;
        let data = this.orderDataUpdate()

        profileService.update(this.profile.id, data).then(response => {
          let data = response.data

          helper.storage.get.item('userData').then(userData => {
            //Update data in storage
            userData.profile = data.profileData
            userData.first_name = data.userData.first_name
            userData.last_name = data.userData.last_name
            userData.email = data.userData.email

            helper.storage.set('userData',userData)

            alert.success('Profile updated', 'top')
            this.loading = false;
            setTimeout(() => {
              this.$router.go(0)
            },3000)
          })
        }).catch(error => {
          alert.error('Profile not updated', 'bottom')
          this.loading = false;
        });

      },

      orderDataUpdate() {
        let data = {
          userData: {
            first_name: this.userData.first_name,
            last_name: this.userData.last_name,
            email: this.userData.email
          },
          profileData: {
            tel: this.profile.tel,
            ext_number: this.profile.ext_number,
            birthday: this.profile.birthday,
            identification: this.profile.identification,
            address: this.profile.address,
            city: this.profile.city,
            social: this.profile.social,
            options: {
              mainimage: this.profile.mainimage
            }
          }
        }

        return data
      }
    }
  }

</script>
<style lang="stylus">
  @import "~variables";

  #contUploadImage
    position absolute
    top 0px
    right 24px

  #form-profile
    .form-user-data
      border 1px solid $grey-4
      border-top none

  /*=== FORM ===*/
  .form-user-data
    margin 0 0 25px auto !important
    .form-title
      border-bottom 1px solid $grey-4
      border-top 1px solid $grey-4
      padding 15px 30px
      background-color $grey-2
      color $primary
      font-weight 500
      margin 15px 0
    .form-container
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
