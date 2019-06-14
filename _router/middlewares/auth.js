import store from 'src/store/index'

export default async function (to, from, next) {
  try {
    //Check if is authenticated
    const isAuthenticated = store.getters['auth/isAuthenticated'];
    //If not is authenticated, try login again
    isAuthenticated ? true : await store.dispatch('auth/AUTH_TRYAUTOLOGIN');
    //Redirect if is authenticated
    if (store.getters['auth/isAuthenticated']) {
      // Redirect to home, if page is login
      (to.name == 'auth.login') ? next({name:'app.home'}) : next()
    } else {//Redirect if is not authenticated
      // will not Redirect if page is login
      (to.name == 'auth.login') ? next() : next({name: 'auth.login', params : {from : to}})
    }
  } catch (error) {
      next();
  }
}
