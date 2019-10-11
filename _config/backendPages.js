//get pages of frontend, same is necesary to backend
import frontendPages from '@imagina/quser/_config/frontendPages'

let localPages = {
	//User Index
	userIndex: {
		permission: 'profile.user.manage',
		activated: true,
		path: '/users/index',
		name: 'quser.admin.users',
		page: () => import('@imagina/quser/_layouts/admin/users'),
		layout: () => import('src/layouts/master'),
		title: 'quser.sidebar.adminUserIndex',
		icon: 'fas fa-users',
		authenticated: true,
	},
	//User Departments
	userDepartments: {
		permission: 'profile.departments.index',
		activated: true,
		path: '/departments',
		name: 'quser.admin.departments',
		page: () => import('@imagina/quser/_layouts/admin/departments/index'),
		layout: () => import('src/layouts/master'),
		isCrud: true,
		title: 'quser.sidebar.adminUserDepartments',
		icon: 'fas fa-user-shield',
		authenticated: true,
	},
	//User Roles
	userRoles: {
		permission: 'profile.role.index',
		activated: true,
		path: '/roles',
		name: 'quser.admin.roles',
		page: () => import('@imagina/quser/_layouts/admin/roles/index'),
		layout: () => import('src/layouts/master'),
		isCrud: true,
		title: 'quser.sidebar.adminUserRoles',
		icon: 'fas fa-user-tag',
		authenticated: true,
	},
}

//Return local page merged with frontend pages
export default Object.assign({},frontendPages, localPages)
