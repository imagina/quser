<template>
  <q-page class="q-layout-page row justify-center layout-padding">
    <div class="q-container">
      <!--TITLE-->
      <h1 class="q-headline text-primary">
        <q-icon name="fas fa-users"></q-icon>
        User List
      </h1>

      <!-- CONTENT -->
      <div class="backend-page relative-position">
        <!-- TABLE LIST USERS -->
        <div class="col-12">
          <q-table
            :data="dataUsers"
            :visible-columns="visibleColumns"
            :columns="columnsTable"
            :separator="separatorTable"
            :pagination.sync="pagination"
            row-key="name"
            class="shadow-1 border-top-color"
            @request="getData"
          >
            <!--Header Table-->
            <template slot="top" slot-scope="props">
              <div class="row full-width">
                <!--Search-->
                <div class="col-12 col-md-6 q-mt-sm">
                  <div class="col-12 col-md-6">
                    <q-search hide-underline clearable v-model="filter.search"
                              @input="pagination.page = 1; getData({pagination:pagination,filter:filter})"/>
                  </div>
                </div>
                <!--Button Actions-->
                <div class="col-12 col-md-6 q-mt-sm text-right">
                  <!--Button new record-->
                  <q-btn icon="fas fa-edit" color="positive" label="New Product"
                         v-if="$auth.hasAccess('profile.user.create')"
                         :to="{name: 'user.users.create'}" rounded />
                  <!--Button refresh data-->
                  <q-btn icon="fas fa-sync-alt" color="info" class="q-ml-xs"
                         @click="getData({pagination:pagination,filter:filter} , true)" rounded>
                    <q-tooltip :delay="300">Refresh Data</q-tooltip>
                  </q-btn>
                </div>
                <!--Filters-->
                <div class="col-12 q-mt-sm">
                  <!--By Department-->
                  <div class="cont-vue-tree">
                    <div class="stack-label float-left">Department:</div>
                    <treeselect
                      :append-to-body="true"
                      :options="$store.getters['auth/departmentsSelect']"
                      :value-consists-of="valueConsistsOf"
                      v-model="departmentSelected"
                      placeholder="All Departments"
                      @input="pagination.page = 1; getData({pagination:pagination,filter:filter})"
                    />
                  </div>
                  <!--By Role-->
                  <div class="cont-vue-tree">
                    <div class="stack-label float-left">Role:</div>
                    <treeselect
                      :append-to-body="true"
                      :options="options.roles"
                      :value-consists-of="valueConsistsOf"
                      v-model="rolesSelected"
                      placeholder="All Roles"
                      @input="pagination.page = 1; getData({pagination:pagination,filter:filter})"
                    />
                  </div>
                  <!--Columns-->
                  <div class="cont-vue-tree">
                    <div class="stack-label float-left">Columns:</div>
                    <q-table-columns
                      color="primary"
                      class="q-mr-sm"
                      v-model="visibleColumns"
                      :columns="columnsTable"
                    />
                  </div>
                  <!--Toogle status-->
                  <q-toggle
                    class="q-mx-sm"
                    v-model="filter.deactivateds"
                    @input="pagination.page = 1; getData({pagination:pagination,filter:filter})"
                    label="Show disabled users"/>
                </div>
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
                icon="fas fa-user-edit" color="positive"
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

        <!--Loading-->
        <inner-loading :visible="loading"/>
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
  import innerLoading from 'src/components/master/innerLoading'

  export default {
    props: {},
    components: {
      Treeselect, innerLoading
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
          this.options.roles = this.$helper.array.tree(response.data);
        });
      },
      getData({pagination, search}, refresh = false) {
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
          refresh : refresh,
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
