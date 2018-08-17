<template>
  <div id="users-edit"
       class="q-layout-page row justify-center layout-padding relative-position">
    <q-inner-loading :visible="loading" style="z-index:1001; max-height: 100vh">
      <q-spinner-hourglass size="50px" color="primary"/>
    </q-inner-loading>
    <div class="text_title text-blue-9 col-xs-12 q-title text-right">
      <q-icon name="edit"></q-icon>
      <span>User</span>
    </div>
    <div class="form-user-data col-12">
      <div class="form-title q-title">
        General Info
      </div>
      <div class="row form-container q-py-md">
        <div class="col-md-12 order-xs-last">
          <div class="row">
            <div class="item_form col-md-4 q-px-lg q-mb-xl">
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
            <div class="item_form col-md-4 q-px-lg q-mb-xl">
              <q-field
                :error="$v.form.last_name.$error"
                error-label="This field is required"
              >
                <q-input v-model="form.last_name" float-label="Last Name:"/>
              </q-field>
            </div>
            <div class="item_form col-md-4 q-px-lg q-mb-xl">
              <q-field
                :error="$v.form.email.$error"
                error-label="This field is required"
              >
                <q-input v-model="form.email" type="text" float-label="User Name"/>
              </q-field>
            </div>
          </div>

          <div class="row">
            <div class="item_form col-md-6 q-px-lg q-mb-xl">
              <q-field
                :error="$v.form.password.$error"
                error-label="This field must have 7 seven characters"
              >
                <q-input v-model="form.password" type="password" float-label="Password"/>
              </q-field>
            </div>
            <div class="item_form col-md-6 q-px-lg q-mb-xl">
              <q-field
                :error="$v.form.password_confirmation.$error"
                error-label="This field is required"
              >
                <q-input v-model="form.password_confirmation" type="password" float-label="Password Confirm"/>
              </q-field>
            </div>
          </div>

          <div class="row">
            <div class="item_form col-md-6 q-px-lg q-mb-xl relative-position">
              <div class="q-body-2">Roles</div>
              <q-field
                :disabled="rolesLoading"
                :error="$v.form.roles.$error"
                error-label="This field is required"
              >
                <q-select
                  v-model="form.roles[0].id"
                  :options="roles"
                  @input="changeRole()"
                />
              </q-field>
            </div>
            <div class="item_form col-md-6 q-px-lg q-mb-xl relative-position">
              <div class="q-body-2">Departments</div>
              <q-field
                :disabled="departmentsLoading"
                :error="$v.form.departments.$error"
                error-label="This field is required"
              >
                <q-select
                  multiple
                  chips
                  v-model="dep"
                  :options="departments"
                  @input="changeDepartment()"
                />
              </q-field>
            </div>


          </div>

          <div class="row">
            <div class="item_form col-md-6 q-px-lg q-mb-xl">
              <q-checkbox v-model="form.status" color="secondary" label="Activated"/>


            </div>
          </div>
          <div class="row">
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
        <!--
        <div class="col-md-3">

          <div class="item_form col-md-4 order-xs-first q-px-lg q-mb-xl">
            <img :src="form.main_image ? form.main_image : 'statics/profile.png'" class="full-width">
            <q-input @change="setImage" v-model="form.image_url" type="file" />
          </div>

        </div>-->
      </div>
    </div>

  </div>
</template>
<script>
  /*Services*/
  import departmentService from '../_services/departments'

  /*Plugins*/
  import {required, email, sameAs, minLength} from 'vuelidate/lib/validators';
  import {alert} from '@imagina/qhelper/_plugins/alert'
  import auth from '../_plugins/auth'
  import userService from '../_services/users'

  export default {
    props: {},
    components: {},
    watch: {
      '$route'(to, from) {
        this.form = this.initializeData();
        this.getData();
      }
    },
    validations: {
      form: {
        first_name: {required},
        roles: {required},
        departments: {required},
        last_name: {required},
        password: {
          minLength: minLength(7)
        },
        password_confirmation: {

          minLength: minLength(7),
          sameAsPassword: sameAs('password')
        },
        email: {required},

      }
    },
    mounted() {
      this.$nextTick(function () {
        if (auth.hasAccess('fhia.roles.dept-manager')) {
          this.form = this.initializeData()
          this.getData();
        } else {
          alert.error('Permission Denied', 'bottom')
          this.$router.push({name: 'home'})
        }
      })
    },
    data() {
      return {
        id: null,
        form: this.initializeData(),
        loading: false,
        roles: [],
        departments: [],
        dep: [],
        rolesLoading: false,
        departmentsLoading: false
      }
    },
    methods: {
      initializeData() {
        this.id = this.$route.params.id ? this.$route.params.id : null
        this.roles = []
        this.departments = []
        this.dep = []
        return {
          first_name: '',
          departments: [],
          email: '',
          first_name: '',
          last_name: '',
          roles: [
            {
              id: ''
            }
          ],
          status: true
        }
      },
      getData() {
        this.loading = true;
        if (this.id) {
          userService.show(this.id).then(response => {
            this.form = response.data;
            this.form.status == 0 ? this.form.status = false : this.form.status = true;
            this.form.departments.forEach((element, index) => {
              this.dep.push(element.id)
            })
            this.loading = false;
          }).catch(error => {
            let errorMessage = error.response.data.error ? error.response.data.error : 'Profile not Found';
            alert.error(errorMessage, 'bottom')
            this.loading = false;
          })
        } else
          this.loading = false;

        this.rolesLoading = true
        userService.roles('', 20).then(response => {
          this.roles = response.data;
          this.rolesLoading = false;
        });

        this.departmentsLoading = true
        let take = 1000;
        departmentService.index(null, take).then(response => {
          this.departments = response.data
          this.departmentsLoading = false
        })
      },
      changeRole() {
        this.roles.forEach((element, index) => {
          if (this.form.roles[0].id == element.id)
            this.form.roles[0] = element;
        })
      },
      changeDepartment() {
        this.form.departments = []
        this.departments.forEach((element, index) => {
          if (this.dep.indexOf(element.id) > -1)
            this.form.departments.push(element);


        })
      },
      submit() {
        this.$v.$touch();//validate all fields from form

        if (this.$v.$error) {
          alert.error('Please review fields again.', 'bottom')
          return
        }
        this.loading = true;
        let data = JSON.parse(JSON.stringify(this.form));
        data.status == false ? data.status = 0 : data.status = 1;
        if (this.id) {
          userService.update(data, data.id).then(response => {
            this.loading = false;
            alert.success('User updated', 'top');
            this.$router.push({name: 'user.users.index'})
          }).catch(error => {
            this.loading = false;
            let errorMessage = error.response.data.error ? error.response.data.error : 'User not updated';
            alert.error(errorMessage, 'bottom');
          })
        } else {
          userService.create(data).then(response => {
            this.loading = false;
            alert.success('User created', 'top')
            this.$router.push({name: 'user.users.index'})
          }).catch(error => {
            this.loading = false;
            let errorMessage = error.response.data.error ? error.response.data.error : 'User not created';
            alert.error(errorMessage, 'bottom')
          })
        }
      }
    }

  }
</script>
<style lang="stylus">
  @import "~variables";

</style>
