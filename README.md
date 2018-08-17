##Module User
Module with CRUD for users, and profile admin.

##Required

####Plugins
- helper
- vuelidate
- axios


##Usage

####Routes and Middleware

In file `src/router/routes` add:
```js
import user from '@imagina/quser/_router/routes' //Routes module
import auth from '@imagina/quser/_router/middlewares/auth' //Middleware auth
import access from '@imagina/quser/_router/middlewares/access' //Middleware access
```

####Stores

In file `src/store/index` add:
```js
import auth from '@imagina/quser/_store/auth/index'; //Import this file //Import this file
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    auth //Add authStore
  }
});
```

####Config

In file `src/config/index` add:
```js
import auth from '@imagina/quser/_config/auth'; //Import this file
```
####Sidebar
in file `src/config/slidebar` add:
```js
/*User*/
user: {
  title: 'Users',
  icon: 'fas fa-users',
  children: [
    {
      title: 'Create',
      icon: 'fas fa-user-plus',
      to: 'user.users.create',
      can:'user.users.create'
    },
    {
      title: 'List/Search',
      icon: 'fas fa-list-alt',
      to: 'user.users.index',
      can:'user.users.index'
    },
    {
      title: 'My profile',
      icon: 'fas fa-user-tie',
      to: 'user.profile.me'
    },
    {
      title: 'Departments',
      icon: 'fas fa-cube',
      to: 'user.department'
    }
  ]
},
/*logout*/
logout: {
  title: 'Sign out',
  icon: 'fas fa-sign-out-alt',
  to: 'auth.logout'
}
```

##Components
- widget-use: component with route to my profile and sign out:

`import WidgetUser from "@imagina/quser/_components/widget-user";`

##Plugins
- auth: plugin with method `hasAccess` for validate user permisions
`import {authPlugin} from "@imagina/quser/_plugins/auth";` or define it in data like`auth: require('@imagina/quser/_plugins/auth').default`
