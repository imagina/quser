<template>
  <div id="userForm"
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
        
          <div class="col-12 ">
            <div class="row gutter-xs">
              <!-- First Name -->
              <div class=" col-12 col-md-4 ">
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
              <div class=" col-12 col-md-4">
                <q-field
                  :error="$v.form.lastName.$error"
                  error-label="This field is required"
                >
                  <q-input v-model="form.lastName" float-label="Last Name *"/>
                </q-field>
              </div>
            
              <!-- User Name -->
              <div class=" col-12 col-md-4">
                <q-field
                  :error="$v.form.email.$error"
                  error-label="This field is required"
                >
                  <q-input v-model="form.email" type="text" float-label="User Name *"/>
                </q-field>
              </div>
            
              <!-- Password -->
              <div class=" col-12 col-md-4">
                <q-field
                  :error="$v.form.password.$error"
                  error-label="This field must have 7 seven characters"
                >
                  <q-input v-model="form.password" type="password" float-label="Password *"/>
                </q-field>
              </div>
            
              <!-- Confirm Password -->
              <div class=" col-12 col-md-4">
                <q-field
                  :error="$v.form.passwordConfirmation.$error"
                  error-label="This field is required"
                >
                  <q-input v-model="form.passwordConfirmation" type="password" float-label="Password Confirm *"/>
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
                  />
                </q-field>
              </div>
            
              <!--Activated -->
              <div class="col-12 text-right q-pa-lg">
                <q-toggle v-model="form.activated" label="Enabled" />
              </div>
            </div>
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
          <!-- Sources -->
          <div class="col-12 col-md-4">
            <div class="caption text-weight-regular text-grey-6 ellipsis">
             Sources
            </div>
            <treeselect
              :multiple="true"
              :append-to-body="true"
              :options="$store.getters['fhia/sourcesSelect']"
              :value-consists-of="valueConsistsOf"
              v-model="form.sources"
              placeholder=""
            />
          </div>
        
        
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
                :value-consists-of="valueConsistsOf"
                v-model="form.departments"
                placeholder=""
              />
              
            </q-field>
          </div>
        
        
          <!-- Branch Offices -->
          <div class="col-12 col-md-4">
          
            <q-select
              v-model="form.branchOffices"
              float-label="Branch Office"
              filter multiple chips
              :disable="!$store.getters['fhia/branchOfficeSelect'].length"
              :options="$store.getters['fhia/branchOfficeSelect']"
            />
        
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
                <q-tab label="list" slot="title" default name="list" />
                <q-tab label="assignedSources" slot="title" name="assignedSources" />
                <q-tab label="assignedRoles" slot="title" name="assignedRoles" />
                <q-tab label="assignedDepartments" slot="title" name="assignedDepartments" />
    
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
                               @click="settingTab = 'assignedSources'" />
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
                               @click="settingTab = 'assignedRoles'" />
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
                               @click="settingTab = 'assignedDepartments'" />
                      </q-item-side>
                    </q-item>
                    <q-item-separator />
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
                        :value-consists-of="valueConsistsOf"
                        v-model="settings.assignedSources.value"
                        placeholder=""
                      />
                      <div class="q-py-xs">
                        <q-btn color="primary" rounded flat icon="arrow_back" @click="settingTab = 'list'" size="sm" >
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
                        <q-btn color="primary" rounded flat icon="arrow_back" @click="settingTab = 'list'" size="sm" >
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
                          :value-consists-of="valueConsistsOf"
                          v-model="settings.assignedDepartments.value"
                          placeholder=""
                        />
                      </q-field>
                      <div class="q-py-xs">
                        <q-btn color="primary" rounded flat icon="arrow_back" @click="settingTab = 'list'" size="sm" >
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
              label="Show Homepage"
            />
          </div>
  
          <div class="col-12">
            <q-toggle
              v-model="settings.showAdvancedOrganizerFunctions.value"
              label="Show Advanced Organizer Functions"
            />
          </div>
  
          <div class="col-12">
            <q-toggle
              v-model="settings.includeInCollectedJobs.value"
              label="Include in Collected Jobs"
            />
          </div>
          
        </div>
        </div>
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
  
  
  /*Components*/
  import Treeselect from '@riophae/vue-treeselect';
  import '@riophae/vue-treeselect/dist/vue-treeselect.css';


  export default {
    props: {},
    components: {Treeselect},
    watch: {
      '$route'(to, from) {
        this.form = this.initializeData();
        this.getData();
      }
    },
    validations: {
      form: {
        firstName: {required},
        roles: {required},
        departments: {required},
        lastName: {required},
        password: {
          minLength: minLength(7)
        },
        passwordConfirmation: {

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
        valueConsistsOf: 'BRANCH_PRIORITY',
        id: null,
        form: this.initializeData(),
        loading: false,
        roles: [],
        departments: [],
        dep: [],
        rolesLoading: false,
        departmentsLoading: false,
        generalInfoToggle:true,
        relationsToggle:false,
        settingsToggle:false,
        settings: {
          showHomePage: false,
          showAdvancedOrganizerFunctions: false,
          includeInCollectedJobs: false,
          assignedSources:[],
          assignedRoles:[],
          assignedDepartments:[]
        },
        settingTab:'list'
      }
    },
    methods: {
      initializeData() {
        this.id = this.$route.params.id ? this.$route.params.id : null
        this.title = this.$route.params.id ? 'EDIT USER' : 'NEW USER'
        this.roles = []
        this.departments = []
        
        return {
          firstName: '',
          departments: [],
          branchOffices:[],
          sources:[],
          email: '',
          lastName: '',
          roles: [],
          activated: true
        }
      },
      getData() {
        this.loading = true;
  
        // initial settings
        let settings = [
          {name: 'showHomePage', value: false},
          {name: 'showAdvancedOrganizerFunctions', value: false},
          {name: 'includeInCollectedJobs', value: false},
          {name: 'assignedSources', value: []},
          {name: 'assignedRoles', value: []},
          {name: 'assignedDepartments', value: []}
        ]
        this.settings = helper.convertToFrontField(settings, this.form.settings);
        
        if (this.id) {
          let departments = [];
          let branchOffices = [];
          let sources = [];
          let roles = [];
          profileService.crud.show('profile.users',this.id,{params:{include:'roles,departments,settings,sources,branchOffices'}}).then(response => {
        
            this.form = response.data;
          
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
  
          this.settings = helper.convertToFrontField(settings, this.form.settings);
          this.loading = false;
          
          }).catch(error => {
            let errorMessage = error.response.data.error ? error.response.data.error : 'Profile not Found';
            alert.error(errorMessage, 'bottom')
            this.loading = false;
          })
        } else
          this.loading = false;

        this.rolesLoading = true
        profileService.crud.index('profile.roles',{params:{filter:{}}}).then(response => {
          this.roles = this.$helper.array.select(response.data);
          this.rolesLoading = false;
        });

        this.departmentsLoading = true
       
        profileService.crud.index('profile.departments',{params:{filter:{}}}).then(response => {
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
      submit() {
        this.$v.$touch();//validate all fields from form
        if (this.$v.form.departments.$error)
          this.relationsToggle = true
        
        if (!this.$v.$error) {
          this.loading = true;
          let data = JSON.parse(JSON.stringify(this.form));
          data.settings = helper.convertToBackField(this.settings)
 
          if (this.id) {
            
            profileService.crud.update('profile.users',data.id,data).then(response => {
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
            profileService.crud.create('profile.users',data).then(response => {
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
          alert.error('Please review fields again.', 'bottom')
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
