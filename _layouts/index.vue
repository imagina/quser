<template>
  <q-page class="q-layout-page row justify-center layout-padding">
    <div class="q-container">
      <!--- TITLE -->
      <div class="text-title-border text-blue-9 col-xs-12 q-title text-right">
        <span>USER LIST</span>
      </div>

      <!-- CONTENT -->
      <div id="listUserContent" class="col-12 q-mt-lg round-borders">
        <div class="row gutter-sm justify-center relative-position">
          <!-- TABLE LIST USERS -->
          <div class="col-12">
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
                @request="getData"
              >
                <!--= Search =-->
                <template slot="top-left" slot-scope="props">
                  <q-search
                    hide-underline
                    clearable
                    color="secondary"
                    v-model="filter.search"
                    @input="pagination.page = 1; getData({pagination:pagination,filter:filter})"

                    class="col-6"
                  />

                </template>

                <!--= Config Table =-->
                <template slot="top-right" slot-scope="props">
                  <div class="row gutter-sm justify-end items-center full-width">
                    <!-- Deparments -->
                    <div class="col-12 col-md-2 col-sm-3">
                      <q-field

                      >
                        <treeselect

                          :append-to-body="true"
                          :options="$store.getters['auth/departmentsSelect']"
                          :value-consists-of="valueConsistsOf"
                          v-model="departmentSelected"
                          placeholder="All Departments"
                          @input="pagination.page = 1; getData({pagination:pagination,filter:filter})"
                        />

                      </q-field>


                    </div>

                    <!-- Roles -->
                    <div class="col-12 col-md-2 col-sm-3">
                      <q-select
                        placeholder="All Roles"
                        :hide-underline="true"
                        clearable
                        v-model="rolesSelected"
                        :options="options.roles"
                        @input="pagination.page = 1; getData({pagination:pagination,filter:filter})"
                      />

                    </div>

                    <q-table-columns
                      color="secondary"
                      class="q-mr-sm"
                      v-model="visibleColumns"
                      :columns="columnsTable"
                    />

                    <q-toggle
                      class="q-mx-sm"
                      v-model="filter.deactivateds"
                      @input="pagination.page = 1; getData({pagination:pagination,filter:filter})"
                      label="Show disabled users"/>


                  </div>
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
                    v-if="props.row.activated=='1'"
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
                    v-if="props.row.activated=='0'"
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

      <!-- CHANGE STATUS USER -->
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

      <!-- CREATE USER -->
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab-mini color="secondary"
               icon="add"
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
  import profileService from '@imagina/quser/_services/profile/index'

  /*Plugins*/
  import {alert} from '@imagina/qhelper/_plugins/alert'
  import {helper} from '@imagina/qhelper/_plugins/helper'
  import _cloneDeep from 'lodash.clonedeep'
  import auth from '../_plugins/auth'


  /*Components*/
  import Treeselect from '@riophae/vue-treeselect';
  import '@riophae/vue-treeselect/dist/vue-treeselect.css';

  export default {
    props: {},
    components: {
      Treeselect
    },
    watch: {},
    mounted() {
      this.$nextTick(function () {
        this.initialize()
        this.getData({pagination: this.pagination, filter: this.filter});
      })
    },
    data() {
      return {
        departmentSelected: null,
        rolesSelected: null,
        valueConsistsOf: 'BRANCH_PRIORITY',
        options: {
          roles: []
        },
        pagination: {
          page: 1,
          rowsPerPage: 15,
          rowsNumber: 1
        },
        loading: false,
        dataUsers: [],
        visibleColumns: [
          'id', 'fullName', 'role',
          'createdAt', 'actions'
        ],
        columnsTable: [
          {
            name: 'id', label: 'ID', field: 'id',
            align: 'center', sortable: true
          },
          {
            name: 'fullName', label: 'USER', field: 'fullName',
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
            name: 'createdAt', label: 'CREATED', field: 'createdAt',
            format: val => val ? this.$d(this.$moment(val, 'YYYY-MM-DD HH:mm').toDate(), 'short', this.$q.i18n.lang) : '-',
            align: 'center', sortable: true
          },
          {
            name: 'updatedAt', label: 'UPDATED', field: 'updatedAt',
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
      initialize() {


        profileService.crud.index('apiRoutes.profile.roles', {params: {filter: {}}}).then(response => {
          this.options.roles = this.$helper.array.select(response.data);

        });
      },
      getData({pagination, search}) {

        this.loading = true;

        let filter = {};

        //set search filter
        this.filter.search != '' ? filter.search = this.filter.search : false;

        //set status filter
        filter.status = this.filter.deactivateds ? [0, 1] : [1];

        //set roles filter
        if (this.rolesSelected)
          filter.roles = [this.rolesSelected]

        //set branchOffice filter
        if (this.departmentSelected)
          filter.department = this.departmentSelected

        let params = {
          params: {
            filter: filter,
            take: pagination.rowsPerPage,
            page: pagination.page,
            fields: 'id,first_name,last_name,created_at,updated_at',
            include: 'roles'
          }
        }
        profileService.crud.index('apiRoutes.profile.users', params)
          .then((response) => {
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
          activated: this.statusToChange,
        };
        profileService.crud.update('apiRoutes.profile.users', datax.id, datax)
          .then(response => {
            this.loading = false;
            let user = this.dataUsers.find(item => item.id == datax.id);
            user.activated = datax.activated;
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
  //#listUserContent
</style>
