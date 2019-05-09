import auth from '@imagina/quser/_plugins/auth'

export default async function (to, from, next) {
  try {
    if(!to.meta.permission) return next()
    if (!auth.hasAccess(to.meta.permission)) return next({name:'app.home'})
    next()
  } catch (error) {
    next();
  }
}
