export default {
  //Login
  login: {
    permission: null,
    activated: true,
    path: '/auth/login',
    name: 'auth.login',
    page: () => import('@imagina/quser/_pages/wrapper'),
    layout: () => import('@imagina/qsite/_layouts/blank.vue'),
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
    page: () => import('@imagina/quser/_pages/wrapper'),
    layout: () => import('@imagina/qsite/_layouts/blank.vue'),
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
    page: () => import('@imagina/quser/_pages/wrapper'),
    layout: () => import('@imagina/qsite/_layouts/blank.vue'),
    title: 'iprofile.cms.sidebar.register',
    icon: 'fas fa-chart-bar',
    authType: 'register'
  },
  //reset
  resetPassword: {
    permission: null,
    activated: true,
    path: '/auth/reset',
    name: 'auth.reset.password',
    page: () => import('@imagina/quser/_pages/wrapper'),
    layout: () => import('@imagina/qsite/_layouts/blank.vue'),
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
    page: () => import('@imagina/quser/_pages/wrapper'),
    layout: () => import('@imagina/qsite/_layouts/blank.vue'),
    title: 'iprofile.cms.sidebar.resetPassword',
    icon: 'fas fa-chart-bar',
    authType: 'resetPasswordComplete'
    //middleware: [auth]
  },
  forceChangePassword: {
    permission: null,
    activated: true,
    path: '/auth/force-change-password',
    name: 'auth.reset-complete',
    page: () => import('@imagina/quser/_pages/wrapper'),
    layout: () => import('@imagina/qsite/_layouts/blank.vue'),
    title: 'iprofile.cms.sidebar.resetPassword',
    icon: 'fas fa-chart-bar',
    authType: 'forceChangePassword'
    //middleware: [auth]
  },
  //User Profile
  userProfile: {
    permission: null,
    activated: true,
    path: '/me/profile',
    name: 'user.profile.me',
    page: () => import('@imagina/quser/_pages/profile'),
    layout: () => import('@imagina/qsite/_layouts/master'),
    title: 'iprofile.cms.sidebar.panelProfile',
    icon: 'fas fa-user-circle',
    authenticated: true,
    subHeader: {
      refresh: true
    }
  },
}
