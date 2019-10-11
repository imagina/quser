<template></template>
<script>
  export default {
    computed: {
      crudData () {
        return {
          field: 'socialNetworks',
          apiRoute: 'apiRoutes.quser.fields',
          permission: 'profile.fields',
          create: {
            title: this.$tr('quser.layout.newSocialNetwork'),
          },
          read: {
            title: this.$trp('ui.label.sociaNetwork'),
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
              { name: 'actions', label: this.$tr('ui.form.actions'), align: 'left' },
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
            id: { value: null },
            userId: { value: this.$store.state.quserAuth.userId },
            type: {
              label: `${this.$tr('ui.form.socialNetwork')}*`,
              value: null,
              type: 'select',
              options: [
                {
                  label: 'Facebook',
                  id: 'Facebook',
                },
                {
                  label: 'Google +',
                  id: 'Google+',
                },
                {
                  label: 'LinkedIn',
                  id: 'LinkedIn',
                },
                {
                  label: 'Twitter',
                  id: 'Twitter',
                },
                {
                  label: 'Instagram',
                  id: 'Instagram',
                },
                {
                  label: 'Whatsapp',
                  id: 'Whatsapp',
                }
              ],
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            },
            value: {
              label: `${this.$tr('ui.form.reference')}*`,
              value: null,
              type: 'text',
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            },
          }
        }
      }
    },
    methods: {}
  }
</script>
