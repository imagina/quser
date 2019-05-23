<template>
  <div id="roleForm"
       class="q-layout-page row justify-center layout-padding">


    <div class="col-12">
      <q-field
        :error="$v.form.name.$error"
        error-label="This field is required"
      >
        <q-input
          type="text"
          v-model="form.name"
          stack-label="Role Name *:"

        />
      </q-field>
    </div>
    <div class="col-12">
      <q-field
        :error="$v.form.slug.$error"
        error-label="This field is required"
      >
        <q-input
          type="text"
          v-model="form.slug"
          stack-label="Slug *:"
        />
      </q-field>
    </div>
    <q-card class="q-box no-shadow col-12 q-mb-sm" v-if="$auth.hasAccess('profile.permissions.manage')">
      <q-card-title class="no-border q-py-none bg-grey-2">
        <div class="row justify-between">
          <div class="q-subheading text-primary">
            <q-icon name="fas fa-check-double"></q-icon>
            Permissions
          </div>
          <q-toggle
            v-model="permissionsToggle"
            checked-icon="visibility"
            unchecked-icon="visibility_off"
            style="margin-left: 25px"
          />
        </div>

      </q-card-title>

      <q-collapsible header-style="display: none" v-model="permissionsToggle">


        <div class="row full-width justify-end">

          <q-btn-group class="float-right">
            <q-btn size="sm" label="Allow all" @click="setAllPermissions(true)"/>

            <q-btn size="sm" label="Deny all" @click="setAllPermissions(false)"/>
          </q-btn-group>

        </div>

        <q-collapsible v-for="(permissionBackend,i) in permissionsBackend" :key="i" icon="fas fa-check" :label="i"
                       style="border-bottom: 1px solid whitesmoke">
          <q-collapsible popup v-for="(permissionDetail,j) in permissionBackend" :key="j" icon="fas fa-code-branch"
                         :label="j">
            <div class="row q-py-xs q-my-xs justify-between" style="border-bottom: 1px solid whitesmoke"
                 v-for="(permission,k) in permissionDetail" :key="k" :label="k">
              <div class="col-12 col-md-4">
                <span label>{{k}}</span>
              </div>
              <div class="col-12 col-md-4 text-right">
                <q-btn-group>
                  <q-btn size="sm" label="Allow" :color="getPermissionValue(j+'.'+k) ? 'green':''"
                         @click="setPermission(j+'.'+k,true)"/>

                  <q-btn size="sm" label="Deny" :color="!getPermissionValue(j+'.'+k) ? 'green':''"
                         @click="setPermission(j+'.'+k,false)"/>
                </q-btn-group>
              </div>
            </div>

          </q-collapsible>


        </q-collapsible>


        <div class="row full-width justify-end">

          <q-btn-group class="float-right">
            <q-btn size="sm" label="Allow all" @click="setAllPermissions(true)"/>

            <q-btn size="sm" label="Deny all" @click="setAllPermissions(false)"/>
          </q-btn-group>

        </div>

      </q-collapsible>
    </q-card>

    <q-card class="q-box no-shadow col-12 q-mb-sm">
      <q-card-title class="no-border q-py-none bg-grey-2">
        <div class="row justify-between">
          <div class="q-subheading text-primary">
            <q-icon name="fas fa-tasks"></q-icon>
            Settings
          </div>
          <q-toggle
            v-model="settingsToggle"
            checked-icon="visibility"
            unchecked-icon="visibility_off"
            style="margin-left: 25px"
          />
        </div>

      </q-card-title>

      <q-collapsible header-style="display: none" v-model="settingsToggle" >
        <div class="row gutter-sm">


          <div class="col-12 relative-position">
            <q-tabs
              animated
              swipeable
              inverted
              color="primary"
              align="justify"
              v-model="settingTab"
            >
              <!-- Tabs - notice slot="title" -->
              <q-tab label="list" slot="title" default name="list"/>
              <q-tab label="assignedRoles" slot="title" name="assignedRoles"/>
              <q-tab label="assignedDepartments" slot="title" name="assignedDepartments"/>
              <q-tab label="assignedSettings" slot="title" name="assignedSettings"/>
              <!-- Targets -->
              <q-tab-pane keep-alive name="list">

                <q-list link no-border separator>

                  <!-- item assigned roles settings -->
                  <q-item tag="label">
                    <q-item-main>
                      <q-item-tile label>Can manage users with following roles</q-item-tile>
                    </q-item-main>
                    <q-item-side right>
                      <q-btn color="primary"
                             flat round
                             icon="arrow_forward"
                             size="sm"
                             @click="settingTab = 'assignedRoles'"/>
                    </q-item-side>
                  </q-item>
  
                  <!-- item assigned departments settings -->
                  <q-item tag="label">
                    <q-item-main>
                      <q-item-tile label>Can manage departments under following departments</q-item-tile>
                    </q-item-main>
                    <q-item-side right>
                      <q-btn color="primary"
                             flat round
                             icon="arrow_forward"
                             size="sm"
                             @click="settingTab = 'assignedDepartments'"/>
                    </q-item-side>
                  </q-item>
  
                    <!-- item assigned settings -->
                  <q-item tag="label">
                    <q-item-main>
                      <q-item-tile label>Can manage the following settings</q-item-tile>
                    </q-item-main>
                    <q-item-side right>
                      <q-btn color="primary"
                             flat round
                             icon="arrow_forward"
                             size="sm"
                             @click="settingTab = 'assignedSettings'"/>
                    </q-item-side>
                  </q-item>
                  <q-item-separator/>
                </q-list>

              </q-tab-pane>
              <q-tab-pane keep-alive name="assignedRoles">
                <div class="row">

                  <!-- Roles -->
                  <div class=" col-12">
                    <q-field
                      v-if="roles.length"
                      :disabled="rolesLoading"
                    >
                      <q-select
                        stack-label="Assigned Roles"
                        v-model="settings.assignedRoles.value"
                        :options="roles"
                        multiple chips
                      />
                    </q-field>
                    <div class="q-py-xs">
                      <q-btn color="primary" rounded flat icon="arrow_back" @click="settingTab = 'list'" size="sm">
                        go back
                      </q-btn>
                    </div>

                  </div>
                </div>

              </q-tab-pane>
              <q-tab-pane keep-alive name="assignedDepartments">
    
                <div class="row">
      
                  <!-- Deparments -->
                  <div class=" col-12">
                    <q-field
                      :disabled="departmentsLoading"
                    >
                      <treeselect
                        :multiple="true"
                        :append-to-body="true"
                        :options="$store.getters['auth/departmentsSelect']"
                        :value-consists-of="valueConsistsOf"
                        v-model="settings.assignedDepartments.value"
                        placeholder=""
                      />
        
                    </q-field>
                    <div class="q-py-xs">
                      <q-btn color="primary" rounded flat icon="arrow_back" @click="settingTab = 'list'" size="sm">
                        go back
                      </q-btn>
                    </div>
      
                  </div>
                </div>
  
  
              </q-tab-pane>
              <q-tab-pane keep-alive name="assignedSettings">
    
                <div class="row">
      
                  <!-- Settings -->
                  <div class=" col-12">
                    <q-field
                      :disabled="departmentsLoading"
                    >
                      <treeselect
                      :multiple="true"
                      :append-to-body="true"
                      :options="this.siteSettings"
                      value-consists-of="LEAF_PRIORITY"
                      v-model="settings.assignedSettings.value"
                      placeholder=""
                    />
                    </q-field>
                    <div class="q-py-xs">
                      <q-btn color="primary" rounded flat icon="arrow_back" @click="settingTab = 'list'" size="sm">
                        go back
                      </q-btn>
                    </div>
      
                  </div>
                </div>
  
  
              </q-tab-pane>
            </q-tabs>
          </div>
        </div>
      </q-collapsible>
    </q-card>


    <!--=== SAVE ===-->
    <div class="col-12 text-center q-my-md">
      <q-btn :loading="loading"
             color="positive"
             label="Save"
             icon="fas fa-save"
             @click="submit" />
    </div>
  </div>
</template>
<script>

  /*Plugins*/
  import {required, email, sameAs, minLength} from 'vuelidate/lib/validators';
  import {alert} from '@imagina/qhelper/_plugins/alert';
  import {helper} from '@imagina/qhelper/_plugins/helper';
  import config from 'src/config/index';

  /*Services*/
  import profileService from '@imagina/quser/_services/profile/index';
  import siteService from '@imagina/qsite/_services/index'
  
  /*Components*/
  import Treeselect from '@riophae/vue-treeselect';
  import '@riophae/vue-treeselect/dist/vue-treeselect.css';

  export default {
    props: {
      record: {
        default: () => {
          return {}
        },
      },
      parentId: {
        default: () => {
          return {}
        },
      },
      storeName: {
        default: () => {
          return {}
        },
      }
    },
    components: {
      Treeselect
    },
    watch: {
      record() {
        this.$v.form.$reset()
        this.initializeData()
      }
    },
    validations: {
      form: {
        name: {
          required
        },
        slug: {
          required
        }
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.$v.form.$reset()
        this.initializeData()
      })
    },
    data() {
      return {
        permissionsToggle: false,
        settingsToggle: false,
        permissionsOptions: [],
        permissionSelected: '',
        permissionsBackend: '',
        loading: false,
        preleadForms: [],
        roles: [],
        departments: [],
        rolesLoading: false,
        departmentsLoading: false,
        valueConsistsOf: 'ALL',
        settingTab: 'list',
        form: {
          name: '',
          slug: '',
          permissions: {},
        },
        settings: {
          assignedSources: [],
          assignedRoles: [],
          assignedDepartments: [],
          assignedSettings: [],
        },
        siteSettings:{}
      }
    },
    methods: {
      initializeData() {
        profileService.role.getPermissions().then(response => {
          this.permissionsBackend = response.data
        });

        this.permissionsOptions = []
        this.form = JSON.parse(JSON.stringify(this.record))

        if(this.record.id)
          this.convertPermissions('front');


        let settings = [
          {name: 'assignedSources', value: []},
          {name: 'assignedRoles', value: []},
          {name: 'assignedDepartments', value: []},
          {name: 'assignedSettings', value: []}
        ]

        this.settings = helper.convertToFrontField(settings, this.form.settings);

        this.rolesLoading = true
        profileService.crud.index('apiRoutes.profile.roles').then(response => {
          this.roles = this.$helper.array.select(response.data);
          this.rolesLoading = false;
        });

        this.departmentsLoading = true

        profileService.crud.index('apiRoutes.profile.departments', {}).then(response => {
          this.departments = this.$helper.array.select(response.data)
          this.departmentsLoading = false
        })
  
        //this.loadingModules = true
        let params = {
          params:{
            filter:{
              allTranslations: true
            },
          },
          remember:false
        }
        siteService.crud.index('apiRoutes.site.settings',params).then(response => {
          this.settingsToTree(response.data);
          //this.getSingleModule(this.nameModuleSelected)
          //this.loadingModules = false
        })
  
  
      },

      settingsToTree(modules){
        
        let tree = []
        for(const moduleName in modules){
          let children = []
          let module = modules[moduleName]
          for (const settingName in module){
            let setting = module[settingName]
            children.push({
              id: setting.name,
              label: settingName
            })
          }
          tree.push({
            id: moduleName,
            label: moduleName,
            children: children
          })
        }
        this.siteSettings = tree
      },
      
      setAllPermissions(value) {

        for (const module in this.permissionsBackend) {
          let moduleData = this.permissionsBackend[module]
          for (const permissions in moduleData) {
            let permissionsData = moduleData[permissions]
            for (const permission in permissionsData) {
              let perm = this.permissionsOptions.find(perm => perm.label === permissions + '.' + permission);
              if (perm) {
                perm.value = value;
              } else
                this.permissionsOptions.push({label: permissions + '.' + permission, value: value})
            }
          }
        }

      },

      setPermission(label, val) {
        let permission = this.permissionsOptions.find(perm => perm.label === label);
        if (permission) {
          permission.value = val;
        } else
          this.permissionsOptions.push({label: label, value: val})
      },

      getPermissionValue(label) {
        let permission = this.permissionsOptions.find(perm => perm.label === label);
        return permission ? permission.value : false;
      },

      convertPermissions(to) {
        switch (to) {
          case 'front':
            for (const module in this.permissionsBackend) {
              let moduleData = this.permissionsBackend[module]
              for (const permissions in moduleData) {
                let permissionsData = moduleData[permissions]
                for (const permission in permissionsData) {
                  let value = this.form.permissions[permissions + '.' + permission];
                  this.permissionsOptions.push(
                    {
                      label: permissions + '.' + permission,
                      value: value ? value : false
                    })
                }
              }
            }
            break;

          case 'back':
            this.form.permissions = {}
            this.permissionsOptions.forEach(element => {
              if (element.value == true)
                this.form.permissions[element.label] = element.value
            })
            break;
        }
      },

      submit() {
        this.$v.$touch();//validate all fields from form

        if (!this.$v.$error) {

          this.loading = true;
          this.convertPermissions('back');
          this.form.settings = helper.convertToBackField(this.settings)
          if (this.form.id) {

            profileService.crud.update('apiRoutes.profile.roles', this.form.id, this.form).then(response => {

              this.loading = false;
              this.$emit("clearCache")
              this.$emit("getRecords")
              this.$emit("closeModal")
              alert.success("Role Updated", 'top');
            }).catch(error => {

              let errorMessage = error ?
                error : 'Role not updated';
              this.$emit("closeModal")
              alert.error(errorMessage, 'bottom');
              this.loading = false;
            })
          } else {
            profileService.crud.create('apiRoutes.profile.roles', this.form).then(response => {
              this.loading = false;
              this.$emit("clearCache")
              this.$emit("getRecords")
              this.$emit("closeModal")
              alert.success("Role Created", 'top');
            }).catch(error => {
              let errorMessage = error ?
                error : 'Role not created';
              this.$emit("closeModal")
              alert.error(errorMessage, 'bottom');
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
  #roleForm
    .q-item
      padding 0 10px

    .q-tabs
      .q-tabs-head
        display none

      .q-tabs-panes
        border 0

      .q-tab-pane
        padding 0

    .q-card
      margin-bottom 15px

    .q-card-title
      border 0
</style>