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
            title: this.$tr('iprofile.cms.newSocialNetwork'),
          },
          read: {
            title: this.$trp('isite.cms.label.socialNetwork'),
            icon: 'fas fa-mouse-pointer',
            search: false,
            columns: [
              {
                name: 'type', label: this.$tr('isite.cms.form.socialNetwork'), field: 'type',
                format: val => val || '-', align: 'left'
              },
              {
                name: 'value', label: this.$tr('isite.cms.form.reference'), field: 'value',
                format: val => val || '-', align: 'left'
              },
              {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
            ],
            requestParams: {
              filter: {
                userId: this.$store.state.quserAuth.userId,
                name: 'socialNetworks'
              }
            }
          },
          update: {
            title: this.$tr('iprofile.cms.updateSocialNetwork'),
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
                label: `${this.$tr('isite.cms.form.socialNetwork')}*`,
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
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
              }
            },
            value: {
              name : 'value',
              value: null,
              type: 'input',
              props : {
                label: `${this.$tr('isite.cms.form.reference')}*`,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
              }
            },
          }
        }
      }
    }
  }
</script>
