<template>
  <q-page class="relative-position">

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


    <div class="text_title text-blue-9 col-xs-12 q-title text-right">
      <span>Users</span>

    </div>
    <br><br>
    <div class="col-xs-12">

      <div class="row justify-end items-center q-mx-xl ">

        <div class="col-sm-4 q-mb-xl q-px-lg">
          <!-- Search -->
          <q-search
            v-model="filter.search"
            placeholder="Text Search"
            @keyup.enter="pagination.page = 1; getData()"
            class="q-mt-xl"/>
          <q-checkbox
            v-model="filter.deactivateds"
            checked-icon="visibility"
            unchecked-icon="visibility_off"
            label="Deactivated Users"
            @input="pagination.page = 1; getData()"
          />
        </div>


      </div>

    </div>

    <div v-if="users.length || loading" id="users-index"
         class="q-layout-page row justify-center layout-padding">

      <div v-if="users.length" class="table-responsive">

        <table class="q-table">
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
                small>
                {{user.roles[0].name}}
              </q-chip>
            </td>
            <td class="gt-xs">{{user.created_at}}</td>
            <td class="gt-xs">{{user.updated_at}}</td>
            <td>
              <q-btn
                round
                class=""
                icon="edit"
                color="secondary"
                :to="{name:'user.users.edit',params:{id:user.id}}"
                size="sm"
              />

              <q-btn
                v-if="user.status=='1'"
                round
                class=""
                icon="delete"
                color="red"
                @click="dialogChangeStatus(user,0)"
                size="sm"
              />
              <q-btn
                v-if="user.status=='0'"
                round
                class=""
                icon="arrow_upward"
                color="primary"
                @click="dialogChangeStatus(user,1)"
                size="sm"
              />

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
    <div v-else
         class="text-center"
         style="margin-top: 60px">
      <p class="text-faded"
      >
        No <b>Users</b> found in department selected...

      </p>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab-mini color="secondary" icon="add" class="animate-pop" @click="createUser"/>
    </q-page-sticky>
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
        let departmentId = helper.storage.get.item("depSelected") //Department id
        let filter = {};

        departmentId != 'all' ? filter.department = departmentId : false;
        this.filter.search != '' ? filter.search = this.filter.search : false;
        this.filter.deactivateds ? filter.status = [0, 1] : false;

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

</style>
