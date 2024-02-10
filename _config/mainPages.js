export default {
  //Login
  login: {
    permission: null,
    activated: true,
    path: '/auth/login',
    name: 'auth.login',
    page: () => import('modules/quser/_pages/wrapper'),
    layout: () => import('layouts/blank.vue'),
    title: 'iprofile.cms.sidebar.login',
    icon: 'fas fa-chart-bar',
    authenticated: true,
    authType: 'login'
  },
  //Logout
  logout: {
    permission: null,
    activated: true,
    path: '/auth/logout',
    name: 'auth.logout',
    page: () => import('modules/quser/_pages/wrapper'),
    layout: () => import('layouts/blank.vue'),
    title: 'iprofile.cms.sidebar.logout',
    icon: 'fas fa-chart-bar',
    authType : 'logout'
  },
  // Route to Register
  register: {
    permission: null,
    activated: true,
    path: '/auth/register',
    name: 'auth.register',
    page: () => import('modules/quser/_pages/wrapper'),
    layout: () => import('layouts/blank.vue'),
    title: 'iprofile.cms.sidebar.register',
    icon: 'fas fa-chart-bar',
    authenticated: true,
    authType: 'register'
  },
  //reset
  resetPassword: {
    permission: null,
    activated: true,
    path: '/auth/reset',
    name: 'auth.reset.password',
    page: () => import('modules/quser/_pages/wrapper'),
    layout: () => import('layouts/blank.vue'),
    title: 'iprofile.cms.sidebar.resetPassword',
    icon: 'fas fa-chart-bar',
    authType: 'resetPassword'
  },
  //Reset success
  resetPasswordComplete: {
    permission: null,
    activated: true,
    path: '/auth/reset/:userId/:token',
    name: 'auth.reset-complete',
    page: () => import('modules/quser/_pages/wrapper'),
    layout: () => import('layouts/blank.vue'),
    title: 'iprofile.cms.sidebar.resetPassword',
    icon: 'fas fa-chart-bar',
    authType: 'resetPasswordComplete'
    //middleware: [auth]
  },
  forceChangePassword: {
    permission: null,
    activated: true,
    path: '/auth/force-change-password',
    name: 'auth.change-password',
    page: () => import('modules/quser/_pages/wrapper'),
    layout: () => import('layouts/blank.vue'),
    title: 'iprofile.cms.sidebar.resetPassword',
    icon: 'fas fa-chart-bar',
    authType: 'forceChangePassword',
    authenticated: true
  },
  //User Profile
  userProfile: {
    permission: null,
    activated: true,
    path: '/me/profile',
    name: 'user.profile.me',
    page: () => import('modules/quser/_pages/profile'),
    layout: () => import('layouts/master'),
    title: 'iprofile.cms.sidebar.panelProfile',
    icon: 'fa-light fa-circle-user',
    authenticated: true,
    subHeader: {
      refresh: true
    }
  },
}
