const moduleName = 'profile';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`

export default {
	urlBase : urlBase,
	version: moduleVersion,
	me: `${urlBase}/auth/me`,
	mustChangePassword: `${urlBase}/auth/must-change-password`,
	authLogin: `${urlBase}/auth/login`,
	authLogout: `${urlBase}/auth/logout`,
	authLogoutAll: `${urlBase}/auth/logout-all`,
	impersonate: `${urlBase}/auth/impersonate`,
	refreshToken : `${urlBase}/auth/refresh-token`,
	addresses: `${urlBase}/addresses`,
	departments: `${urlBase}/departments`,
	departmentsSettings: `${urlBase}/departments/settings`,
	fields: `${urlBase}/fields`,
	users: `${urlBase}/users`,
	register: `${urlBase}/users/register`,
	changePassword: `${urlBase}/users/change-password`,
  roles: `${urlBase}/roles`,
	resetPassword: `${urlBase}/auth/reset-password`,
	resetCompleted: `${urlBase}/auth/reset-completed`,
}
