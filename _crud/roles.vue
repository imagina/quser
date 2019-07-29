<template></template>
<script>
  export default {
    computed: {
      crudData() {
        return {
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
              label: this.$tr('ui.form.name'),
              value: '',
              type: 'text',
              isRequired: true,
            },
            slug: {
              label: this.$tr('ui.form.slug'),
              value: '',
              type: 'text',
              isRequired: true,
            },
            settings : {
              type: 'settings',
              settings: {
                assignedRoles: {
                  description: 'Can manage users with following roles',
                  label: this.$trp('ui.label.role'),
                  value: [],
                  type: 'select',
                  multiple : true,
                  clearable: true,
                  loadOptions: {
                    apiRoute: 'apiRoutes.quser.roles',
                    select: {label: 'name', id: 'id'}
                  }
                },
                assignedDepartments: {
                  description: 'Can manage departments under following departments',
                  label: this.$trp('ui.label.department'),
                  value: [],
                  type: 'select',
                  tree :false,
                  multiple : true,
                  clearable: true,
                  loadOptions: {
                    apiRoute: 'apiRoutes.quser.departments',
                    requestParams: {include: ''}
                  }
                },
                assignedSettings: {
                  description: 'Can manage the following settings',
                  label: this.$trp('ui.label.setting'),
                  value: [],
                  type: 'select',
                  valueConsistsOf : 'LEAF_PRIORITY',
                  multiple : true,
                  clearable: true,
                  loadOptions: {
                    delayed : this.getSettingsOptions(),
                  }
                },
              }
            },
            permissions : {
              type : 'permissions',
              value : {}
            }
          }
        }
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
          })
        })
      }
    }
  }
</script>
