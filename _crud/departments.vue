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
          title: this.$tr('iprofile.cms.newDepartment'),
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'title', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'rigth'},
            {
              name: 'parent', label: this.$tr('isite.cms.form.parent'), field: 'parent', align: 'left',
              format: val => val ? (val.title ? val.title : '-') : '-'
            },
            {
              name: 'isInternal', label: this.$tr('isite.cms.form.type'), field: 'isInternal', align: 'left',
              format: val => val ? this.$tr('isite.cms.label.internal') : this.$tr('isite.cms.label.external')
            },
            {
              name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
          ],
          requestParams: {include: 'parent'},
          filters: {
            isInternal: {
              value: null,
              type: 'select',
              props: {
                label: this.$tr('isite.cms.form.type'),
                clearable: true,
                options: [
                  {label: this.$tr('isite.cms.label.internal'), value: 1},
                  {label: this.$tr('isite.cms.label.external'), value: 0},
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
                label: this.$tr('isite.cms.form.parent'),
                clearable : true
              }
            },
          }
        },
        update: {
          title: this.$tr('iprofile.cms.updateDepartment'),
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
              label: `${this.$tr('isite.cms.form.title')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
            validateField: {
              apiRoute: 'apiRoutes.quser.departments',
              crudId: this.crudId,
            }
          },
          isInternal: {
            value: 1,
            type: 'select',
            props: {
              label: this.$tr('isite.cms.form.type'),
              options: [
                {label: this.$tr('isite.cms.label.internal'), value: 1},
                {label: this.$tr('isite.cms.label.external'), value: 0},
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
              label: this.$tr('isite.cms.form.parent'),
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
