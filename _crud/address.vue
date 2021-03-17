<template></template>
<script>
export default {
  data() {
    return {
      crudId: this.$uid()
    }
  },
  computed: {
    //Extra fields from setting
    extraFields() {
      return this.$clone(this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::userAddressesExtraFields'))
    },
    crudData() {
      return {
        crudId: this.crudId,
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
              name: 'name', label: this.$tr('ui.form.name'), field: 'firstName',
              align: 'left', format: (val, row) => `${row.firstName} ${row.lastName}`
            },
            {
              name: 'country', label: this.$tr('ui.label.country'), field: 'country',
              format: val => val || '-', align: 'left'
            },
            {
              name: 'state', label: this.$tr('ui.form.province'), field: 'state',
              format: val => val || '-', align: 'left'
            },
            {
              name: 'city', label: this.$tr('ui.form.city'), field: 'city',
              format: val => val || '-', align: 'left'
            },
            {
              name: 'address', label: this.$tr('ui.form.address'), field: 'address1',
              classes: 'ellipsis', style: 'max-width : 250px', format: val => val || '-', align: 'left'
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
          firstName: {
            value: null,
            type: 'input',
            props: {
              label: `${this.$tr('ui.form.firstName')}*`,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            }
          },
          lastName: {
            value: null,
            type: 'input',
            props: {
              label: `${this.$tr('ui.form.lastName')}*`,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            }
          },
          countryId: {
            value: null,
            type: 'select',
            props: {
              label: this.$tr('ui.label.country') + '*',
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qlocations.countries',
              select: {label: 'name', id: 'id'},
            }
          },
          provinceId: {
            value: null,
            type: 'select',
            props: {
              label: this.$tr('ui.label.department') + '*',
              readonly: (this.crudInfo.countryId ? false : true),
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            },
            loadOptions: {
              apiRoute: this.crudInfo.countryId ? 'apiRoutes.qlocations.provinces' : false,
              select: {label: 'name', id: 'id'},
              requestParams: {filter: {country: this.crudInfo.countryId}}
            }
          },
          cityId: {
            value: null,
            type: 'select',
            props: {
              label: this.$tr('ui.form.city') + '*',
              readonly: (this.crudInfo.provinceId ? false : true),
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            },
            loadOptions: {
              apiRoute: this.crudInfo.provinceId ? 'apiRoutes.qlocations.cities' : false,
              select: {label: 'name', id: 'id'},
              requestParams: {filter: {province_id: this.crudInfo.provinceId}}
            }
          },
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
        },
        formRight: {
          telephone: {
            value: null,
            type: 'input',
            props: {
              label: this.$tr('ui.label.phone') + '*',
              mask: 'phone',
              clearable: true,
              unmaskedValue: true,
              rules: [
                val => !val || val.length == 10 || this.$tr('ui.message.fieldMinLeng', {num: 10})
              ]
            }
          },
          documentType: {
            value: null,
            type: 'select',
            isFakeField : true,
            props: {
              label: this.$tr('ui.form.identificationType') + (this.extraFields.documentType.required ? '*' : ''),
              rules: !this.extraFields.documentType.required ? [] :
                [val => !!val || this.$tr('ui.message.fieldRequired')],
              options: this.extraFields.documentType.options.filter(item =>
                this.extraFields.documentType.availableOptions.indexOf(item.value) >= 0
              )
            }
          },
          documentNumber: {
            value: null,
            type: 'input',
            isFakeField : true,
            props: {
              type: 'number',
              label: this.$tr('ui.form.identification') + (this.extraFields.documentType.required ? '*' : ''),
              rules: !this.extraFields.documentType.required ? [] :
                [val => !!val || this.$tr('ui.message.fieldRequired')]
            }
          },
          company: {
            value: null,
            type: 'input',
            props: {
              label: this.$tr('ui.label.company'),
              clearable: true,
            }
          },
          extraInfo: {
            value: '',
            type: 'input',
            isFakeField : true,
            props: {
              label: `${this.$trp('ui.form.comment')}`,
              type: 'textarea',
              rows: "3",
            },
          },
        }
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
  methods: {}
}
</script>
