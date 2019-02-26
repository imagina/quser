<template>
  <div id="departmentForm"
       class="q-layout-page row justify-center layout-padding">
    
    
    <div class="col-12">
      <q-field
        :error="$v.form.title.$error"
        error-label="This field is required"
      >
        
        <q-input
          
          type="text"
          v-model="form.title"
          float-label="Department Title *:"
  
        />
      </q-field>
    </div>
    <div class="col-12">
      <div class="q-body-1 text-weight-regular text-grey-6 ellipsis">
        Parent Department:
      </div>
    
      <q-field
        :error="$v.form.parentId.$error"
        error-label="This field is required"
      >
  
        <treeselect
          :options="$store.getters['auth/departmentsSelect']"
          :value-consists-of="valueConsistsOf"
          :disable="!$store.getters['auth/departmentsSelect'].length"
          v-model="form.parentId"
          placeholder=""
        />
      </q-field>
    </div>
  
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
    
      <q-collapsible header-style="display: none" v-model="settingsToggle">
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
                
 

                
                  <!-- item assigned product groups categories settings -->
                  <q-item tag="label">
                    <q-item-main>
                      <q-item-tile label>Can see only the following products categories</q-item-tile>
                    </q-item-main>
                    <q-item-side right>
                      <q-btn color="primary"
                             flat round
                             icon="arrow_forward"
                             size="sm"
                             @click="settingTab = 'assignedProductGroupsCategories'" />
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
                      value-consists-of="ALL"
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
              <q-tab-pane keep-alive name="assignedProductGroupsCategories">
                <div class="row">
                
                  <!-- product groups categories -->
                  <div class=" col-12">
                  
                    <q-select
                      float-label="Product *:"
                      filter clearable
                      v-model="settings.assignedProductGroupsCategories.value"
                      :disable="!$store.getters['icommerce/categoriesSelect'].length"
                      :options="$store.getters['icommerce/categoriesSelect']"
                      multiple chips
                    />
                  
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
      </q-collapsible>
    </q-card>
    <!--=== SAVE ===-->
    <div class="col-12 text-center q-my-md">
      <q-btn :loading="loading"
             color="primary"
             @click="submit">
        Save
      </q-btn>
    
    
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
    record(){
      this.$v.form.$reset()

      this.initializeData()
     
    }
  },
  validations: {
    form: {
      title: {
        required
      },
      parentId: {
        required
      }
    }
  },
  mounted(){
    this.$nextTick(function () {
      this.$v.form.$reset()
      
  
      this.initializeData()
    })
  },
  data(){
    return {
      settingsToggle:false,
      loading: false,
      departments: [],
      departmentsLoading: false,
      valueConsistsOf: 'BRANCH_PRIORITY',
      settingTab:'list',
      form: {
        title: '',
        parentId: null,
        settings:{
          assignedSources:{}
        }
      },
      settings:{
        assignedSources:[],
        assignedProductGroupsCategories:[]
      }
    }
  },
  methods: {
    initializeData(){
      
      this.form = JSON.parse(JSON.stringify(this.record))

      let settings = [
        {name: 'assignedSources', value: []},
        {name: 'assignedProductGroupsCategories', value: []}
      ]
      
      this.settings = helper.convertToFrontField(settings, this.form.settings);
      
      this.preleadForms = config('app.preleadForms')
      
      this.departmentsLoading = true
    
      profileService.crud.index('profile.departments',{}).then(response => {
        this.departments = this.$helper.array.select(response.data)
      this.departmentsLoading = false
    })
    
    },
    

    
    submit(){
      this.$v.form.title.$touch()
      
      let canAssignParentDepartment = false;
      let assignedDepartments = this.$auth.hasSetting('assignedDepartments')
      if(assignedDepartments){
        assignedDepartments.value.forEach(element => {
          if(this.form.parentId == element)
            canAssignParentDepartment = true;
          else{
            let departments = this.$store.getters['auth/getDepartmentBy']('parentId',element)
            if(departments.length){
              let department = departments.find(department => department.id == this.form.parentId)
              if(department)
                canAssignParentDepartment = true;
            }
          }
        })
      }else{
        canAssignParentDepartment = true;
      }
    

      if(!canAssignParentDepartment)
        this.$v.form.parentId.$touch()
      
      if (!this.$v.form.title.$error && canAssignParentDepartment) {
        this.loading = true;
        this.form.settings = helper.convertToBackField(this.settings)
        
        // set null to parent id if is undefined (empty), because undefined values are not included by axios
        if(this.form.parentId == undefined && canAssignParentDepartment)
          this.form.parentId = null;
        
        if(this.form.id) {
          profileService.crud.update('profile.departments', this.form.id, this.form).then(response => {
            this.loading = false;
            this.$emit("clearCache")
            this.$emit("getRecords")
            this.$emit("closeModal")
            alert.success("Department Updated", 'top');
          }).catch(error => {
            let errorMessage = error ?
              error : 'Department not updated';
            this.$emit("closeModal")
            alert.error(errorMessage, 'bottom');
            this.loading = false;
          })
        }else{
          profileService.crud.create('profile.departments', this.form).then(response => {
            this.loading = false;
            this.$emit("clearCache")
            this.$emit("getRecords")
            this.$emit("closeModal")
            alert.success("Department Created", 'top');
          }).catch(error => {
            let errorMessage = error ?
              error : 'Department not created';
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
  #departmentForm
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
    .q-field-bottom
      margin -1px
    
</style>