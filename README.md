## QUSER  | 2.0.7

## Installation

`` npm i @imagina/quser@2.0.7 ``

## API Routes

| ENTITY  | ROUTE |
| ------------- | ------------- |
| Me | apiRoutes.quser.Me |
| Must Change Password | apiRoutes.quser.mustChangePassword |
| Login | apiRoutes.quser.authLogin |
| Logout | apiRoutes.quser.authLogout |
| Logout All | apiRoutes.quser.authLogoutAll |
| Impersonate | apiRoutes.quser.impersonate |
| Refresh Token | apiRoutes.quser.refreshToken |
| Addresses | apiRoutes.quser.addresses |
| Departments | apiRoutes.quser.departments |
| Department Settings | apiRoutes.quser.departmentsSettings |
| Fields | apiRoutes.quser.fields |
| Users | apiRoutes.quser.users |
| Register | apiRoutes.quser.register |
| ChangePassword | apiRoutes.quser.changePassword |
| Roles | apiRoutes.quser.roles |

## Pages
- ### Front-End

  | PAGE | NAME |
  | ------------- | ------------- |
  | Login | auth.login |
  | Logout | auth.logout |
  | Change Password | auth.change.password |
  | Profile | user.profile.me |
  
- ### Back-End

  | PAGE | NAME |
  | ------------- | ------------- |
  | Users | quser.admin.users |
  | Departments | quser.admin.departments |
  | Roles | quser.admin.roles |
  
## Components  

  | NAME | ROUTE |
  | ------------- | ------------- |
  | Serch Users | @imagina/quser/_components/search-users |
  | Widget Users | @imagina/qblog/_components/widget-user |
  | Widget User Department | @imagina/qblog/_components/widget-user-department |
  | Auth Form | @imagina/qblog/_components/auth/form |
  | Auth Login | @imagina/qblog/_components/auth/login |
  | Auth Register | @imagina/qblog/_components/auth/register |
  
## Store VUEX  
- #### States
  - quserAuth.userToken  
  - quserAuth.userId  
  - quserAuth.userData  
  - quserAuth.permissions  
  - quserAuth.settings  
  - quserAuth.departments  
  - quserAuth.authenticated  
  
## Plugins
- #### Auth  
    You can use this plugin, calling `$auth` in the template 
    or `this.$auth` in scripts. Methods:
    - ###### hasAccess('permission-name')
        Validate if logged user has this permission
    - ###### hasSetting('setting-name')
        Validate if logged user has this setting
