import store from 'src/store/index'

export default async function (to, from, next) {
  try {
    var isAuthenticated = store.getters['auth/isAuthenticated'];
    isAuthenticated ? true : store.dispatch('auth/AUTH_TRYAUTOLOGIN');

    //Can we call getters differently for store modules ? //TODO
    if (store.getters['auth/isAuthenticated']) {
      next();
    } else {
      next('/auth/login');
    }
  } catch (error) {
      next();
  }
}
