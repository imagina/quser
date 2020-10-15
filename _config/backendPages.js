//get pages of frontend, same is necesary to backend
import frontendPages from '@imagina/quser/_config/frontendPages'
import appConfig from 'src/config/app'

let localPages = {
	//User Index
	userIndex: {
		permission: 'profile.user.manage',
		activated: true,
		path: '/users/index',
		name: 'quser.admin.users',
		page: () => import('@imagina/quser/_pages/admin/users'),
		layout: () => import('@imagina/qsite/_layouts/master.vue'),
		title: 'quser.sidebar.adminUserIndex',
		icon: 'fas fa-users',
		authenticated: true,
		subHeader: {
			refresh: true,
		}
	},
	//User Departments
	userDepartments: {
		permission: 'profile.departments.index',
		activated: true,
		path: '/departments',
		name: 'quser.admin.departments',
		page: () => import('@imagina/quser/_pages/admin/departments/index'),
		layout: () => import('@imagina/qsite/_layouts/master.vue'),
		isCrud: true,
		title: 'quser.sidebar.adminUserDepartments',
		icon: 'fas fa-user-shield',
		authenticated: true,
		subHeader: {
			refresh: true,
			breadcrumb : ['quser.userIndex']
		}
	},
	//User Roles
	userRoles: {
		permission: 'profile.role.index',
		activated: true,
		path: '/roles',
		name: 'quser.admin.roles',
		page: () => import('@imagina/quser/_pages/admin/roles/index'),
		layout: () => import('@imagina/qsite/_layouts/master.vue'),
		isCrud: true,
		title: 'quser.sidebar.adminUserRoles',
		icon: 'fas fa-user-tag',
		authenticated: true,
		subHeader: {
			refresh: true,
			breadcrumb : ['quser.userIndex']
		}
	},
}

const responseRoutes = (!appConfig.isBackend && appConfig.loadBackendPages) ? localPages : {...frontendPages, ...localPages}
//Return local page merged with frontend pages
export default responseRoutes
