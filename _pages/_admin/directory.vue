<template>
  <div id="directoryCorporativePage">
    <!--Content-->
    <div id="pageContent" class="box relative-position">
      <!--Search-->
      <div class="full-width row">
        <dynamic-field v-model="search" :field="searchField" class="col-12 col-md-4 col-xl-3"
                       @input="getData()"/>
      </div>
      <!--Users-->
      <div id="usersContent" class="q-py-lg row q-col-gutter-lg">
        <!--Empty list-->
        <div v-if="!loading && users && !users.length">
          <not-result/>
        </div>
        <!--List-->
        <div v-else v-for="(user, key) in userList" :key="key" class="col-12 col-lg-6">
          <div class="row items-center user-card">
            <!--User Name-->
            <div class="col-12">
              <div class="text-capitalize ellipsis text-weight-bold">
                {{ user.fullName }}
              </div>
              <q-separator class="q-my-sm"/>
            </div>
            <!--Image-->
            <div class="col-12 col-lg-5">
              <div class="img-content">
                <avatar-image :src="user.mainImage" width="1160px" height="116px"/>
              </div>
            </div>
            <!--Information-->
            <div class="col-12 col-lg-7">
              <q-list>
                <q-item v-for="(item, index) in user.informationBlocks" :key="index"
                        style="padding:0" :clickable="item.copy ? true : false"
                        @click.native="item.copy ? $helper.copyToClipboard(item.copy) : null">
                  <q-item-section>
                    <!--Name-->
                    <q-item-label overline>
                      <q-icon :name="item.icon" color="primary"/>
                      {{ item.label }}
                    </q-item-label>
                    <!--Value-->
                    <q-item-label class="q-pl-sm ellipsis">{{ item.value }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </div>
      </div>
      <!--Pagination-->
      <div class="row justify-end full-width">
        <q-pagination v-model="pagination.page" :max="pagination.lastPage" input color="grey-9"
                      @input="(page) => {pagination.page = page; getData()}"/>
      </div>
      <!--Loading-->
      <inner-loading :visible="loading"/>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      search: null,
      rolesToDirectory: this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::rolesToDirectory'),
      pagination: {
        perPage: 20,
        page: 1,
        lastPage: 1
      },
      users: []
    }
  },
  computed: {
    searchField() {
      return {
        value: null,
        type: 'search'
      }
    },
    //user transformed
    userList() {
      let userList = this.users || []
      //Transform data
      userList.forEach(item => {
        //Transform fields
        let fields = this.$helper.convertToFrontField(item.fields)
        //Tranform full name
        item.fullName = item.fullName.toLowerCase()
        //Create information blocks
        item.informationBlocks = [
          {
            label: this.$tr('isite.cms.label.role'),
            icon: 'fas fa-user',
            value: item.roles ? item.roles.map(item => {
              return item.name
            }).join(', ') : ''
          },
          {
            label: this.$tr('isite.cms.label.email'),
            icon: 'fas fa-envelope',
            copy: item.email,
            value: item.email
          },
          {
            label: this.$tr('isite.cms.label.phone'),
            icon: 'fas fa-phone',
            copy: fields.cellularPhone ? fields.cellularPhone.value : false,
            value: fields.cellularPhone ? this.$helper.maskPhone(fields.cellularPhone.value) : '-'
          }
        ]
      })
      //Response
      return userList
    }
  },
  methods: {
    init() {
      this.setFilters()//Set filters
      this.getData()//Get data
      //Listen event refresh
      this.$root.$on('page.data.refresh', () => this.getData(true))
    },
    //Set filters
    setFilters() {
      this.$filter.setFilter({
        name: this.$route.name,
        fields: {
          roleId: {
            value: null,
            type: 'select',
            props: {
              label: this.$tr('isite.cms.label.role'),
              clearable: true
            },
            loadOptions: {
              apiRoute: 'apiRoutes.quser.roles',
              select: {label: 'name', id: 'id'},
              requestParams: {filter: {id: this.rolesToDirectory}}
            }
          }
        },
        callBack: () => this.getData(true)
      })
    },
    //Get data
    getData(refresh = false) {
      return new Promise((resolve, reject) => {
        this.loading = true
        //request params
        let requestParams = {
          refresh: refresh,
          params: {
            page: this.pagination.page,
            take: this.pagination.perPage,
            include: 'roles',
            filter: {
              search: this.search,
              ...this.$filter.values
            }
          }
        }
        //Validate role filter
        if (!requestParams.params.filter.roleId)
          requestParams.params.filter.roleId = this.rolesToDirectory
        //Request
        this.$crud.index('apiRoutes.quser.users', requestParams).then(response => {
          this.users = response.data
          this.pagination.lastPage = response.meta.page.lastPage
          this.loading = false
          resolve(response.data)
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            this.loading = false
            reject(error)
          })
        })
      })
    }
  }
}
</script>
<style lang="scss">
#directoryCorporativePage {
  #usersContent {
    .user-card {
      background: #f7f7f7;
      border-radius: 8px;
      padding: 15px;

      .img-content {
        border: 1px solid $grey-5;
        border-radius: 50%;
        height: 130px;
        width: 130px;
        padding: 6px;
        margin: auto;
        overflow: hidden;

        .avatar-img-content {
          border-radius: 50% !important;
        }
      }
    }
  }
}
</style>
