<template></template>
<script>
export default {
  data() {
    return {
      crudId: this.$uid()
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.quser.entityNames.role"),
        apiRoute: 'apiRoutes.quser.roles',
        permission: 'profile.role',
        extraFormFields: 'Iprofile.crud-fields.roles',
        create: {
          title: this.$tr('quser.layout.newRole'),
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'name', label: this.$tr('ui.form.name'), field: 'name', align: 'rigth'},
            {name: 'slug', label: this.$tr('ui.form.slug'), field: 'slug', align: 'left'},
            {
              name: 'workSpace', label: this.$tr('ui.label.workSpace'), field: 'settings',
              align: 'left', format: val => val.workSpace || '-'
            },
            {
              name: 'form', label: this.$tr('ui.label.form'), field: 'form',
              align: 'left', format: val => val ? val.title : '-'
            },
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
            validateField: {
              apiRoute: 'apiRoutes.quser.roles',
              crudId: this.crudId,
              requestParams: {filter: {field: 'name'}}
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
          formId: {
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('@imagina/qform/_crud/crudForms'),
              crudProps: {
                label: `${this.$tr('ui.label.form')}`,
              },
              config: {
                options: {
                  label: 'title', value: 'id'
                }
              },
            },
          },
          permissions: {
            type: 'permissions',
            value: {}
          }
        },
        formRight: {
          assignedRoles: {
            value: [],
            type: 'select',
            fakeFieldName: 'settings',
            props: {
              label: 'Can manage users with following roles',
              multiple: true,
              useChips: true,
            },
            loadOptions: {
              apiRoute: 'apiRoutes.quser.roles',
              select: {label: 'name', id: 'id'}
            }
          },
          assignedDepartments: {
            value: [],
            type: 'select',
            fakeFieldName: 'settings',
            props: {
              label: 'Can manage departments under following departments',
              multiple: true,
              useChips: true,
            },
            loadOptions: {
              apiRoute: 'apiRoutes.quser.departments',
              requestParams: {include: ''}
            }
          },
          incognitoProfile: {
            value: '0',
            type: 'select',
            fakeFieldName: 'settings',
            props: {
              label: this.$tr('quser.layout.label.incognitoProfile'),
              options: [
                {label: this.$tr('ui.label.yes'), value: 1},
                {label: this.$tr('ui.label.no'), value: 0},
              ]
            }
          },
          workSpace: {
            value: 'iadmin',
            type: 'select',
            fakeFieldName: 'settings',
            props: {
              label: this.$tr('ui.label.workSpace'),
              options: [
                {label: 'Iadmin', value: 'iadmin'},
                {label: 'Ipanel', value: 'ipanel'},
              ]
            }
          }
        }
      }
    },
    //Crud info
    crudInfo() {
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
        }).catch(error => {
        })
      })
    }
  }
}
</script>
