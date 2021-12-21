export default {
  moduleName: 'iprofile',
  modulesSettings: ['user', 'iprofile'],
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
      component: () => import('@imagina/quser/_components/quick-cards/lastUsers')
    }
  ]
}
