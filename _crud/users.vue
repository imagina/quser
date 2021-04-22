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
          title: this.$tr('quser.layout.newUser'),
        },
        read: {
          requestParams: {include: 'roles,departments'},
          columns: [
            {name: 'id', label: this.$tr('ui.form.id'), field: 'id'},
            {
              name: 'first_name', label: this.$tr('ui.form.name'), field: 'fullName',
              align: 'left', sortable: true
            },
            {
              name: 'email', label: `${this.$tr('ui.form.email')} / ${this.$trp('ui.form.userName')}`,
              field: 'email', align: 'left', sortable: true
            },
            {
              name: 'isActivated', label: this.$tr('ui.form.status'), field: 'isActivated',
              asStatus: true
            },
            {
              name: 'roles', label: this.$trp('ui.label.role'), field: 'roles',
              align: 'left', classes: 'ellipsis', style: 'max-width : 250px',
              format: val => val ? val.map(item => {
                return item.name
              }).join(', ') : ''
            },
            {
              name: 'departments', label: this.$trp('quser.layout.label.userGroup'), field: 'departments',
              align: 'left', classes: 'ellipsis', style: 'max-width : 250px',
              format: val => val ? val.map(item => {
                return item.title
              }).join(', ') : ''
            },
            {
              name: 'last_loging', label: this.$tr('quser.layout.form.lastLogin'), field: 'lastLoginDate',
              align: 'left', format: val => val ? this.$trd(val) : '-',
            },
            {
              name: 'created_at', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {
              name: 'updated_at', label: this.$tr('ui.form.updatedAt'), field: 'updatedAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
          ],
          filters: {
            roleId: {
              value: null,
              type: 'select',
              loadOptions: {
                apiRoute: 'apiRoutes.quser.roles',
                select: {label: 'name', id: 'id'}
              },
              props: {
                label: `${this.$tr('ui.label.role')}:`,
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
                label: `${this.$tr('ui.label.department')}:`,
                clearable: true
              }
            },
            isActivated: {
              value: null,
              type: 'select',
              props: {
                label: `${this.$tr('ui.form.status')}:`,
                options: [
                  {label: this.$tr('ui.label.enabled'), value: '1'},
                  {label: this.$tr('ui.label.disabled'), value: '0'},
                ],
                clearable: true
              }
            },
          }
        },
        update: {
          title: this.$tr('quser.layout.updateUser'),
          requestParams: {include: 'roles,departments,settings'}
        },
        delete: false,
        formLeft: {
          id: {value: null},
          userId: {value: this.$store.state.quserAuth.userId},
          firstName: {
            value: null,
            type: 'input',
            props: {
              label: `${this.$trp('ui.form.firstName')} *`,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ]
            }
          },
          lastName: {
            value: null,
            type: 'input',
            props: {
              label: `${this.$trp('ui.form.lastName')}*`,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            }
          },
          email: {
            value: null,
            type: 'input',
            props: {
              label: `${this.$tr('ui.form.email')} / ${this.$trp('ui.form.userName')} *`,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
                //val => this.$helper.validateEmail(val) || this.$tr('ui.message.fieldEmail')
              ],
            }
          },
          isActivated: {
            value: '1',
            type: 'select',
            props: {
              label: `${this.$tr('ui.form.status')}:`,
              options: [
                {label: this.$tr('ui.label.enabled'), value: '1'},
                {label: this.$tr('ui.label.disabled'), value: '0'},
              ],
            }
          },
          changePassword: {
            value: false,
            type: 'checkbox',
            noCrud: true,
            props: {
              label: `${this.$tr('ui.message.updatePassword')}*`,
              vIf: this.crudInfo.typeForm == 'update'
            }
          },
          password: {
            value: null,
            type: 'input',
            noCrud: ((this.crudInfo.typeForm == 'update') && !this.crudInfo.changePassword) ? true : false,
            props: {
              label: `${this.$trp('ui.form.password')}*`,
              type: 'password',
              vIf: (this.crudInfo.typeForm == 'create') || this.crudInfo.changePassword,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired'),
                val => val.length >= 6 || this.$tr('ui.message.fieldMinLeng', {num: 6})
              ]
            }
          },
          passwordConfirmation: {
            value: null,
            type: 'input',
            noCrud: ((this.crudInfo.typeForm == 'update') && !this.crudInfo.changePassword) ? true : false,
            props: {
              label: `${this.$trp('ui.form.checkPassword')}*`,
              type: 'password',
              vIf: (this.crudInfo.typeForm == 'create') || this.crudInfo.changePassword,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired'),
                val => this.crudInfo.password == val || this.$tr('ui.message.fieldCheckPassword'),
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
                label: `${this.$trp('ui.label.role', {capitalize: true})}*`,
                multiple: true,
                useChips: true,
                rules: [
                  val => (!!val && val.length) || this.$tr('ui.message.fieldRequired')
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
                label: `${this.$trp('quser.layout.label.userGroup')}*`,
                multiple: true,
                useChips: true,
                rules: [
                  val => (!!val && val.length) || this.$tr('ui.message.fieldRequired')
                ]
              },
            }
          },
          assignedRoles: {
            value: [],
            type: 'select',
            fakeFieldName: 'settings',
            permission : 'profile.permissions.manage',
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
            permission : 'profile.permissions.manage',
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
    }
  },
}
</script>
