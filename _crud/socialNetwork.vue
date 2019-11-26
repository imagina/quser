<template></template>
<script>
  export default {
    computed: {
      crudData() {
        return {
          field: 'socialNetworks',
          apiRoute: 'apiRoutes.quser.fields',
          permission: 'profile.fields',
          create: {
            title: this.$tr('quser.layout.newSocialNetwork'),
          },
          read: {
            title: this.$trp('ui.label.socialNetwork'),
            icon: 'fas fa-mouse-pointer',
            search: false,
            columns: [
              {
                name: 'type', label: this.$tr('ui.form.socialNetwork'), field: 'type',
                format: val => val || '-', align: 'left'
              },
              {
                name: 'value', label: this.$tr('ui.form.reference'), field: 'value',
                format: val => val || '-', align: 'left'
              },
              {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
            ],
            requestParams: {
              filter: {
                userId: this.$store.state.quserAuth.userId,
                name: 'socialNetworks'
              }
            }
          },
          update: {
            title: this.$tr('quser.layout.updateSocialNetwork'),
            requestParams: {
              filter: {
                userId: this.$store.state.quserAuth.userId,
                name: 'socialNetworks'
              }
            }
          },
          delete: true,
          formLeft: {
            id: {value: null},
            userId: {value: this.$store.state.quserAuth.userId},
            type: {
              name : 'type',
              value: null,
              type: 'select',
              props: {
                label: `${this.$tr('ui.form.socialNetwork')}*`,
                options: [
                  {
                    label: 'Facebook',
                    value: 'Facebook',
                  },
                  {
                    label: 'Google +',
                    value: 'Google+',
                  },
                  {
                    label: 'LinkedIn',
                    value: 'LinkedIn',
                  },
                  {
                    label: 'Twitter',
                    value: 'Twitter',
                  },
                  {
                    label: 'Instagram',
                    value: 'Instagram',
                  },
                  {
                    label: 'Whatsapp',
                    value: 'Whatsapp',
                  }
                ],
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
            value: {
              name : 'value',
              value: null,
              type: 'input',
              props : {
                label: `${this.$tr('ui.form.reference')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              }
            },
          }
        }
      }
    }
  }
</script>
