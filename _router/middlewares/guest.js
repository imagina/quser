import authStore from '../../_store/index';

export default async function (to, from, next) {
  //User already logged is redirected.
  const user = authStore.state.userData;
  
  if (user) {
    next('/')
  } else {
    next()
  }
}
