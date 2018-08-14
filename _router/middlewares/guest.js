import authStore from '../../_store/auth/index';

export default async function (to, from, next) {
  //User already logged is redirected.
  const user = authStore.user;
  if (user) {
    next('/')
  } else {
    next()
  }
}
