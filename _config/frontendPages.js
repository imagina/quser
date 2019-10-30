export default {
	//Login
	login: {
		permission: null,
		activated: true,
		path: '/auth/login',
		name: 'auth.login',
		page: () => import('@imagina/quser/_layouts/login'),
		layout: () => import('src/layouts/blank'),
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
		page: () => import('@imagina/quser/_layouts/logout'),
		layout: () => import('src/layouts/blank'),
		title: 'quser.sidebar.logout',
		icon: 'fas fa-chart-bar',
		//authenticated: true,
	},
	//Change password
	changePassword: {
		permission: null,
		activated: true,
		path: '/auth/change-password',
		name: 'auth.change.password',
		page: () => import('@imagina/quser/_layouts/passwordChange'),
		layout: () => import('src/layouts/blank'),
		title: 'quser.sidebar.changePassword',
		icon: 'fas fa-chart-bar'
	},
	//User Profile
	userProfile: {
		permission: null,
		activated: true,
		path: '/users/me/profile',
		name: 'user.profile.me',
		page: () => import('@imagina/quser/_layouts/profile'),
		layout: () => import('src/layouts/master'),
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
		page: () => import('@imagina/quser/_layouts/resetPassword'),
		layout: () => import('src/layouts/blank'),
		title: 'quser.sidebar.reset',
		icon: 'fas fa-chart-bar',
		//middleware: [auth]
	},

	resetPasswordComplete: {
		permission: null,
		activated: true,
		path: '/auth/reset/:userId/:token',
		name: 'auth.reset-complete',
		page: () => import('@imagina/quser/_layouts/resetPasswordComplete'),
		layout: () => import('src/layouts/blank'),
		title: 'quser.sidebar.reset',
		icon: 'fas fa-chart-bar',
		//middleware: [auth]
	},
}
