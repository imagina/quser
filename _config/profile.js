/*
* In javascript the variables are declared in camelcase but I like use snake case,
* if you want you can rename them as you want and remove the rule in .eslintrc line 35
*/
const baseApiUrl = env('BASE_URL', 'http://localhost:8000') + '/api';
const moduleName = 'profile';
const moduleVersion = 'v1';
const urlBase = baseApiUrl + '/' + moduleName + '/' + moduleVersion

export default {
	version: moduleVersion,
	appVersion: urlBase+'/app/version',
	permissions: urlBase+'/app/permissions',
	me: urlBase + '/auth/me',
	mustChangePassword: urlBase + '/auth/must-change-password',
	authLogin: urlBase + '/auth/login',
	authLogout: urlBase + '/auth/logout',
	authLogoutAll: urlBase + '/auth/logout-all',
	addresses: urlBase + '/addresses',
	departments: urlBase + '/departments',
	departmentsSettings: urlBase + '/departments/settings',
	fields: urlBase + '/fields',
	users: urlBase + '/users',
	changePassword: urlBase + '/users/change-password',
  roles: urlBase + '/roles'
}