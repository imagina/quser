//Layout container
import master from 'src/layouts/master'
import blank from 'src/layouts/blank'
import vcrud from '@imagina/qcrud/_components/vueCrud'

//Middleware
import auth from '@imagina/quser/_router/middlewares/auth'
import access from '@imagina/quser/_router/middlewares/access'

import * as departments from "@imagina/quser/_components/crud/departments";
import * as roles from "@imagina/quser/_components/crud/roles";

export default {
	//Login
	login: {
		permission: null,
		activated: true,
		path: '/auth/login',
		name: 'auth.login',
		layout: require('@imagina/quser/_layouts/login').default,
		containerLayout: blank,
		title: 'Login',
		icon: 'fas fa-chart-bar',
		middleware: [auth]
	},
	//Logout
	logout: {
		permission: null,
		activated: true,
		path: '/auth/logout',
		name: 'auth.logout',
		layout: require('@imagina/quser/_layouts/logout').default,
		containerLayout: blank,
		title: 'Logout',
		icon: 'fas fa-chart-bar',
		middleware: [auth]
	},
	//Change password
	changePassword: {
		permission: null,
		activated: true,
		path: '/auth/change-password',
		name: 'auth.change.password',
		layout: require('@imagina/quser/_layouts/passwordChange').default,
		containerLayout: blank,
		title: 'Change Password',
		icon: 'fas fa-chart-bar'
	},
	//User Index
	userIndex: {
		permission: 'profile.user.index',
		activated: true,
		path: '/users/index',
		name: 'user.users.index',
		layout: require('@imagina/quser/_layouts/index').default,
		containerLayout: master,
		title: 'User List',
		icon: 'fas fa-users',
		middleware: [auth,access]
	},
	//User Create
	userCreate: {
		permission: 'profile.user.create',
		activated: true,
		path: '/users/create',
		name: 'user.users.create',
		layout: require('@imagina/quser/_layouts/form').default,
		containerLayout: master,
		title: 'Create',
		icon: 'fas fa-user-plus',
		middleware: [auth,access]
	},
	//User Edit
	userEdit: {
		permission: 'profile.user.edit',
		activated: true,
		path: '/users/:id/edit',
		name: 'user.users.edit',
		layout: require('@imagina/quser/_layouts/form').default,
		containerLayout: master,
		title: 'User Edit',
		icon: 'fas fa-chart-bar',
		middleware: [auth,access]
	},
	//User Profile
	userProfile: {
		permission: null,
		activated: true,
		path: '/users/me/profile',
		name: 'user.profile.me',
		layout: require('@imagina/quser/_layouts/profile').default,
		containerLayout: master,
		title: 'Profile',
		icon: 'fas fa-chart-bar',
		middleware: [auth,access]
	},
	//User Profile customer
	userProfileCustomer: {
		permission: null,
		activated: true,
		path: '/users/profile/customer',
		name: 'user.profile.customer',
		layout: require('@imagina/quser/_layouts/profileForm').default,
		containerLayout: master,
		title: 'Profile',
		icon: 'fas fa-chart-bar',
		middleware: [auth,access]
	},
	//User Departments
	userDepartments: {
		permission: 'profile.departments.index',
		activated: true,
		path: '/departments',
		name: 'user.departments',
		layout: vcrud,
		containerLayout: master,
		isCrud: true,
		title: 'Departments',
		icon: 'fas fa-user-shield',
		props : {
			storeName: 'apiRoutes.profile.departments',
			singularName: 'department',
			pluralName: 'departments',
			...departments,
			doPage: false
		},
		middleware: [auth,access]
	},
	//User Roles
	userRoles: {
		permission: 'profile.role.index',
		activated: true,
		path: '/roles',
		name: 'user.roles',
		layout: vcrud,
		containerLayout: master,
		isCrud: true,
		title: 'Roles',
		icon: 'fas fa-user-tag',
		props : {
			storeName: 'apiRoutes.profile.roles',
			singularName: 'role',
			pluralName: 'roles',
			...roles,
			doPage: false
		},
		middleware: [auth,access]
	},
}