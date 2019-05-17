import Route from 'vue-routisan'
import guest from '../_router/middlewares/guest'
import auth from '../_router/middlewares/auth' //Middleware auth
import access from '../_router/middlewares/access' //Middleware access

import vueCrud from '@imagina/qcrud/_components/vueCrud'

/*VIEWS*/
import home from 'src/layouts/master'
import blank from 'src/layouts/blank'

/*CRUD DEPARTMENT CONFIGURATIONS*/
import * as departments from '../_components/crud/departments'

/*CRUD ROLE CONFIGURATIONS*/
import * as roles from '../_components/crud/roles'


//Routes for auth
Route.view('/auth', blank)
	.children(() => {
			Route.view('/login', require('../_layouts/login').default).name('auth.login').guard(guest)
			Route.view('/logout', require('../_layouts/logout').default).name('auth.logout')
			Route.view('/change-password', require('../_layouts/passwordChange').default).name('auth.change.password')
		}
	)

//Routes for users
Route.view('/users', home)
	.guard(auth)
	.children(() => {
			Route.view('/index', require('../_layouts/index').default).options({
				name: 'user.users.index',
				meta: {permission: 'profile.user.index'},
				guard: access
			});
			Route.view('/create', require('../_layouts/form').default).options({
				name: 'user.users.create',
				meta: {permission: 'profile.user.create'},
				guard: access
			});
			Route.view('/:id/edit', require('../_layouts/form').default).options({
				name: 'user.users.edit',
				meta: {permission: 'profile.user.edit'},
				guard: access
			});
			Route.view('/me/profile', require('../_layouts/profile').default).options({
				name: 'user.profile.me'
			});
			Route.view('/me/profile/customer', require('../_layouts/profileForm').default).options({
				name: 'user.profile.customer'
			});

			Route.view('/department', vueCrud).options({
				name: 'user.department',
				meta: {permission: 'profile.departments.index'},
				guard: access,
				props: (route) => {
					return {
						storeName: 'profile.departments',
						singularName: 'department',
						pluralName: 'departments',
						parentId: route.params.parentId || null, ...departments,
						doPage: false
					}
				},
			});

			Route.view('/roles', vueCrud).options({
				name: 'user.roles',
				meta: {permission: 'profile.role.manage'},
				guard: access,
				props: (route) => {
					return {
						storeName: 'profile.roles',
						singularName: 'role',
						pluralName: 'roles',
						parentId: route.params.parentId || null, ...roles,
						doPage: false
					}
				},
			});

		}
	)

export default Route.all()
