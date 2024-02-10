export default {
  moduleName: 'iprofile',
  //Perzonalization config
  perzonalization: {
    otherModules: ['user']
  },
  //Entities
  entityNames: {
    department: 'department',
    rol: 'role',
    user: 'user',
  },
  //Quick Cards
  quickCards: [
    {
      active: true,
      permission: 'profile.user.manage',
      component: () => import('modules/quser/_components/quick-cards/lastUsers')
    }
  ]
}
