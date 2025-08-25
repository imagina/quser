export default {
  //User Index
  userIndex: {
    permission: 'iuser.users.manage',
    activated: true,
    path: '/users/index',
    name: 'quser.admin.users',
    crud: import('modules/quser/_crud/users'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'iprofile.cms.sidebar.adminUserIndex',
    icon: 'fal fa-users',
    authenticated: true,
    subHeader: {
      refresh: true
    }
  },
  //User Roles
  userRoles: {
    permission: 'iuser.roles.manage',
    activated: true,
    path: '/roles',
    name: 'quser.admin.roles',
    crud: import('modules/quser/_crud/roles'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    isCrud: true,
    title: 'iprofile.cms.sidebar.adminUserRoles',
    icon: 'fal fa-user-tag',
    authenticated: true,
    subHeader: {
      refresh: true,
      breadcrumb: ['quser.userIndex']
    }
  }
}
