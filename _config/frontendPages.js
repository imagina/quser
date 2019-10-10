//Layout container
import master from 'src/layouts/master'
import blank from 'src/layouts/blank'

//Middleware
import auth from '@imagina/quser/_router/middlewares/auth'
import access from '@imagina/quser/_router/middlewares/access'

export default {
	//Login
	login: {
		permission: null,
		activated: true,
		path: '/auth/login',
		name: 'auth.login',
		layout: require('@imagina/quser/_layouts/login').default,
		containerLayout: blank,
		title: 'quser.sidebar.login',
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
		title: 'quser.sidebar.logout',
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
		title: 'quser.sidebar.changePassword',
		icon: 'fas fa-chart-bar'
	},
	//User Profile
	userProfile: {
		permission: null,
		activated: true,
		path: '/users/me/profile',
		name: 'user.profile.me',
		layout: require('@imagina/quser/_layouts/profile').default,
		containerLayout: master,
		title: 'quser.sidebar.meProfile',
		icon: 'fas fa-user',
		middleware: [auth,access]
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
