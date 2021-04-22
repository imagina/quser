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
        entityName: config("main.quser.entityNames.department"),
        apiRoute: 'apiRoutes.quser.departments',
        permission: 'profile.departments',
        extraFormFields: 'Iprofile.crud-fields.departments',
        create: {
          title: this.$tr('quser.layout.newDepartment'),
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'title', label: this.$tr('ui.form.title'), field: 'title', align: 'rigth'},
            {
              name: 'parent', label: this.$tr('ui.form.parent'), field: 'parent', align: 'left',
              format: val => val ? (val.title ? val.title : '-') : '-'
            },
            {
              name: 'internal', label: this.$tr('ui.form.type'), field: 'internal', align: 'left',
              format: val => val ? this.$tr('ui.label.internal') : this.$tr('ui.label.external')
            },
            {
              name: 'created_at', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
          ],
          requestParams: {include: 'parent'},
          filters: {
            internal: {
              value: null,
              type: 'select',
              props: {
                label: this.$tr('ui.form.type'),
                clearable: true,
                options: [
                  {label: this.$tr('ui.label.internal'), value: 1},
                  {label: this.$tr('ui.label.external'), value: 0},
                ],
              }
            },
            parentId: {
              value: null,
              type: 'treeSelect',
              loadOptions: {
                apiRoute: 'apiRoutes.quser.departments',
                requestParams: {include: 'parent'}
              },
              props: {
                label: this.$tr('ui.form.parent'),
                clearable : true
              }
            },
          }
        },
        update: {
          title: this.$tr('quser.layout.updateDepartment'),
          requestParams: {include: 'parent'}
        },
        delete: true,
        formLeft: {
          id: {value: ''},
          userId: {value: this.$store.state.quserAuth.userId},
          title: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('ui.form.title')}*`,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            },
            validateField: {
              apiRoute: 'apiRoutes.quser.departments',
              crudId: this.crudId,
            }
          },
          internal: {
            value: 1,
            type: 'select',
            props: {
              label: this.$tr('ui.form.type'),
              options: [
                {label: this.$tr('ui.label.internal'), value: 1},
                {label: this.$tr('ui.label.external'), value: 0},
              ],
            }
          },
          parentId: {
            value: null,
            type: 'treeSelect',
            loadOptions: {
              apiRoute: 'apiRoutes.quser.departments',
              requestParams: {include: 'parent'}
            },
            props: {
              label: this.$tr('ui.form.parent'),
              clearable : true
            }
          },
        }
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
}
</script>
