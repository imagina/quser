export default {
  //User Index
  userIndex: {
    permission: 'profile.user.manage',
    activated: true,
    path: '/users/index',
    name: 'quser.admin.users',
    crud: import('modules/quser/_crud/users'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('modules/qsite/_layouts/master.vue'),
    title: 'iprofile.cms.sidebar.adminUserIndex',
    icon: 'fal fa-users',
    authenticated: true,
    subHeader: {
      refresh: true
    }
  },
  //User Departments
  userDepartments: {
    permission: 'profile.departments.manage',
    activated: true,
    path: '/departments',
    name: 'quser.admin.departments',
    crud: import('modules/quser/_crud/departments'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('modules/qsite/_layouts/master.vue'),
    isCrud: true,
    title: 'iprofile.cms.sidebar.adminUserDepartments',
    icon: 'fal fa-people-arrows',
    authenticated: true,
    subHeader: {
      refresh: true,
      breadcrumb: ['quser.userIndex']
    }
  },
  //User Roles
  userRoles: {
    permission: 'profile.role.manage',
    activated: true,
    path: '/roles',
    name: 'quser.admin.roles',
    crud: import('modules/quser/_crud/roles'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('modules/qsite/_layouts/master.vue'),
    isCrud: true,
    title: 'iprofile.cms.sidebar.adminUserRoles',
    icon: 'fal fa-user-tag',
    authenticated: true,
    subHeader: {
      refresh: true,
      breadcrumb: ['quser.userIndex']
    }
  },
  //Directory
  directory: {
    permission: 'profile.user.directory',
    activated: true,
    path: '/users/directory',
    name: 'quser.admin.directory',
    page: () => import('modules/quser/_pages/_admin/directory'),
    layout: () => import('modules/qsite/_layouts/master.vue'),
    title: 'iprofile.cms.sidebar.adminDirectory',
    icon: 'fal fa-address-book',
    authenticated: true,
    subHeader: {
      refresh: true,
    }
  },
}
