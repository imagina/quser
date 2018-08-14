import auth from '../../_plugins/auth'

export default async function (to, from, next) {
  try {
    if(to.meta.permission){
      if (auth.hasAccess(to.meta.permission)) {
        next();
      } else {
        next('/');
      }
    }
  } catch (error) {
      next();
  }
}
