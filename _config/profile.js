/*
* In javascript the variables are declared in camelcase but I like use snake case,
* if you want you can rename them as you want and remove the rule in .eslintrc line 35
*/
const baseApiUrl = env('BASE_URL', 'http://localhost:8000') + '/api';
const moduleName = 'profile';
const moduleVersion = 'v1';

export default {
	version: moduleVersion,
	authLogin: baseApiUrl + '/' + moduleName + '/' + moduleVersion + '/auth/login',
	authLogout: baseApiUrl + '/' + moduleName + '/' + moduleVersion + '/auth/logout',
	addresses: baseApiUrl + '/' + moduleName + '/' + moduleVersion + '/addresses',
	departments: baseApiUrl + '/' + moduleName + '/' + moduleVersion + '/departments',
	departmentsSettings: baseApiUrl + '/' + moduleName + '/' + moduleVersion + '/departments/settings',
	fields: baseApiUrl + '/' + moduleName + '/' + moduleVersion + '/fields',
	users: baseApiUrl + '/' + moduleName + '/' + moduleVersion + '/users',
  roles: baseApiUrl + '/' + moduleName + '/' + moduleVersion + '/roles'
}