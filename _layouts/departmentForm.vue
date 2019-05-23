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
          stack-label="Department Title *:"
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
  import _cloneDeep from 'lodash.clonedeep'

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
      record() {
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
    mounted() {
      this.$nextTick(function () {
        this.$v.form.$reset()
        this.initializeData()
      })
    },
    data() {
      return {
        loading: false,
        departments: [],
        departmentsLoading: false,
        valueConsistsOf: 'BRANCH_PRIORITY',
        settingTab: 'list',
        form: {
          title: '',
          parentId: null,
        }
      }
    },
    methods: {
      initializeData() {
        this.form = JSON.parse(JSON.stringify(this.record))
        this.departmentsLoading = true
        profileService.crud.index('apiRoutes.profile.departments', {}).then(response => {
          this.departments = this.$helper.array.select(response.data)
          this.departmentsLoading = false
        })
      },

      submit() {
        let data = _cloneDeep(this.form);
        this.$v.form.title.$touch()
        let canAssignParentDepartment = false;
        let assignedDepartments = this.$auth.hasSetting('assignedDepartments')
        if (assignedDepartments) {
          assignedDepartments.value.forEach(element => {
            if (data.parentId == element)
              canAssignParentDepartment = true;
            else {
              let departments = this.$store.getters['auth/getDepartmentBy']('parentId', element)
              if (departments.length) {
                let department = departments.find(department => department.id == data.parentId)
                if (department)
                  canAssignParentDepartment = true;
              }
            }
          })
        } else {
          canAssignParentDepartment = true;
        }

        if (!canAssignParentDepartment)
          this.$v.form.parentId.$touch()

        if (!this.$v.form.title.$error && canAssignParentDepartment) {
          this.loading = true;
          data.settings = helper.convertToBackField(this.settings)

          // set null to parent id if is undefined (empty), because undefined values are not included by axios
          if ((data.parentId == null || data.parentId == undefined) && canAssignParentDepartment)
            data.parentId = 0;

          if (data.id) {
            profileService.crud.update('apiRoutes.profile.departments', data.id, data).then(response => {
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
          } else {
            profileService.crud.create('apiRoutes.profile.departments', data).then(response => {
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