<template></template>
<script>
  export default {
    data (){
      return {
        crudId : this.$uid()
      }
    },
    computed: {
      crudData() {
        return {
          crudId : this.crudId,
          apiRoute: 'apiRoutes.quser.roles',
          permission: 'profile.role',
          create: {
            title: this.$tr('quser.layout.newRole'),
          },
          read: {
            columns: [
              {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
              {name: 'name', label: this.$tr('ui.form.name'), field: 'name', align: 'rigth'},
              {name: 'slug', label: this.$tr('ui.form.slug'), field: 'slug', align: 'left'},
              {
                name: 'created_at', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left',
                format: val => val ? this.$trd(val) : '-',
              },
              {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
            ],
            requestParams: {include: ''}
          },
          update: {
            title: this.$tr('quser.layout.updateRole'),
            requestParams: {include: ''}
          },
          delete: true,
          formLeft: {
            id: {value: null},
            userId: {value: this.$store.state.quserAuth.userId},
            name: {
              value: '',
              type: 'input',
              props: {
                label: `${this.$tr('ui.form.name')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              },
              validateField : {
                apiRoute: 'apiRoutes.quser.roles',
                crudId : this.crudId,
                requestParams : {filter : {field : 'name'}}
              }
            },
            slug: {
              value: '',
              type: 'input',
              props: {
                label: `${this.$tr('ui.form.slug')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            settings: {
              type: 'settings',
              settings: {
                assignedRoles: {
                  description: 'Can manage users with following roles',
                  value: [],
                  type: 'select',
                  props : {
                    multiple: true,
                    useChips : true,
                    label: this.$trp('ui.label.role'),
                  },
                  loadOptions: {
                    apiRoute: 'apiRoutes.quser.roles',
                    select: {label: 'name', id: 'id'}
                  }
                },
                assignedDepartments: {
                  description: 'Can manage departments under following departments',
                  value: [],
                  type: 'select',
                  props : {
                    label: this.$trp('ui.label.department'),
                    multiple: true,
                    useChips : true,
                  },
                  loadOptions: {
                    apiRoute: 'apiRoutes.quser.departments',
                    requestParams: {include: ''}
                  }
                },
                assignedSettings: {
                  description: 'Can manage the following settings',
                  value: [],
                  type: 'select',
                  props : {
                    label: this.$trp('ui.label.setting'),
                    multiple: true,
                    useChips : true,
                  },
                  loadOptions: {
                    delayed: this.getSettingsOptions(),
                  }
                },
              }
            },
            permissions: {
              type: 'permissions',
              value: {}
            }
          }
        }
      },
      //Crud info
      crudInfo(){
        return this.$store.state.qcrudComponent.component[this.crudId] || {}
      }
    },
    methods: {
      getSettingsOptions() {
        return new Promise((resolve, reject) => {
          let params = {
            params: {
              filter: {allTranslations: true},
            }
          }

          this.$crud.index('apiRoutes.qsite.settings', params).then(response => {
            let tree = []
            let modules = response.data
            for (const moduleName in modules) {
              let children = []
              let module = modules[moduleName]
              for (const settingName in module) {
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

            resolve(tree)//Response
          }).catch(error => {})
        })
      }
    }
  }
</script>
