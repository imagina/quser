<template></template>
<script>
  export default {
    computed: {
      crudData() {
        return {
          crudId : this.$uid(),
          apiRoute: 'apiRoutes.quser.addresses',
          permission: 'profile.addresses',
          create: {
            title: this.$tr('quser.layout.newAddress'),
          },
          read: {
            title: this.$trp('ui.label.address'),
            icon: 'fas fa-map-marker-alt',
            search: false,
            columns: [
              {
                name: 'address', label: this.$tr('ui.form.address'), field: 'address1',
                format: val => val || '-', align: 'left'
              },
              {
                name: 'city', label: this.$tr('ui.form.city'), field: 'city',
                format: val => val || '-', align: 'left'
              },
              {
                name: 'state', label: this.$tr('ui.form.state'), field: 'state',
                format: val => val || '-', align: 'left'
              },
              {
                name: 'zipCode', label: this.$tr('ui.form.zipCode'), field: 'zipCode',
                format: val => val || '-', align: 'left'
              },
              {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
            ],
            requestParams: {filter: {userId: this.$store.state.quserAuth.userId}}
          },
          update: {
            title: this.$tr('quser.layout.updateAddress'),
            requestParams: {include: ''}
          },
          delete: true,
          formLeft: {
            id: {value: null},
            userId: {value: this.$store.state.quserAuth.userId},
            address1: {
              value: null,
              type: 'input',
              props: {
                label: `${this.$tr('ui.form.address')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            city: {
              value: null,
              type: 'input',
              props: {
                label: `${this.$tr('ui.form.city')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            state: {
              value: null,
              type: 'input',
              props: {
                label: `${this.$tr('ui.form.state')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            zipCode: {
              value: null,
              type: 'input',
              props: {
                label: this.$tr('ui.form.zipCode'),
              }
            },
          }
        }
      }
    },
    methods: {}
  }
</script>
