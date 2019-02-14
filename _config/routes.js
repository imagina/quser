export default {
	login: {name: 'user.login'},
	logout: {name: 'user.logout'},
	index : {name : 'user.users.index', permission:'profile.api.users.index'},
	create : {name : 'user.users.create', permission:'profile.api.users.create'},
	edit : {name : 'user.users.edit', permission:'profile.api.users.edit'},
	profileMe : {name : 'user.users.profile.me', permission:'profile.api.user.index'},
	profileCustomer : {name : 'user.users.profile.customer', permission:'profile.api.users.edit'},
	departments : {name : 'user.users.departments', permission:'profile.api.departments.edit'},
	roles : {name : 'user.users.roles', permission:'profile.api.roles.edit'},
}