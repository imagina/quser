<template></template>
<script>
  export default {
    computed: {
      crudData() {
        return {
          crudId : this.$uid(),
          field : 'contacts',
          apiRoute: 'apiRoutes.quser.fields',
          permission: 'profile.fields',
          create: {
            title: this.$tr('iprofile.cms.newContact'),
          },
          read: {
            title: this.$trp('isite.cms.label.contact'),
            icon: 'fas fa-users',
            search: false,
            columns: [
              {
                name: 'firstName', label: this.$tr('isite.cms.form.firstName'), field: 'first_name',
                format: val => val || '-', align: 'left'
              },
              {
                name: 'lastName', label: this.$tr('isite.cms.form.lastName'), field: 'last_name',
                format: val => val || '-', align: 'left'
              },
              {
                name: 'phone', label: this.$tr('isite.cms.form.phone'), field: 'phone',
                format: val => this.$helper.maskPhone(val.toString()) || '-', align: 'left'
              },
              {
                name: 'email', label: this.$tr('isite.cms.form.email'), field: 'email',
                format: val => val || '-', align: 'left'
              },
              {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
            ],
            requestParams: {
              filter: {
                userId: this.$store.state.quserAuth.userId,
                name: 'contacts'
              }
            }
          },
          update: {
            title: this.$tr('iprofile.cms.updateContact'),
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
              name : 'first_name',
              value: null,
              type: 'input',
              props : {
                label: `${this.$tr('isite.cms.form.firstName')}*`,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
              }
            },
            lastName: {
              name : 'last_name',
              value: null,
              type: 'input',
              props : {
                label: `${this.$tr('isite.cms.form.lastName')}*`,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
              }
            },
            phone: {
              value: null,
              type: 'input',
              props : {
                label: `${this.$tr('isite.cms.form.phone')}*`,
                mask:'phone',
                unmaskedValue : true,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired'),
                  val => !val || val.length == 10 || this.$tr('isite.cms.message.fieldMinLeng',{num : 10})
                ],
              }
            },
            email: {
              value: null,
              type: 'input',
              props : {
                label: `${this.$tr('isite.cms.form.email')}*`,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired'),
                  val => this.$helper.validateEmail(val) || this.$tr('isite.cms.message.fieldEmail')
                ],
              }
            },
          }
        }
      }
    },
    methods: {}
  }
</script>
