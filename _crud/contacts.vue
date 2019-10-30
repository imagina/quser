<template></template>
<script>
  export default {
    computed: {
      crudData() {
        return {
          field : 'contacts',
          apiRoute: 'apiRoutes.quser.fields',
          permission: 'profile.fields',
          create: {
            title: this.$tr('quser.layout.newContact'),
          },
          read: {
            title: this.$trp('ui.label.contact'),
            icon: 'fas fa-users',
            search: false,
            columns: [
              {
                name: 'firstName', label: this.$tr('ui.form.firstName'), field: 'first_name',
                format: val => val || '-', align: 'left'
              },
              {
                name: 'lastName', label: this.$tr('ui.form.lastName'), field: 'last_name',
                format: val => val || '-', align: 'left'
              },
              {
                name: 'phone', label: this.$tr('ui.form.phone'), field: 'phone',
                format: val => this.$helper.maskPhone(val.toString()) || '-', align: 'left'
              },
              {
                name: 'email', label: this.$tr('ui.form.email'), field: 'email',
                format: val => val || '-', align: 'left'
              },
              {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
            ],
            requestParams: {
              filter: {
                userId: this.$store.state.quserAuth.userId,
                name: 'contacts'
              }
            }
          },
          update: {
            title: this.$tr('quser.layout.updateContact'),
            requestParams: {
              filter: {
                userId: this.$store.state.quserAuth.userId,
                name: 'contacts'
              }
            }
          },
          delete: true,
          formLeft: {
            id: {value: null},
            userId: {value: this.$store.state.quserAuth.userId},
            firstName: {
              name :'first_name',
              label: `${this.$tr('ui.form.firstName')}*`,
              value: null,
              type: 'text',
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            },
            lastName: {
              name :'last_name',
              label: `${this.$tr('ui.form.lastName')}*`,
              value: null,
              type: 'text',
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            },
            phone: {
              label: `${this.$tr('ui.form.phone')}*`,
              value: null,
              type: 'phone',
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired'),
                val => !val || val.length == 10 || this.$tr('ui.message.fieldMinLeng',{num : 10})
              ],
            },
            email: {
              label: `${this.$tr('ui.form.email')}*`,
              value: null,
              type: 'email',
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired'),
                val => this.$helper.validateEmail(val) || this.$tr('ui.message.fieldEmail')
              ],
            },
          }
        }
      }
    },
    methods: {}
  }
</script>
