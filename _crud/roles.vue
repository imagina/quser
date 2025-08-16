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
        //permission: 'iuser.role',
        extraFormFields: 'Iprofile.crud-fields.roles',
        create: {
          title: this.$tr('iprofile.cms.newRole'),
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'title', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'rigth'},
            {
              name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
          ],
          requestParams: {include: 'translations'}
        },
        update: {
          title: this.$tr('iprofile.cms.updateRole'),
          requestParams: {include: 'translations'}
        },
        delete: true,
        formLeft: {
          id: {value: null},
          userId: {value: this.$store.state.quserAuth.userId},
          title: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.title')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
            validateField: {
              apiRoute: 'apiRoutes.quser.roles',
              crudId: this.crudId,
              requestParams: {filter: {field: 'title'}}
            }
          },
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
              requestParams: {include: 'translations'},
              select: {label: 'title', id: 'id'}
            }
          },
          
          incognitoProfile: {
            value: 0,
            type: 'select',
            fakeFieldName: 'settings',
            props: {
              label: this.$tr('iprofile.cms.label.incognitoProfile'),
              options: [
                {label: this.$tr('isite.cms.label.yes'), value: 1},
                {label: this.$tr('isite.cms.label.no'), value: 0},
              ]
            }
          },
                    
          permissions: {
            type: 'permissions',
            value: {}
          }
        },
        //formRight: {}
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
          this.$apiResponse.handleError(error, () => {})
        })
      })
    }
  }
}
</script>
