<template>
  <div id="users-edit"
       class="q-layout-page row justify-center layout-padding relative-position">
    <q-inner-loading :visible="loading" style="z-index:1001; max-height: 100vh">
      <q-spinner-hourglass size="50px" color="primary"/>
    </q-inner-loading>

    <div class="text_title text-blue-9 col-xs-12 q-title text-right">
      <span>USER</span>
    </div>

    <div class="q-py-sm q-title col-12 text-negative">
      • {{title}}
    </div>
  
    <q-card class="no-shadow col-12 relative-position">
    
      <q-card-title class="q-pa-none bg-grey-2">
        <div class="q-subheading float-left text-primary q-px-sm">
        Information
        </div>
      </q-card-title>
      <div class="row form-container q-py-md">
        <div class="col-md-12 order-xs-last">
          <div class="row">
            <!-- First Name -->
            <div class="item_form col-12 col-md-4 q-px-sm">
              <q-field
                :error="$v.form.first_name.$error"
                error-label="This field is required"
              >
                <q-input type="text"
                         v-model="form.first_name"
                         float-label="First Name*:"
                />
              </q-field>
            </div>

            <!-- Last Name -->
            <div class="item_form col-12 col-md-4 q-px-sm">
              <q-field
                :error="$v.form.last_name.$error"
                error-label="This field is required"
              >
                <q-input v-model="form.last_name" float-label="Last Name*:"/>
              </q-field>
            </div>

            <!-- User Name -->
            <div class="item_form col-12 col-md-4 q-px-sm">
              <q-field
                :error="$v.form.email.$error"
                error-label="This field is required"
              >
                <q-input v-model="form.email" type="text" float-label="User Name*:"/>
              </q-field>
            </div>

            <!-- Password -->
            <div class="item_form col-12 col-md-4 q-px-sm">
              <q-field
                :error="$v.form.password.$error"
                error-label="This field must have 7 seven characters"
              >
                <q-input v-model="form.password" type="password" float-label="Password*:"/>
              </q-field>
            </div>

            <!-- Confirm Password -->
            <div class="item_form col-12 col-md-4 q-px-sm">
              <q-field
                :error="$v.form.password_confirmation.$error"
                error-label="This field is required"
              >
                <q-input v-model="form.password_confirmation" type="password" float-label="Password Confirm*:"/>
              </q-field>
            </div>

            <!-- Deparments -->
            <div class="item_form col-12 col-md-4 q-px-sm">
              <q-field
                :disabled="departmentsLoading"
                :error="$v.form.departments.$error"
                error-label="This field is required"
              >
                <q-select
                  multiple chips
                  float-label="Deparments"
                  v-model="dep"
                  :options="departments"
                  @input="changeDepartment()"
                />
              </q-field>
            </div>

            <!-- Roles -->
            <div class="item_form col-12 col-md-4 q-px-sm">
              <q-field
                v-if="roles.length"
                :disabled="rolesLoading"
                :error="$v.form.roles.$error"
                error-label="This field is required"
              >
                <q-select
                  float-label="Role*:"
                  v-model="form.roles"
                  :options="roles"
                  @input="changeRole()"
                />
              </q-field>
            </div>

            <!--Activated -->
            <div class="col-12 col-md-8 text-right q-pa-lg">
              <q-toggle v-model="form.status" label="Activated" />
            </div>
          </div>
        </div>
      </div>
    </q-card>
    <!--=== SAVE ===-->
    <div class="col-12 q-px-sm text-center">
      <!-- Activated -->
      <q-btn :loading="loading"
             color="primary"
             @click="submit">
        Save
      </q-btn>
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
        this.form = this.initializeData()
        this.getData()
      })
    },
    data() {
      return {
        title: 'NEW USER',
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
        this.title = this.$route.params.id ? 'EDIT USER' : 'NEW USER'
        this.roles = []
        this.departments = []
        this.dep = []
        return {
          first_name: '',
          departments: [],
          email: '',
          first_name: '',
          last_name: '',
          roles: '',
          status: true
        }
      },
      getData() {
        this.loading = true;
        if (this.id) {
          userService.show(this.id).then(response => {
            this.form = response.data;
            this.form.roles = (this.form.roles && this.form.roles.length) ? this.form.roles[0].id : ''
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
          if (this.form.roles == element.id)
            this.form.roles = element.id;
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

        if (!this.$v.$error) {
          this.loading = true;
          let data = JSON.parse(JSON.stringify(this.form));
          let departmentService = Object.assign(data.departments)

          /*Get only Id from departments*/
          data.departments = [];
          departmentService.forEach((item) => {
            data.departments.push(item.id)
          })

          if (this.id) {
            userService.update(data, data.id).then(response => {
              alert.success('User updated', 'top');
              this.loading = false;
              this.$router.push({name: 'user.users.index'})
            }).catch(error => {
              let errorMessage = error.response.data.error ?
                error.response.data.error : 'User not updated';
              alert.error(errorMessage, 'bottom');
              this.loading = false;
            })
          } else {
            userService.create(data).then(response => {
              alert.success('User created', 'top')
              this.loading = false;
              this.$router.push({name: 'user.users.index'})
            }).catch(error => {
              let errorMessage = error.response.data.error ? error.response.data.error : 'User not created';
              alert.error(errorMessage, 'bottom')
              this.loading = false;
            })
          }
        } else {
          alert.error('Please review fields again.', 'bottom')
        }
      }
    }

  }
</script>
<style lang="stylus">
  @import "~variables";

  .q-card
    border 1px solid $grey-4
    margin-bottom 15px

  .form-user-data {
    border 1px solid $grey-4
    margin-top 0 !important
    .form-title {
      margin 0 !important
      border none !important
      border-bottom 1px solid $grey-4 !important
    }
  }
</style>
