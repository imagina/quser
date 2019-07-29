const pages = config('pages') // Get Pages from config

//User
export default [
  {
    title: 'quser.sidebar.adminGroup',
    icon: 'fas fa-users',
    children: [
      pages.quser.userIndex,//User Index
      pages.quser.userDepartments,//Departments Index
      pages.quser.userRoles,//Roles Index
    ]
  },
]
