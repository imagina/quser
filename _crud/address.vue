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
          title: this.$tr('iprofile.cms.newAddress'),
        },
        read: {
          title: this.$trp('isite.cms.label.address'),
          icon: 'fas fa-map-marker-alt',
          search: false,
          columns: [
            {
              name: 'name', label: this.$tr('isite.cms.form.name'), field: 'firstName',
              align: 'left', format: (val, row) => `${row.firstName} ${row.lastName}`
            },
            {
              name: 'country', label: this.$tr('isite.cms.label.country'), field: 'country',
              format: val => val ? val.name : '-', align: 'left'
            },
            {
              name: 'state', label: this.$tr('isite.cms.form.province'), field: 'state',
              format: val => val || '-', align: 'left'
            },
            {
              name: 'city', label: this.$tr('isite.cms.form.city'), field: 'city',
              format: val => val || '-', align: 'left'
            },
            {
              name: 'address', label: this.$tr('isite.cms.form.address'), field: 'address1',
              classes: 'ellipsis', style: 'max-width : 250px', format: val => val || '-', align: 'left'
            },
            {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
          ],
          requestParams: {filter: {userId: this.$store.state.quserAuth.userId}}
        },
        update: {
          title: this.$tr('iprofile.cms.updateAddress'),
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
              label: `${this.$tr('isite.cms.form.firstName')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          lastName: {
            value: null,
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.lastName')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          countryId: {
            value: null,
            type: 'select',
            props: {
              label: this.$tr('isite.cms.label.country') + '*',
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
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
              label: this.$tr('isite.cms.label.department') + '*',
              readonly: (this.crudInfo.countryId ? false : true),
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
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
              label: this.$tr('isite.cms.form.city') + '*',
              readonly: (this.crudInfo.provinceId ? false : true),
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
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
              label: `${this.$tr('isite.cms.form.address')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
        },
        formRight: {
          telephone: {
            value: null,
            type: 'input',
            props: {
              label: this.$tr('isite.cms.label.phone') + '*',
              mask: 'phone',
              clearable: true,
              unmaskedValue: true,
              rules: [
                val => !val || val.length == 10 || this.$tr('isite.cms.message.fieldMinLeng', {num: 10})
              ]
            }
          },
          documentType: {
            value: null,
            type: 'select',
            isFakeField: true,
            props: {
              label: this.$tr('isite.cms.form.identificationType') + (this.extraFields.documentType && this.extraFields.documentType.required ? '*' : ''),
              rules: !this.extraFields.documentType || !this.extraFields.documentType.required ? [] :
                [val => !!val || this.$tr('isite.cms.message.fieldRequired')],
              options: (this.extraFields.documentType && this.extraFields.documentType.options) ?
                this.extraFields.documentType.options.filter(item => this.extraFields.documentType.availableOptions.indexOf(item.value) >= 0) : []
            }
          },
          documentNumber: {
            value: null,
            type: 'input',
            isFakeField: true,
            props: {
              type: 'number',
              label: this.$tr('isite.cms.form.identification') + (this.extraFields.documentType && this.extraFields.documentType.required ? '*' : ''),
              rules: !this.extraFields.documentType || !this.extraFields.documentType.required ? [] :
                [val => !!val || this.$tr('isite.cms.message.fieldRequired')]
            }
          },
          company: {
            value: null,
            type: 'input',
            props: {
              label: this.$tr('isite.cms.label.company'),
              clearable: true,
            }
          },
          extraInfo: {
            value: '',
            type: 'input',
            isFakeField: true,
            props: {
              label: `${this.$trp('isite.cms.form.comment')}`,
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
