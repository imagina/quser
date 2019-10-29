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
		authenticated: true,
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
	//Reset Password
	resetPassword: {
		permission: null,
		activated: true,
		path: '/auth/reset-password',
		name: 'auth.reset.password',
		layout: require('@imagina/quser/_layouts/password/reset').default,
		containerLayout: blank,
		icon: 'fas fa-chart-bar',
	},
	//Reset Password Completed
	resetCompleted: {
		permission: null,
		activated: true,
		path: '/auth/reset/:id/:code',
		name: 'auth.reset.completed',
		layout: require('@imagina/quser/_layouts/password/completed').default,
		containerLayout: blank,
		icon: 'fas fa-chart-bar',
	},
}
