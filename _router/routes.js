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


//Routes for auth
Route.view('/auth', blank)
  .children(() => {
      Route.view('/login', require('../_layouts/login').default).name('auth.login').guard(guest)
      Route.view('/logout', require('../_layouts/logout').default).name('auth.logout')
    }
  )

//Routes for users
Route.view('/users', home)
  .guard(auth)
  .children(() => {
      Route.view('/index', require('../_layouts/index').default).options({
        name: 'user.users.index',
        meta: {permission: 'iprofile.api.user.index'},
        guard: access
      });
      Route.view('/create', require('../_layouts/form').default).options({
        name: 'user.users.create',
        meta: {permission: 'iprofile.api.user.create'},
        guard: access
      });
      Route.view('/:id/edit', require('../_layouts/form').default).options({
        name: 'user.users.edit',
        meta: {permission: 'iprofile.api.user.edit'},
        guard: access
      });

      Route.view('/me/profile', require('../_layouts/profile').default).options({
        name : 'user.profile.me'
      })

      Route.view('/department', vueCrud).options({
        name: 'user.department',
        meta: {permission: 'iprofile.api.user.department'},
        guard: access,
        props: (route) => { return { storeName: 'departments', singularName:'department', parentId: route.params.parentId || null, ...departments, doPage: false } },
      });
    }
  )

export default Route.all()
