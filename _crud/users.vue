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
          apiRoute: 'apiRoutes.quser.users',
          permission: 'profile.user',
          create: {
            title: this.$tr('quser.layout.newUser'),
          },
          read: {
            requestParams: {include: 'roles,departments'},
            columns: [
              {name: 'id', label: this.$tr('ui.form.id'), field: 'id'},
              {
                name: 'fullName', label: this.$tr('ui.form.name'), field: 'fullName',
                align: 'left', sortable: true
              },
              {
                name: 'email', label: this.$tr('ui.form.email'), field: 'email',
                align: 'left', sortable: true
              },
              {
                name: 'isActivated', label: this.$tr('ui.form.status'), field: 'isActivated',
                asStatus : true
              },
              {
                name: 'roles', label: this.$trp('ui.label.role'), field: 'roles',
                align: 'left', classes: 'ellipsis', style: 'max-width : 250px',
                format: val => val ? val.map(item => {
                  return item.name
                }).join(', ') : ''
              },
              {
                name: 'departments', label: this.$trp('ui.label.department'), field: 'departments',
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
                  clearable : true
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
                  clearable : true
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
                  clearable : true
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
                label: `${this.$trp('ui.form.email')} *`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired'),
                  val => this.$helper.validateEmail(val) || this.$tr('ui.message.fieldEmail')
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
                  val => val.length >= 8 || this.$tr('ui.message.fieldMinLeng', {num: 8})
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
                  label: `${this.$trp('ui.label.department')}*`,
                  multiple: true,
                  useChips: true,
                  rules: [
                    val => (!!val && val.length) || this.$tr('ui.message.fieldRequired')
                  ]
                },
              }
            },
            settings: {
              type: 'settings',
              settings: {
                assignedRoles: {
                  description: 'Can manage users with following roles',
                  label: this.$trp('ui.label.role'),
                  value: [],
                  type: 'select',
                  multiple: true,
                  clearable: true,
                  loadOptions: {
                    apiRoute: 'apiRoutes.quser.roles',
                    select: {label: 'name', id: 'id'}
                  }
                },
                assignedDepartments: {
                  description: 'Can manage departments under following departments',
                  label: this.$trp('ui.label.department'),
                  value: [],
                  type: 'select',
                  tree: false,
                  multiple: true,
                  clearable: true,
                  loadOptions: {
                    apiRoute: 'apiRoutes.quser.departments',
                    requestParams: {include: ''}
                  }
                },
              }
            },
            permissions: {
              allowInherit: true,
              type: 'permissions',
              value: {}
            }
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
