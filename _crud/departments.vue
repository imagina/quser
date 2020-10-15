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
          apiRoute: 'apiRoutes.quser.departments',
          permission: 'profile.departments',
          create: {
            title: this.$tr('quser.layout.newDepartment'),
          },
          read: {
            filterName: 'quser.admin.departments',
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
              value: '',
              type: 'input',
              props: {
                label: `${this.$tr('ui.form.title')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              },
              validateField : {
                apiRoute: 'apiRoutes.quser.departments',
                crudId : this.crudId,
              }
            },
            parentId: {
              value: 0,
              type: 'select',
              loadOptions: {
                apiRoute: 'apiRoutes.quser.departments',
                requestParams: {include: 'parent'}
              },
              props: {
                label: this.$tr('ui.form.parent'),
                options : [
                  {label: this.$tr('ui.label.disabled'), value: 0},
                ],
              }
            },
          }
        }
      },
      //Crud info
      crudInfo(){
        return this.$store.state.qcrudComponent.component[this.crudId] || {}
      }
    },
  }
</script>
