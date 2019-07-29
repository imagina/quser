<template></template>
<script>
  export default {
    computed: {
      crudData() {
        return {
          apiRoute: 'apiRoutes.quser.users',
          permission: 'profile.user',
          create: {
            title: this.$tr('quser.layout.newUser'),
          },
          read: {
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
            requestParams: {include: ''},
            filters: {
              roleId: {
                label: `${this.$tr('ui.label.role')}:`,
                value: '0',
                type: 'select',
                options: [
                  {label: this.$tr('ui.label.all'), id: '0'}
                ],
                loadOptions: {
                  apiRoute: 'apiRoutes.quser.roles',
                  select: {label: 'name', id: 'id'}
                }
              },
              departmentId: {
                label: `${this.$tr('ui.label.department')}:`,
                value: '0',
                tree: false,
                type: 'select',
                options: [
                  {label: this.$tr('ui.label.all'), id: '0'}
                ],
                loadOptions: {
                  apiRoute: 'apiRoutes.quser.departments'
                }
              },
              status: {
                label: `${this.$tr('ui.form.status')}:`,
                value: '-1',
                type: 'select',
                options: [
                  {label: this.$tr('ui.label.all'), id: '-1'},
                  {label: this.$tr('ui.label.enabled'), id: '1'},
                  {label: this.$tr('ui.label.disabled'), id: '0'},
                ],
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
              label: this.$trp('ui.form.firstName'),
              value: null,
              type: 'text',
              isRequired: true,
            },
            lastName: {
              label: this.$trp('ui.form.lastName'),
              value: null,
              type: 'text',
              isRequired: true,
            },
            email: {
              label: this.$trp('ui.form.email'),
              value: null,
              type: 'email',
              isRequired: true,
            },
            password: {
              label: this.$trp('ui.form.password'),
              value: null,
              type: 'password',
              isRequired: true,
            },
            passwordConfirmation: {
              label: this.$trp('ui.form.checkPassword'),
              value: null,
              type: 'checkPassword',
              isRequired: true,
            },
            settings : {
              type: 'settings',
              settings: {
                assignedRoles: {
                  description: 'Can manage users with following roles',
                  label: this.$trp('ui.label.role'),
                  value: [],
                  type: 'select',
                  multiple : true,
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
                  tree :false,
                  multiple : true,
                  clearable: true,
                  loadOptions: {
                    apiRoute: 'apiRoutes.quser.departments',
                    requestParams: {include: ''}
                  }
                },
              }
            },
            permissions : {
              getAll : true,
              type : 'permissions',
              value : {}
            }
          },
          formRight : {
            activated: {
              label: `${this.$tr('ui.form.status')}:`,
              value: '1',
              type: 'select',
              options: [
                {label: this.$tr('ui.label.enabled'), id: '1'},
                {label: this.$tr('ui.label.disabled'), id: '0'},
              ],
            },
            roles: {
              label: this.$trp('ui.label.role'),
              value: [],
              type: 'multiSelect',
              loadOptions: {
                apiRoute: 'apiRoutes.quser.roles',
                select: {label: 'name', id: 'id'},
                requestParams: {include: ''}
              },
              create: {
                title: this.$tr('quser.layout.newRole'),
                component: import('@imagina/quser/_crud/roles')
              }
            },
            departments: {
              label: this.$trp('ui.label.department'),
              value: [],
              tree: false,
              type: 'multiSelect',
              loadOptions: {
                apiRoute: 'apiRoutes.quser.departments',
                requestParams: {include: ''}
              },
              create: {
                title: this.$tr('quser.layout.newDepartment'),
                component: import('@imagina/quser/_crud/departments')
              }
            },
          }
        }
      }
    },
  }
</script>
