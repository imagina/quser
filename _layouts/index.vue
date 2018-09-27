<template>
  <q-page class="relative-position">

    <div class="q-layout-page row justify-center layout-padding">

      <div class="text_title text-blue-9 col-xs-12 q-title text-right">
        <span>USERS</span>
      </div>

      <div class="q-py-md q-title col-xs-12 text-negative">
        • LIST USERS
      </div>

      <!-- Content -->
      <div id="listUserContent" class="col-12 q-pa-lg">
        <div class="row">
          <!-- Search -->
          <div class="col-12 col-md-4 q-mb-md">
            <q-search
              inverted
              v-model="filter.search"
              placeholder="Text Search"
              @keyup.enter="pagination.page = 1; getData()"/>
          </div>

          <!-- Show user disable -->
          <div class="col-12 col-md-8 text-right q-mb-md">
            <q-toggle v-model="filter.deactivateds"
                      @input="pagination.page = 1; getData()"
                      label="Show disabled users"/>
          </div>

          <!-- TABLE LIST USERS -->
          <div class="col-12">
            <div v-if="users.length || loading">

              <div v-if="users.length" class="table-responsive" style="overflow-x: scroll">

                <table class="q-table horizontal-delimiter striped-odd">
                  <thead>
                    <tr class="text-left">
                      <th>ID</th>
                      <th>User</th>
                      <th class="gt-xs">User Login</th>
                      <th class="gt-xs">Role</th>
                      <th class="gt-xs">Created</th>
                      <th class="gt-xs">Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(user,index) in users"
                      :key="index"
                      v-if="user.status =='1' || (user.status=='0' && filter.deactivateds)"
                      :class="user.status=='0' ? 'bg-red-1' : ''">

                    <td>{{user.id}}</td>
                    <td>{{user.full_name}}</td>
                    <td class="gt-xs">{{user.email}}</td>
                    <td class="gt-xs">
                      <q-chip
                        color="primary"
                        tag small>
                        {{user.roles.length ? user.roles[0].name : ' - '}}
                      </q-chip>
                    </td>
                    <td class="gt-xs">{{user.created_at}}</td>
                    <td class="gt-xs">{{user.updated_at}}</td>
                    <td>
                      <q-btn
                        size="sm" rounded
                        icon="fas fa-user-edit" color="secondary"
                        :to="{name:'user.users.edit',params:{id:user.id}}">
                        <q-tooltip>
                          Edit
                        </q-tooltip>
                      </q-btn>

                      <q-btn
                        size="sm" rounded
                        class="q-ml-sm"
                        v-if="user.status=='1'"
                        icon="fas fa-user-times"
                        color="red"
                        @click="dialogChangeStatus(user,0)"
                      >
                        <q-tooltip>
                          Disable
                        </q-tooltip>
                      </q-btn>
                      <q-btn
                        size="sm" rounded
                        class="q-ml-sm"
                        v-if="user.status=='0'"
                        icon="fas fa-user-check"
                        color="primary"
                        @click="dialogChangeStatus(user,1)"
                      >
                        <q-tooltip>
                          Activate
                        </q-tooltip>
                      </q-btn>

                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div v-else
                   class="text-center"
                   style="margin-top: 60px">
                <p class="text-faded"
                >
                  No <b>Users</b> found...

                </p>
              </div>
              <!-- Pagination -->
              <div style="width: max-content; margin: 0 auto">
                <q-pagination
                  class="q-ma-lg"
                  v-if="pagination.max >= 2"
                  v-model="pagination.page"
                  color="primary"
                  @input="getData()"
                  :max="pagination.max"
                  :max-pages="6"
                  boundary-links
                  direction-links
                />
              </div>

            </div>
            <div v-else
                 class="text-center"
                 style="margin-top: 60px">
              <p class="text-faded"
              >
                No <b>Users</b> found in department selected...

              </p>
            </div>
          </div>
        </div>
      </div>

      <!--======================== LOADING ======================-->
      <q-inner-loading :visible="loading" style="z-index:1001; max-height: 100vh">
        <q-spinner-hourglass size="50px" color="primary"/>
      </q-inner-loading>

      <!--======================== DIALOG DEACTIVE AND REACTIVE USER ======================-->
      <q-dialog
        v-model="deactivate"
        stack-buttons
        prevent-close
      >
        <!-- This or use "title" prop on <q-dialog> -->
        <div class="q-heading text-warning"
             slot="title">
          Are you sure to {{statusToChange ? 'reactivate' : 'deactivate'}} this user?
        </div>


        <template slot="buttons" slot-scope="props">

          <q-btn flat :label="statusToChange ? 'Reactivate' : 'Deactivate'" @click="setStatusUser()"/>

          <q-btn flat label="Cancel" @click="userToChange = ''; deactivate = false"/>
        </template>
      </q-dialog>


      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab-mini color="secondary"
               icon="fas fa-plus"
               @click="createUser">
          <q-tooltip>
            New User
          </q-tooltip>
        </q-btn>
      </q-page-sticky>
    </div>
  </q-page>
</template>
<script>
  /*Services*/
  import userService from '../_services/users'

  /*Plugins*/
  import {alert} from '@imagina/qhelper/_plugins/alert'
  import {helper} from '@imagina/qhelper/_plugins/helper'
  import auth from '../_plugins/auth'

  export default {
    props: {},
    components: {},
    watch: {},
    mounted() {
      this.$nextTick(function () {
        if (auth.hasAccess('fhia.roles.dept-manager'))
          this.getData();
        else {
          alert.error('Permission Denied', 'bottom')
          this.$router.push('/')
        }
      })
    },
    data() {
      return {
        users: [],
        pagination: {
          page: 1,
          max: 1,
        },
        loading: false,
        filter: {
          search: '',
          deactivateds: false
        },
        deactivate: false,
        userToChange: '',
        statusToChange: '',
        usedFilter: false
      }
    },
    methods: {
      getData() {
        this.loading = true;
        let page = this.pagination.page;
        helper.storage.get.item("depSelected").then(response => {
          let departmentId = response
          let filter = {};

          //departmentId != 'all' ? filter.department = departmentId : false;
          this.filter.search != '' ? filter.search = this.filter.search : false;
          filter.status = this.filter.deactivateds ? [0, 1] : [1];

          userService.index(filter, 10, page, '', 'roles')
            .then((response) => {
              this.users = response.data
              this.pagination.max = response.meta.page.lastPage
              this.loading = false

            })
            .catch((error) => {
              alert.error('No users found', 'bottom')
              this.loading = false
            })
        })
      },
      createUser(id) {
        this.$router.push('/users/create')
      },

      dialogChangeStatus(user, status) {
        this.userToChange = user;
        this.statusToChange = status;
        this.deactivate = true;
      },

      setStatusUser() {
        this.deactivate = false
        this.loading = true
        let data = JSON.parse(JSON.stringify(this.userToChange));
        data.status = this.statusToChange;
        userService.update(data, data.id)
          .then(response => {
            this.loading = false;
            this.userToChange.status = this.statusToChange;
            alert.success('User updated', 'top')
          })
          .catch(error => {
            this.loading = false;
            let errorMessage = error.response.data.error ? error.response.data.error : 'User not updated';
            alert.error(errorMessage, 'bottom')
          })
      }
    }

  }
</script>
<style lang="stylus">
  @import "~variables";

  #listUserContent
    border 1px solid $grey-4
</style>
