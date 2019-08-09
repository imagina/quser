<template></template>
<script>
  export default {
    computed: {
      crudData() {
        return {
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
              label: this.$tr('ui.form.address'),
              value: null,
              type: 'text',
              isRequired: true,
            },
            city: {
              label: this.$tr('ui.form.city'),
              value: null,
              type: 'text',
              isRequired: true,
            },
            state: {
              label: this.$tr('ui.form.state'),
              value: null,
              type: 'text',
              isRequired: true,
            },
            zipCode: {
              label: this.$tr('ui.form.zipCode'),
              value: null,
              type: 'text',
            },
          }
        }
      }
    },
    methods: {}
  }
</script>
