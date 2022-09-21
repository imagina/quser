const pages = config('pages') // Get Pages from config

//User
export default [
  {
    title: 'iprofile.cms.sidebar.adminGroup',
    icon: 'fal fa-users',
    children: [
      pages.quser.userIndex,//User Index
      pages.quser.userDepartments,//Departments Index
      pages.quser.userRoles,//Roles Index
      pages.quser.directory,//Directory
    ]
  },
]
