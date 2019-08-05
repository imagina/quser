//Layout container
import master from 'src/layouts/master'
import blank from 'src/layouts/blank'

//Middleware
import auth from '@imagina/quser/_router/middlewares/auth'
import access from '@imagina/quser/_router/middlewares/access'

//get pages of frontend, same is necesary to backend
import frontendPages from '@imagina/quser/_config/frontendPages'

let localPages = {
	//User Index
	userIndex: {
		permission: 'profile.user.manage',
		activated: true,
		path: '/users/index',
		name: 'quser.admin.users',
		layout: require('@imagina/quser/_layouts/admin/users').default,
		containerLayout: master,
		title: 'quser.sidebar.adminUserIndex',
		icon: 'fas fa-users',
		middleware: [auth,access]
	},
	//User Departments
	userDepartments: {
		permission: 'profile.departments.index',
		activated: true,
		path: '/departments',
		name: 'quser.admin.departments',
		layout: require('@imagina/quser/_layouts/admin/departments/index').default,
		containerLayout: master,
		isCrud: true,
		title: 'quser.sidebar.adminUserDepartments',
		icon: 'fas fa-user-shield',
		middleware: [auth,access]
	},
	//User Roles
	userRoles: {
		permission: 'profile.role.index',
		activated: true,
		path: '/roles',
		name: 'quser.admin.roles',
		layout: require('@imagina/quser/_layouts/admin/roles/index').default,
		containerLayout: master,
		isCrud: true,
		title: 'quser.sidebar.adminUserRoles',
		icon: 'fas fa-user-tag',
		middleware: [auth,access]
	},
}

//Return local page merged with frontend pages
export default Object.assign({},frontendPages, localPages)
