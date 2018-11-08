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
      <div id="listUserContent" class="col-12">
        <div class="row gutter-sm justify-center relative-position">


          <!-- TABLE LIST USERS -->
          <div class="col-12">
            <div >

              <div class="table-responsive" style="overflow-x: scroll">
                <q-table
                  :loading="loading"
                  :data="dataUsers"
                  :visible-columns="visibleColumns"
                  :columns="columnsTable"
                  :separator="separatorTable"
                  :pagination.sync="pagination"
                  row-key="name"
                  color="secondary"
                  @request="pagination.page++;getData()"
                >
                  <!--= Search =-->
                  <template slot="top-left" slot-scope="props">
                    <q-search
                      hide-underline
                      clearable
                      color="secondary"
                      v-model="filter.search"
                      @input="pagination.page = 1; getData()"

                      class="col-6"
                    />

                  </template>

                  <!--= Config Table =-->
                  <template slot="top-right" slot-scope="props">
                    <q-table-columns
                      color="secondary"
                      class="q-mr-sm"
                      v-model="visibleColumns"
                      :columns="columnsTable"
                    />

                    <q-toggle
                      class="q-mx-sm"
                      v-model="filter.deactivateds"
                      @input="pagination.page = 1; getData()"
                      label="Show disabled users"/>
                    <q-btn
                      flat round dense
                      :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                      @click="props.toggleFullscreen"
                    />
                  </template>

                  <!--= Custom Columns =-->
                  <q-td slot="body-cell-role"
                        slot-scope="props" :props="props">
                    <q-chip
                      color="primary"
                      tag small>
                      {{props.row.roles.length ? props.row.roles[0].name : ' - '}}
                    </q-chip>
                  </q-td>
                  <q-td slot="body-cell-actions"
                        slot-scope="props" :props="props">
                    <q-btn
                      size="sm" rounded
                      icon="fas fa-user-edit" color="secondary"
                      :to="{name:'user.users.edit',params:{id:props.row.id}}">
                      <q-tooltip>
                        Edit
                      </q-tooltip>
                    </q-btn>

                    <q-btn
                      size="sm" rounded
                      class="q-ml-sm"
                      v-if="props.row.status=='1'"
                      icon="fas fa-user-times"
                      color="red"
                      @click="dialogChangeStatus(props.row,0)"
                    >
                      <q-tooltip>
                        Disable
                      </q-tooltip>
                    </q-btn>

                    <q-btn
                      size="sm" rounded
                      class="q-ml-sm"
                      v-if="props.row.status=='0'"
                      icon="fas fa-user-check"
                      color="primary"
                      @click="dialogChangeStatus(props.row,1)"
                    >
                      <q-tooltip>
                        Activate
                      </q-tooltip>
                    </q-btn>
                  </q-td>
                </q-table>



              </div>



            </div>

          </div>

        </div>
      </div>


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
        if (auth.hasAccess('fhia.roles.dept-manager')) {
          this.getData()

        } else {
          alert.error('Permission Denied', 'bottom')
          this.$router.push('/')
        }
      })
    },
    data() {
      return {
        pagination: {
          page: 1,
          rowsPerPage: 15,
          rowsNumber: 1
        },
        loading: false,
        dataUsers: [],
        visibleColumns: [
          'id', 'full_name', 'role',
          'created_at', 'actions'
        ],
        columnsTable: [
          {
            name: 'id', label: 'ID', field: 'id',
            align: 'center', sortable: true
          },
          {
            name: 'full_name', label: 'USER', field: 'full_name',
            align: 'left', sortable: true
          },
          {
            name: 'email', label: 'USER LOGIN', field: 'email',
            align: 'left', sortable: true
          },
          {
            name: 'role', label: 'ROLE', field: 'role',
            align: 'left', sortable: true
          },
          {
            name: 'created_at', label: 'CREATED', field: 'created_at',
            format: val => val ? this.$d(new Date(val), 'short', this.$q.i18n.lang) : '-',
            align: 'center', sortable: true
          },
          {
            name: 'updated_at', label: 'UPDATED', field: 'updated_at',
            align: 'center', sortable: true
          },
          {
            name: 'actions', label: 'ACTIONS', field: 'actions',
            align: 'center'
          },

        ],
        separatorTable: 'horizontal',
        filterTable: '',
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

          userService.index(filter, this.pagination.rowsPerPage, this.pagination.page, 'email', 'roles')
            .then((response) => {
              console.warn(response);
              this.dataUsers = response.data;
              this.pagination.rowsPerPage = response.meta.page.perPage;
              this.pagination.page = response.meta.page.currentPage;
              this.pagination.rowsNumber = response.meta.page.total;
              this.dataUsers.forEach(element => {
                element['actions'] = ""
              })
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
        //let data = JSON.parse(JSON.stringify(this.userToChange));
        let datax = {
          id: this.userToChange.id,
          status: this.statusToChange,
        };
        console.log(datax)

        userService.update(datax, datax.id)
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
