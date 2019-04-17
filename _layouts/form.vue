<template>
  <div id="userForm" class="q-layout-page row justify-center layout-padding">
    
    
    <div class="text_title text-blue-9 col-xs-12 q-title text-right">
      <span>USER</span>
    </div>
    
    <div class="q-py-sm q-title col-12 text-negative">
      • {{title}}
    </div>
    
    <!-- General Information -->
    <q-card class="q-box no-shadow col-12">
      
      <q-card-title class="no-border q-py-none bg-grey-2">
        <div class="row justify-between">
          <div class="q-subheading text-primary">
            General Information
          </div>
          <q-toggle
            v-model="generalInfoToggle"
            checked-icon="visibility"
            unchecked-icon="visibility_off"
            style="margin-left: 25px"
          />
        </div>
      
      </q-card-title>
      <q-collapsible header-style="display: none" v-model="generalInfoToggle">
        <div class="row">
          
          <div class="col-12">
            <div class="row gutter-xs items-center">
              <!-- First Name -->
              <div class="col-12 col-md-4 ">
                <q-field
                  :error="$v.form.firstName.$error"
                  error-label="This field is required"
                >
                  <q-input type="text"
                           v-model="form.firstName"
                           float-label="First Name *"
                  />
                </q-field>
              </div>
              
              <!-- Last Name -->
              <div class="col-12 col-md-4">
                <q-field
                  :error="$v.form.lastName.$error"
                  error-label="This field is required"
                >
                  <q-input v-model="form.lastName" float-label="Last Name *"/>
                </q-field>
              </div>
              
              <!-- User Name -->
              <div class="col-12 col-md-4">
                <q-field
                  :error="$v.form.email.$error"
                  error-label="This field is required"
                >
                  <q-input autocomplete="false"
                           v-model="form.email"
                           type="text"
                           float-label="User Name *"/>
                </q-field>
              </div>
              
              <!-- Password -->
              
              <div class="col-12 col-md-4">
                <q-field
                
                >
                  <q-input v-model="form.password"
                           :disable="!changePassword"
                           type="password"
                           float-label="Password *"
                           autocomplete="false"/>
                </q-field>
              </div>
              
              <!-- Confirm Password -->
              <div class="col-12 col-md-4">
                <q-field
                
                >
                  <q-input
                    autocomplete="off"
                    :disable="!changePassword"
                    v-model="form.passwordConfirmation"
                    type="password"
                    float-label="Password Confirm *"/>
                </q-field>
              </div>
              
              <!-- Confirm Password -->
              <div class="col-12 col-md-4">
                <q-field
                
                >
                  <q-toggle
                    v-if="id"
                    v-model="changePassword"
                    label="Change Password"/>
                
                </q-field>
              </div>
              
              
              <!-- Roles -->
              <div class="col-12">
                <q-field
                  v-if="roles.length"
                  :disabled="rolesLoading"
                  :error="$v.form.roles.$error"
                  error-label="This field is required"
                >
                  <q-select
                    float-label="Roles *"
                    v-model="form.roles"
                    :options="roles"
                    multiple chips
                    filter
                  />
                </q-field>
              </div>
              
              <!--Activated -->
              <div class="col-12 text-right q-pa-lg">
                <q-toggle v-model="form.activated" label="Enabled"/>
              </div>
            </div>
          </div>
        
        </div>
      </q-collapsible>
    </q-card>
    
    <!-- Extra Fields -->
    <q-card class="q-box no-shadow col-12 ">
      
      <q-card-title class="no-border  q-py-none bg-grey-2">
        <div class="row justify-between">
          <div class="q-subheading text-primary">
            Extra Fields
          </div>
          <q-toggle
            v-model="extraFieldsToggle"
            checked-icon="visibility"
            unchecked-icon="visibility_off"
            style="margin-left: 25px"
          />
        </div>
      
      </q-card-title>
      <q-collapsible header-style="display: none" v-model="extraFieldsToggle">
        
        <div class="row gutter-sm">
          
          <div class="item-form col-12 col-md-3">
            
            <q-field
              error-label="This field must be contain at least 14 numbers"
              :count="14"
              :error="$v.fields.cellularPhone.value.$error"
            >
              <q-input
                type="text"
                v-model="fields.cellularPhone.value"
                @input="fields.cellularPhone.value = $helper.maskPhone(fields.cellularPhone.value)"
                :maxlength="14"
                inputmode="numeric"
                float-label="Cellular Phone"
                :before="[{icon: 'phone'}]"
              />
            
            </q-field>
          </div>
          
          <div class="item-form col-12 col-md-3">
            <q-field
              error-label="This field must be contain at least 14 numbers"
              :count="14"
            
            >
              <q-input
                type="text" v-model="fields.homePhone.value"
                @input="fields.homePhone.value = $helper.maskPhone(fields.homePhone.value)"
                :maxlength="14"
                inputmode="numeric"
                float-label="Home Phone"
                :before="[{icon: 'phone'}]"
              />
            
            </q-field>
          </div>
          
          <div class="item-form col-12 col-md-3">
            <q-field
              error-label="This field must be contain at least 14 numbers"
              :count="14"
            
            >
              <q-input
                :before="[{icon: 'phone'}]" type="text" v-model="fields.workPhone.value"
                @input="fields.workPhone.value = $helper.maskPhone(fields.workPhone.value)"
                :maxlength="14"
                inputmode="numeric"
                float-label="Work Phone"
              />
            
            </q-field>
          </div>
          
          <div class="item-form col-12 col-md-3">
            <q-field
              :error="$v.fields.email.value.$error"
              error-label="Invalid email address"
    
            >
      
              <q-input
                clearable
                v-model="fields.email.value"
                :before="[{icon: 'far fa-envelope'}]"
                float-label="Email:"/>
            </q-field>
  
          </div>
          <div class="item-form col-12 col-md-3">
            <q-field
            >
              <q-datetime class="no-shadow"
                          :before="[{icon: 'cake'}]"
                          v-model="fields.birthday.value"
                          float-label="Birthday"
                          format="MM/DD/YYYY"
                          clearable>
              </q-datetime>
            </q-field>
          </div>
          <div class="item-form col-12 col-md-3" v-if="form.roles.find(item => [10,20,28,32].indexOf(item) > -1)">
            <q-field>
              <q-input
                :before="[{icon: 'fas fa-chart-pie'}]"
                type="number"
                v-model="fields.comission.value"
                :maxlength="14"
                inputmode="numeric"
                float-label="Comission"
              />
            
            </q-field>
          </div>
  
          <div class="item-form col-12 col-md-3">
            <q-select
              :before="[{icon: 'fas fa-language'}]"
              float-label="Language"
              v-model="fields.language.value"
              :options="[
                { label: 'English', value: 1 },
                { label: 'Spanish', value: 2 }
              ]"
              chips
              multiple
            />
          </div>
          
         
        </div>
      
      </q-collapsible>
    </q-card>
    
    <!-- Relations -->
    <q-card class="q-box no-shadow col-12 ">
      
      <q-card-title class="no-border  q-py-none bg-grey-2">
        <div class="row justify-between">
          <div class="q-subheading text-primary">
            Relations
          </div>
          <q-toggle
            v-model="relationsToggle"
            checked-icon="visibility"
            unchecked-icon="visibility_off"
            style="margin-left: 25px"
          />
        </div>
      
      </q-card-title>
      <q-collapsible header-style="display: none" v-model="relationsToggle">
        
        <div class="row gutter-sm">
          
          <!-- Deparments -->
          <div class=" col-12 col-md-4 ">
            <q-field
              :error="$v.form.departments.$error"
              error-label="This field is required"
              
              :disabled="departmentsLoading"
            >
              <div class="caption text-weight-regular text-grey-6 ellipsis">
                Departments
              </div>
              <treeselect
                :multiple="true"
                :append-to-body="true"
                :options="$store.getters['auth/departmentsSelect']"
                value-consists-of="ALL"
                v-model="form.departments"
                placeholder=""
              />
            
            </q-field>
          </div>
          
          <!-- Sources -->
          <div class="col-12 col-md-4">
            <div class="caption text-weight-regular text-grey-6 ellipsis">
              Sources
            </div>
            <treeselect
              :multiple="true"
              :append-to-body="true"
              :options="$store.getters['fhia/sourcesSelect']"
              value-consists-of="ALL_WITH_INDETERMINATE"
              v-model="form.sources"
              placeholder=""
            />
          </div>
          
          <!-- Branch Offices -->
          <div class="col-12 col-md-4">
            <q-field
              :error="$v.form.branchOffices.$error"
              error-label="This field is required"
    
            >
            <q-select
              v-model="form.branchOffices"
              float-label="Branch Office"
              filter multiple chips
              :disable="!$store.getters['fhia/branchOfficeSelect'].length"
              :options="$store.getters['fhia/branchOfficeSelect']"
            />
            </q-field>
          </div>
          
          <!-- Product Groups-->
          <div class="col-12 col-md-4">
            <q-field
              
              error-label="This field is required"
            >
              <q-select
                v-model="fields.products.value"
                float-label="Products"
                filter clearable multiple chips
                :disable="!$store.getters['icommerce/categoriesSelect'].length"
                :options="$store.getters['icommerce/categoriesSelect']"
              />
            </q-field>
          </div>
        </div>
      
      </q-collapsible>
    </q-card>
    
    <!-- Settings -->
    <q-card class="q-box no-shadow col-12 ">
      
      <q-card-title class="no-border q-py-none bg-grey-2">
        <div class="row justify-between ">
          <div class="q-subheading text-primary">
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
      <q-collapsible header-style="display: none" v-model="settingsToggle">
        <div class="row gutter-sm">
          
          <div class="col-12 col-md-8">
            
            <div class="row">
              <div class="q-caption">
                Advanced Settings
              </div>
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
                  <q-tab label="assignedSources" slot="title" name="assignedSources"/>
                  <q-tab label="assignedRoles" slot="title" name="assignedRoles"/>
                  <q-tab label="assignedDepartments" slot="title" name="assignedDepartments"/>
                  
                  <!-- Targets -->
                  <q-tab-pane keep-alive name="list">
                    
                    <q-list link no-border separator>
                      
                      
                      <!-- item assigned sources settings -->
                      <q-item tag="label">
                        <q-item-main>
                          <q-item-tile label>Can Manage sources under following sources</q-item-tile>
                        </q-item-main>
                        <q-item-side right>
                          <q-btn color="primary"
                                 flat round
                                 icon="arrow_forward"
                                 size="sm"
                                 @click="settingTab = 'assignedSources'"/>
                        </q-item-side>
                      </q-item>
                      
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
                      <q-item-separator/>
                    </q-list>
                  
                  </q-tab-pane>
                  <q-tab-pane keep-alive name="assignedSources">
                    <div class="row">
                      
                      <!-- Sources -->
                      <div class="col-12">
                        <div class="caption text-weight-regular text-grey-6 ellipsis">
                          Assigned Sources
                        </div>
                        <treeselect
                          :multiple="true"
                          :append-to-body="true"
                          :options="$store.getters['fhia/sourcesSelect']"
                          value-consists-of="ALL"
                          v-model="settings.assignedSources.value"
                          placeholder=""
                        />
                        <div class="q-py-xs">
                          <q-btn color="primary" rounded flat icon="arrow_back" @click="settingTab = 'list'" size="sm">
                            go back
                          </q-btn>
                        </div>
                      
                      </div>
                    </div>
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
                            float-label="Assigned Roles"
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
                          <div class="caption text-weight-regular text-grey-6 ellipsis">
                            Assigned Departments
                          </div>
                          <treeselect
                            :multiple="true"
                            :append-to-body="true"
                            :options="$store.getters['auth/departmentsSelect']"
                            value-consists-of="ALL"
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
                
                </q-tabs>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="row gutter-xs">
              <div class="q-caption">
                Others
              </div>
              <div class="col-12">
                <q-toggle
                  v-model="settings.showHomePage.value"
                  label="Show Homepage?"
                />
              </div>
              
              <div class="col-12">
                <q-toggle
                  v-model="settings.showAdvancedOrganizer.value"
                  label="Show Advanced Organizer Functions?"
                />
              </div>
  
              <div class="col-12">
                <q-toggle
                  v-model="settings.includeInCollectedJobs.value"
                  label="Include in WAR Queue?"
                />
              </div>
  
              <div class="col-12" v-if="form.roles.find(item => [10,20,32].indexOf(item) > -1)">
                <q-toggle
                  v-model="settings.activeSchedule.value"
                  label="Active Schedule?"
                />
              </div>
            
            </div>
          </div>
        </div>
      </q-collapsible>
    </q-card>
    
    <!-- Permissions -->
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
                  <q-btn size="sm" label="Inherit" :color="getPermissionValue(j+'.'+k) == null ? 'green':''"
                         @click="setPermission(j+'.'+k,null)"/>
                  <q-btn size="sm" label="Deny"
                         :color="getPermissionValue(j+'.'+k) != null && getPermissionValue(j+'.'+k) == false ? 'green':''"
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
    
    
    <!--=== SAVE ===-->
    <div class="col-12 q-px-sm text-center">
      <!-- Activated -->
      <q-btn :loading="loading"
             color="primary"
             @click="submit">
        Save
      </q-btn>
    </div>
    
    <q-inner-loading :visible="loading">
      <q-spinner-hourglass size="50px" color="primary"/>
    </q-inner-loading>
  </div>
</template>
<script>
  /*Services*/
  import profileService from '@imagina/quser/_services/profile/index'
  
  /*Plugins*/
  import {required, email, sameAs, minLength} from 'vuelidate/lib/validators';
  import {alert} from '@imagina/qhelper/_plugins/alert'
  import {helper} from '@imagina/qhelper/_plugins/helper';
  import auth from '../_plugins/auth'
  import _cloneDeep from 'lodash.clonedeep'
  
  
  /*Components*/
  import Treeselect from '@riophae/vue-treeselect';
  import '@riophae/vue-treeselect/dist/vue-treeselect.css';
  
  
  export default {
    props: {},
    components: {Treeselect},
    watch: {
      '$route'(to, from) {
        this.$v.$reset();
        this.form = this.initializeData();
        this.changePassword = this.id ? false : true,
          this.getData();
      }
    },
    validations: {
      form: {
        firstName: {required},
        roles: {required},
        departments: {required},
        branchOffices: {required},
        lastName: {required},
        email: {required},
        
      },
      fields: {
        cellularPhone: {
          value:{
            minLength: minLength(7)
          }
        },
        email: {
          value: {email}
        }
      },
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
        valueConsistsOf: 'BRANCH_PRIORITY',
        id: null,
        form: this.initializeData(),
        loading: false,
        roles: [],
        departments: [],
        dep: [],
        rolesLoading: false,
        departmentsLoading: false,
        generalInfoToggle: true,
        relationsToggle: false,
        extraFieldsToggle: false,
        settingsToggle: false,
        permissionsToggle: false,
        permissionsBackend: '',
        permissionsOptions: [],
        changePassword: this.id ? false : true,
        settings: {
          showHomePage: false,
          showAdvancedOrganizer: false,
          includeInCollectedJobs: false,
          activeSchedule: true,
          assignedSources: [],
          assignedRoles: [],
          assignedDepartments: []
        },
        fields: {
          cellularPhone: {value: ''},
          homePhone: {value: ''},
          workPhone: {value: ''},
          comission: {value: ''},
          language: {value: [1]},
          birthday: {value: ''},
          mainImage: {value: ''},
          email: {value: ''},
          identification: {value: ''},
          contacts: {value: []},
          socialNetworks: {value: []},
          products: {value: []},
        },
        settingTab: 'list'
      }
    },
    methods: {
      
      initializeData() {
        
        profileService.role.getPermissions().then(response => {
          this.permissionsBackend = response.data
          
        });
        
        
        this.id = this.$route.params.id ? this.$route.params.id : null
        this.title = this.$route.params.id ? 'EDIT USER' : 'NEW USER'
        this.roles = []
        this.departments = []
        
        return {
          firstName: '',
          departments: [],
          branchOffices: [],
          permissions: {},
          sources: [],
          email: '',
          lastName: '',
          roles: [],
          activated: true,
          password: '',
          passwordConfirmation: '',
          settings: [],
          fields: []
        }
      },
      getData() {
        this.loading = true;
        
        // initial settings
        let settings = [
          {name: 'showHomePage', value: false},
          {name: 'showAdvancedOrganizer', value: false},
          {name: 'includeInCollectedJobs', value: false},
          {name: 'activeSchedule', value: true},
          {name: 'assignedSources', value: []},
          {name: 'assignedRoles', value: []},
          {name: 'assignedDepartments', value: []}
        ]
        let fields = [
          {name: 'cellularPhone', value: ''},
          {name: 'homePhone', value: ''},
          {name: 'workPhone', value: ''},
          {name: 'comission', value: ''},
          {name: 'language', value: [1]},
          {name: 'birthday', value: ''},
          {name: 'identification', value: ''},
          {name: 'mainImage', value: ''},
          {name: 'email', value: ''},
          {name: 'socialNetworks', value: []},
          {name: 'contacts', value: []},
          {name: 'products', value: []}
        ]
        
        this.settings = helper.convertToFrontField(settings, this.form.settings);
        
        this.fields = helper.convertToFrontField(fields, this.form.fields);
        
        if (this.id) {
          let departments = [];
          let branchOffices = [];
          let sources = [];
          let roles = [];
          profileService.crud.show('api.profile.users', this.id, {params: {include: 'roles,departments,settings,fields,sources,branchOffices'}})
            .then(response => {
              
              
              this.form = _cloneDeep(response.data);
              this.permissionsOptions = []
              
              this.convertPermissions('front');
              
              
              this.form.roles.forEach((element, index) => {
                roles.push(element.id)
              })
              
              this.form.roles = roles;
              this.form.activated == 0 ? this.form.activated = false : this.form.activated = true;
              
              
              this.form.departments.forEach((element, index) => {
                departments.push(element.id)
              })
              this.form.departments = departments;
              
              
              this.form.branchOffices.forEach((element, index) => {
                branchOffices.push(element.id)
              })
              this.form.branchOffices = branchOffices;
              
              
              this.form.sources.forEach((element, index) => {
                sources.push(element.id)
              })
              this.form.sources = sources;
              
              //setting empty passwords
              this.form.password = ''
              this.form.passwordConfirmation = ''
              
              this.settings = helper.convertToFrontField(settings, this.form.settings);
              this.fields = helper.convertToFrontField(fields, this.form.fields);
              this.loading = false;
              
            }).catch(error => {
            this.loading = false;
          })
        } else
          this.loading = false;
        
        this.rolesLoading = true
        profileService.crud.index('api.profile.roles', {params: {filter: {}}}).then(response => {
          this.roles = this.$helper.array.select(response.data);
          this.rolesLoading = false;
        });
        
        this.departmentsLoading = true
        
        profileService.crud.index('api.profile.departments', {params: {filter: {}}}).then(response => {
          this.departments = this.$helper.array.select(response.data)
          this.departmentsLoading = false
        })
      },
      
      changeDepartment() {
        this.form.departments = []
        this.departments.forEach((element, index) => {
          if (this.dep.indexOf(element.id) > -1)
            this.form.departments.push(element);
          
          
        })
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
        
        return permission == undefined ? null : permission.value;
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
                      value: value == undefined ? null : value
                    })
                  
                }
              }
            }
            break;
          
          case 'back':
            this.form.permissions = {}
            this.permissionsOptions.forEach(element => {
              if (element.value != null)
                this.form.permissions[element.label] = element.value
            })
            break;
        }
      },
      
      submit() {
        
        let error = 'Please review fields again.'
        
        //this.$v.$reset();// reseting errors
        this.$v.$touch();//validate all fields from form
        
        if (this.$v.form.departments.$error || this.$v.form.branchOffices.$error)
          this.relationsToggle = true
        
        this.convertPermissions('back');
        
        let data = _cloneDeep(this.form);
        
        //deleting password if is empty
        if (!data.password.length)
          delete data.password;
        
        let passwordRequired = this.id == null && !data.password
        if (passwordRequired) error = 'The password is required'
        
        //deleting passwordConfirmation if is empty
        if (!data.passwordConfirmation.length)
          delete data.passwordConfirmation;
        
        //validate passwords
        let samePasswords = !data.password || data.password == data.passwordConfirmation
        if (!samePasswords) error = 'Password and Confirm Password don\'t match'
        
        let complexity = !data.password || helper.checkPassword(data.password)
        if (!complexity) error = 'The password must be at least 8 characters and contain a at least 1 lowercase character, at least 1 uppercase character and a number.'
        
        if (this.$v.$error)
          error = 'Please, review the fields again.'
        
        if (!this.$v.$error && samePasswords && complexity && !passwordRequired) {
          this.loading = true;
          
          data.settings = helper.convertToBackField(this.settings)
          data.fields = helper.convertToBackField(this.fields)
          if (this.id) {
            
            profileService.crud.update('api.profile.users', data.id, data).then(response => {
              alert.success('User updated', 'top');
              this.loading = false;
              this.$router.push({name: 'user.users.index'})
            }).catch(error => {
              let errorMessage = error ?
                error : 'User not updated';
              alert.error(errorMessage, 'bottom');
              this.loading = false;
            })
          } else {
            profileService.crud.create('api.profile.users', data).then(response => {
              alert.success('User created', 'top')
              this.loading = false;
              this.$router.push({name: 'user.users.index'})
            }).catch(error => {
              this.loading = false;
              let errorMessage = error ? error : 'User not created';
              alert.error(errorMessage, 'bottom')
              
            })
          }
        } else {
          alert.error(error, 'bottom',false,2500)
        }
      }
    }
    
  }
</script>
<style lang="stylus">
  @import "~variables";
  #userForm
    .q-field-bottom
      margin -1px
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
    .form-user-data {
      margin-top 0 !important
      .form-title {
        margin 0 !important
        border none !important
        border-bottom 1px solid $grey-4 !important
      }
    }
</style>
