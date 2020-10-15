export default {
	//Login
	login: {
		permission: null,
		activated: true,
		path: '/auth/login',
		name: 'auth.login',
		page: () => import('@imagina/quser/_pages/login'),
		layout: () => import('@imagina/qsite/_layouts/blank.vue'),
		title: 'quser.sidebar.login',
		icon: 'fas fa-chart-bar',
		authenticated: true,
	},
  //Logout
	logout: {
		permission: null,
		activated: true,
		path: '/auth/logout',
		name: 'auth.logout',
		page: () => import('@imagina/quser/_pages/logout'),
		layout: () => import('@imagina/qsite/_layouts/blank.vue'),
		title: 'quser.sidebar.logout',
		icon: 'fas fa-chart-bar'
	},
	//Change password
	changePassword: {
		permission: null,
		activated: true,
		path: '/auth/change-password',
		name: 'auth.change.password',
		page: () => import('@imagina/quser/_pages/passwordChange'),
		layout: () => import('@imagina/qsite/_layouts/blank.vue'),
		title: 'quser.sidebar.changePassword',
		icon: 'fas fa-chart-bar'
	},
	//User Profile
	userProfile: {
		permission: null,
		activated: true,
		path: '/users/me/profile',
		name: 'user.profile.me',
		page: () => import('@imagina/quser/_pages/profile'),
		layout: () => import('@imagina/qsite/_layouts/master.vue'),
		title: 'quser.sidebar.meProfile',
		icon: 'fas fa-user',
		authenticated: true,
	},
	//reset
	resetPassword: {
		permission: null,
		activated: true,
		path: '/auth/reset',
		name: 'auth.reset.password',
		page: () => import('@imagina/quser/_pages/resetPassword'),
		layout: () => import('@imagina/qsite/_layouts/blank.vue'),
		title: 'quser.sidebar.reset',
		icon: 'fas fa-chart-bar',
		//middleware: [auth]
	},

	resetPasswordComplete: {
		permission: null,
		activated: true,
		path: '/auth/reset/:userId/:token',
		name: 'auth.reset-complete',
		page: () => import('@imagina/quser/_pages/resetPasswordComplete'),
		layout: () => import('@imagina/qsite/_layouts/blank.vue'),
		title: 'quser.sidebar.reset',
		icon: 'fas fa-chart-bar',
		//middleware: [auth]
	},
	// Route to Register (Specific register user Rol)
	register: {
		permission: null,
		activated: true,
		path: '/auth/register',
		name: 'auth.register',
		page: () => import('@imagina/quser/_pages/register'),
		layout: () => import('@imagina/qsite/_layouts/blank.vue'),
		title: 'quser.sidebar.reset',
		icon: 'fas fa-chart-bar',
		//middleware: [auth]
	},

}
