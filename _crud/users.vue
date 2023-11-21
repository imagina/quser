<template></template>
<script>
export default {
  data() {
    return {
      crudId: this.$uid()
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.quser.entityNames.user"),
        apiRoute: 'apiRoutes.quser.users',
        permission: 'profile.user',
        extraFormFields: 'Iprofile.crud-fields.users',
        create: {
          title: this.$tr('iprofile.cms.newUser'),
        },
        read: {
          requestParams: {include: 'roles,departments'},
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id'},
            {
              name: 'first_name', label: this.$tr('isite.cms.form.name'), field: 'fullName',
              align: 'left', sortable: true
            },
            {
              name: 'email', label: this.$tr('isite.cms.form.email'),
              field: 'email', align: 'left', sortable: true
            },
            {
              name: 'userName', label: this.$trp('isite.cms.form.userName'),
              field: 'userName', align: 'left', sortable: true, vIf: this.customLogin
            },
            {
              name: 'isActivated', label: this.$tr('isite.cms.form.status'), field: 'isActivated',
              asStatus: true
            },
            {
              name: 'roles', label: this.$trp('isite.cms.label.role'), field: 'roles',
              align: 'left', classes: 'ellipsis', style: 'max-width : 250px',
              format: val => val ? val.map(item => {
                return item.name
              }).join(', ') : ''
            },
            {
              name: 'departments', label: this.$trp('iprofile.cms.label.userGroup'), field: 'departments',
              align: 'left', classes: 'ellipsis', style: 'max-width : 250px',
              format: val => val ? val.map(item => {
                return item.title
              }).join(', ') : ''
            },
            {
              name: 'last_loging', label: this.$tr('iprofile.cms.form.lastLogin'), field: 'lastLoginDate',
              align: 'left', format: val => val ? this.$trd(val) : '-',
            },
            {
              name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {
              name: 'updated_at', label: this.$tr('isite.cms.form.updatedAt'), field: 'updatedAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
          ].filter(item => item.vIf != undefined ? item.vIf : true),
          filters: {
            roleId: {
              value: null,
              type: 'select',
              loadOptions: {
                apiRoute: 'apiRoutes.quser.roles',
                select: {label: 'name', id: 'id'}
              },
              props: {
                label: `${this.$tr('isite.cms.label.role')}:`,
                clearable: true
              }
            },
            departmentId: {
              value: null,
              tree: false,
              type: 'select',
              loadOptions: {
                apiRoute: 'apiRoutes.quser.departments'
              },
              props: {
                label: `${this.$tr('isite.cms.label.department')}:`,
                clearable: true
              }
            },
            isActivated: {
              value: null,
              type: 'select',
              props: {
                label: `${this.$tr('isite.cms.form.status')}:`,
                options: [
                  {label: this.$tr('isite.cms.label.enabled'), value: '1'},
                  {label: this.$tr('isite.cms.label.disabled'), value: '0'},
                ],
                clearable: true
              }
            },
          }
        },
        update: {
          title: this.$tr('iprofile.cms.updateUser'),
          requestParams: {include: 'roles,departments,settings'}
        },
        delete: false,
        formLeft: {
          id: {value: null},
          userId: {value: this.$store.state.quserAuth.userId},
          mediasSingle: {
            value: {},
            type: 'media',
            props: {
              label: this.$tr('isite.cms.label.mainImage'),
              accept: 'images',
              directUpload: true,
              multiple: false,
              zone: 'profile',
              entity: "Modules\\User\\Entities\\Sentinel\\User",
              entityId: {value: this.$store.state.quserAuth.userId}
            }
          },
          firstName: {
            value: null,
            type: 'input',
            props: {
              label: `${this.$trp('isite.cms.form.firstName')} *`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ]
            }
          },
          lastName: {
            value: null,
            type: 'input',
            props: {
              label: `${this.$trp('isite.cms.form.lastName')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          userName: {
            value: null,
            type: 'input',
            props: {
              label: `${this.$trp('isite.cms.form.userName')} *`,
              vIf: this.customLogin,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          email: {
            value: null,
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.email')} *`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
                //val => this.$helper.validateEmail(val) || this.$tr('isite.cms.message.fieldEmail')
              ],
            }
          },
          phone: {
            value: null,
            type: 'localizedPhone',
            props: {
              label: `${this.$tr('isite.cms.form.phone')}`,
              mask:"##########",
            },
          },
          isActivated: {
            value: '1',
            type: 'select',
            props: {
              label: `${this.$tr('isite.cms.form.status')}:`,
              options: [
                {label: this.$tr('isite.cms.label.enabled'), value: '1'},
                {label: this.$tr('isite.cms.label.disabled'), value: '0'},
              ],
            }
          },
          changePassword: {
            value: false,
            type: 'checkbox',
            noCrud: true,
            props: {
              label: `${this.$tr('isite.cms.message.updatePassword')}*`,
              vIf: this.crudInfo.typeForm == 'update'
            }
          },
          password: {
            value: null,
            type: 'input',
            noCrud: ((this.crudInfo.typeForm == 'update') && !this.crudInfo.changePassword) ? true : false,
            props: {
              label: `${this.$trp('isite.cms.form.password')}*`,
              type: 'password',
              vIf: (this.crudInfo.typeForm == 'create') || this.crudInfo.changePassword,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired'),
                val => val.length >= 6 || this.$tr('isite.cms.message.fieldMinLeng', {num: 6})
              ]
            }
          },
          passwordConfirmation: {
            value: null,
            type: 'input',
            noCrud: ((this.crudInfo.typeForm == 'update') && !this.crudInfo.changePassword) ? true : false,
            props: {
              label: `${this.$trp('isite.cms.form.checkPassword')}*`,
              type: 'password',
              vIf: (this.crudInfo.typeForm == 'create') || this.crudInfo.changePassword,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired'),
                val => this.crudInfo.password == val || this.$tr('isite.cms.message.fieldCheckPassword'),
              ]
            }
          },
        },
        formRight: {
          permissions: {
            allowInherit: true,
            type: 'permissions',
            value: {}
          },
          roles: {
            value: [],
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('@imagina/quser/_crud/roles'),
              crudProps: {
                label: `${this.$trp('isite.cms.label.role', {capitalize: true})}*`,
                multiple: true,
                useChips: true,
                rules: [
                  val => (!!val && val.length) || this.$tr('isite.cms.message.fieldRequired')
                ]
              },
              config: {options: {label: 'name', value: 'id'}},
            }
          },
          departments: {
            value: [],
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('@imagina/quser/_crud/departments'),
              crudProps: {
                label: `${this.$trp('iprofile.cms.label.userGroup')}*`,
                multiple: true,
                useChips: true,
                rules: [
                  val => (!!val && val.length) || this.$tr('isite.cms.message.fieldRequired')
                ]
              },
            }
          },
          assignedRoles: {
            value: [],
            type: 'select',
            fakeFieldName: 'settings',
            permission: 'profile.permissions.manage',
            props: {
              label: 'Can manage users with following roles',
              multiple: true,
              clearable: true,
              useChips: true
            },
            loadOptions: {
              apiRoute: 'apiRoutes.quser.roles',
              select: {label: 'name', id: 'id'}
            }
          },
          assignedDepartments: {
            value: [],
            type: 'select',
            fakeFieldName: 'settings',
            permission: 'profile.permissions.manage',
            props: {
              label: 'Can manage departments under following User groups',
              multiple: true,
              clearable: true,
              useChips: true
            },
            loadOptions: {
              apiRoute: 'apiRoutes.quser.departments',
              requestParams: {include: ''}
            }
          },
        }
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    },
    //Setting custom login
    customLogin() {
      var setting = this.$store.getters['qsiteApp/getSettingValueByName']('iprofile::customLogin') || []
      return setting.includes("user_name")
    }
  },
}
</script>
