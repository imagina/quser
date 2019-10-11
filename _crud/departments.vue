<template></template>
<script>
  export default {
    computed: {
      crudData() {
        return {
          apiRoute: 'apiRoutes.quser.departments',
          permission: 'profile.departments',
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
                name: 'created_at', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left',
                format: val => val ? this.$trd(val) : '-',
              },
              {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
            ],
            requestParams: {include: 'parent'}
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
              label: `${this.$tr('ui.form.title')}*`,
              value: '',
              type: 'text',
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            },
            parentId: {
              label: this.$tr('ui.form.parent'),
              value: 0,
              type: 'select',
              clearable: true,
              loadOptions: {
                apiRoute: 'apiRoutes.quser.departments',
                requestParams: {include: 'parent'}
              }
            },
          }
        }
      }
    },
  }
</script>
