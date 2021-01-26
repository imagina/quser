export default {
  //Quick Cards
  quickCards: [
    {
      active: true,
      permission: 'profile.user.manage',
      component: () => import('@imagina/quser/_components/quick-cards/lastUsers')
    }
  ]
}
