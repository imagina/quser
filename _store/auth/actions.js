//Services
import crud from '@imagina/qcrud/_services/baseService'

//Plugins
import helper from '@imagina/qsite/_plugins/helper'
import alert from '@imagina/qsite/_plugins/alert'
import cache from '@imagina/qsite/_plugins/cache'
import eventBus from '@imagina/qsite/_plugins/eventBus'

//Features
import axios from 'axios'
import config from '@imagina/qsite/_config/master/index'

//Request Login
export const AUTH_REQUEST = ({commit, dispatch, state}, authData) => {
  return new Promise(async (resolve, reject) => {
    let dataRequest = {username: authData.username, password: authData.password}

    //Request login
    crud.post('apiRoutes.quser.authLogin', dataRequest).then(async response => {
      await dispatch('AUTH_SUCCESS', response.data)
      resolve(true)
    }).catch(error => {
      reject(error)
    })
  })
}

//Request login with Social Networks
export const AUTH_SOCIAL_NETWORK = ({dispatch, state}, params) => {
  return new Promise((resolve, reject) => {
    let requestUrl = `apiRoutes.quser.authLoginSocialNetwork`
    let requestParams = {attributes: {token: params.token}, type: params.type}

    crud.post(requestUrl, requestParams).then(async response => {
      await dispatch('AUTH_SUCCESS', response.data)
      resolve(true)
    }).catch(error => {
      console.warn(error)
      reject(error)
    })
  })
}

//Set user Data
export const AUTH_SUCCESS = ({commit, dispatch, state}, data = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      //Validate if is impersonating
      const impersonatorData = await cache.get.item('impersonatorData')
      commit('SET_IMPERSONATE', (impersonatorData ? true : false))//Set status impersonate

      //Search sesion data in storage if not exist
      data = data || await cache.get.item('sessionData')

      if (data) {
        commit('AUTH_SUCCESS', data)//commit userdata in store
        await dispatch('SET_ROLE_DEPARTMENT')//Set role and department
        await dispatch('SET_PERMISSIONS')//Set Permissions
        await dispatch('SET_SETTINGS')//Set settings
        //Set default headers to axios
        axios.defaults.headers.common['Authorization'] = data.userToken

        await cache.set('sessionData', data)//Save session data in storage
        commit('SET_AUTHENTICATED')
        return resolve(true)//Resolve
      } else {
        console.info('[AUTH_SUCCESS]::LOGOUT')
        dispatch('AUTH_LOGOUT')//Logout
        return reject(false)
      }
    } catch (e) {
      console.error('[AUTH SUCCESS] ', e)
      reject(e)
    }
  })
}

//Set user role and user department
export const SET_ROLE_DEPARTMENT = ({state, commit, getters}, params = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!config('app.forceRoleAndDepartment')) return resolve(true)
      let roles = getters['getRolesField']()
      let departments = getters['getDepartmentsField']()

      //Get role and department from params
      let roleUser = params.roleId || false
      let departmentUser = params.departmentId || false

      //If no exist role and department search it in cache
      if (!roleUser && !params.reset) roleUser = await cache.get.item('auth.role.id')
      if (!departmentUser && !params.reset) departmentUser = await cache.get.item('auth.department.id')

      //If not found in cache, get it from store
      if (!roleUser && !params.reset) roleUser = state.userData.roles[0].id || false
      if (!departmentUser && !params.reset) departmentUser = state.userData.departments[0].id || false

      //Compare roleSelected with user roles
      if (roles.indexOf(roleUser) == -1) roleUser = roles[0]
      //Compare departmentSelected with user department
      if (departments.indexOf(departmentUser) == -1) departmentUser = departments[0]

      //Set default params to axios
      axios.defaults.params.setting.departmentId = departmentUser
      axios.defaults.params.setting.roleId = roleUser

      //Save role and department sleected in cache and store
      commit('SET_ROLE_ID', roleUser)
      commit('SET_DEPARTMENT_ID', departmentUser)
      await cache.set('auth.role.id', roleUser)
      await cache.set('auth.department.id', departmentUser)

      resolve({departmentId: departmentUser, roleId: roleUser})//Response
    } catch (e) {
      console.error('[AUTH SET ROLE] ', e)
      reject(e)
    }
  })
}

//Set permission of user
export const SET_PERMISSIONS = ({dispatch, commit, state}) => {
  return new Promise(async (resolve, reject) => {
    try {
      let permissions = []//Default data

      //Set global permissions
      if (config('app.forceRoleAndDepartment')) {
        const roleId = state.selectedRoleId//Get role selected
        const role = state.userData.roles.find(role => role.id === roleId)//Get role
        const rolePermissions = JSON.parse(JSON.stringify(role.permissions))//Get role permissions
        const userPermissions = state.userData.permissions//Get user permissions

        //Merge permissions
        permissions = {...rolePermissions, ...userPermissions}
      } else {//Set all permissions of user
        permissions = state.userData.allPermissions
      }

      //Save in store permissions
      commit('SET_PERMISSIONS', permissions)
      resolve(true)//Resolve
    } catch (error) {
      console.error('[AUTH SET PERMISSIONS] ', error)
      reject(error)
    }
  })
}

//Set settings of user
export const SET_SETTINGS = ({dispatch, commit, state}) => {
  return new Promise(async (resolve, reject) => {
    try {
      let settings = {}//All settings
      //Set global settings
      if (config('app.forceRoleAndDepartment')) {
        const departmentId = state.selectedDepartmentId//Get department selected
        const department = state.userData.departments.find(dep => dep.id === departmentId)//Get department selected
        const roleId = state.selectedRoleId//Get role selected
        const role = state.userData.roles.find(role => role.id === roleId)//Get role
        const departmentSettings = department.settings//Get department settings
        const userSettings = state.userData.settings//Get user settings
        const roleSettings = role.settings ? role.settings : []//Get role settings

        //Merge settings
        const mergeSettings = (data) => {
          data.forEach(item => settings[item.name] = item['value'])
        }

        //Merge in order of priority the settings
        mergeSettings(roleSettings)
        mergeSettings(departmentSettings)
        mergeSettings(userSettings)

        settings = Object.values(settings)
      } else {//Srt all settings
        settings = state.userData.allSettings
      }
      //Save in store the settins
      commit('SET_SETTINGS', settings)
      resolve(true)//Resolve
    } catch (e) {
      console.error('[AUTH SET SETTINGS] ', e)
      reject(e)
    }
  })
}

//Try login
export const AUTH_TRYAUTOLOGIN = ({commit, dispatch, state}) => {
  return new Promise(async (resolve, reject) => {
    try {
      let sessionData = await cache.get.item('sessionData')
      //Validate session data
      if (!sessionData || !sessionData.userData || (helper.timestamp(sessionData.expiresIn) <= helper.timestamp())) {
        dispatch('AUTH_LOGOUT')//Logout
        return resolve(false)//Close if there isn't token
      }
      await dispatch('AUTH_UPDATE').catch(error => {
        dispatch('AUTH_LOGOUT')//Logout
        return resolve(false)
      })//Update user data
      resolve(state.authenticated)//Resolve
    } catch (error) {
      console.error('[AUTH_TRYAUTOLOGIN] ', error)
      reject(false)
    }
  })
}

//Refresh user Data
export const AUTH_UPDATE = ({commit, dispatch, state}) => {
  return new Promise(async (resolve, reject) => {
    try {
      let sessionData = await cache.get.item('sessionData')//Get  session Data
      //Validate session data
      if (!sessionData) {
        dispatch('AUTH_LOGOUT')//Logout
        return resolve(false)//Close if there isn't token
      }

      //Set user token to axios
      axios.defaults.headers.common['Authorization'] = sessionData.userToken
      let params = {refresh: true}//Request params

      //Get userData
      crud.index('apiRoutes.quser.me', params).then(async response => {
        if (response.status != 200) return reject(true)//Logout
        sessionData.userData = response.data.userData//Update userData of sessiondata
        await cache.set('sessionData', sessionData)//Update sessionData in cache
        await dispatch('AUTH_SUCCESS')//Auth success

        resolve(true)
      }).catch(error => {
        console.error('[AUTH_UPDATE] ', error)
        reject(true)
      })
    } catch (e) {
      console.error('[AUTH UPDATE] ', e)
      reject(e)
    }
  })
}

//Logout
export const AUTH_LOGOUT = async ({commit, dispatch, state}) => {
  return new Promise(async (resolve, reject) => {
    try {
      //Request to Logout in backend
      if (state.authenticated) {
        await crud.get('apiRoutes.quser.authLogout').catch(error => {
          console.error(error)
        })
      }
      await dispatch('qsiteApp/RESET_STORE', null, {root: true})//Reset Store
      await cache.restore(config('app.saveCache.logout'))//Reset cache
      resolve(true)
    } catch (e) {
      console.error('[AUTH LOGOUT] ', e)
      reject(e)
    }
  })
}

//Get departments
export const GET_DEPARTMENTS = ({commit, dispatch}) => {
  return new Promise((resolve, reject) => {
    try {
      let configName = 'apiRoutes.quser.departments'
      crud.index(configName, {params: {filter: {}}}).then(response => {
        commit('OBTAINED_DEPARTMENTS', response.data)
        resolve(true)
      }).catch(error => {
        console.error('[GET_DEPARTMENTS]', error)
        reject(error)
      })
    } catch (e) {
      console.error('[GET DEPARTMENTS] ', e)
      reject(e)
    }
  })
}

//Impersonate User
export const USER_IMPERSONATE = ({commit, dispatch, state}, userId = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId) return reject('User Id is required')
      let params = {
        refresh: true,
        params: {
          userId: state.userId,
          userIdImpersonate: userId
        }
      }

      crud.index('apiRoutes.quser.impersonate', params).then(async response => {
        let sessionData = await cache.get.item('sessionData')
        let roleId = await cache.get.item('auth.role.id')
        let departmentId = await cache.get.item('auth.department.id')
        let impersonateToken = response.data.userToken

        //Save original user data
        await cache.set('impersonatorData', {
          sessionData: sessionData,
          roleId: roleId,
          departmentId: departmentId,
        })

        await cache.remove('auth.role.id')//Remove role Id from storage
        await cache.remove('auth.department.id')//Remove department Id from storage

        //AUTH success
        await dispatch('AUTH_SUCCESS', {
          userToken: impersonateToken,
          userData: response.data.userData,
          expiresIn: response.data.expiresIn
        })

        await dispatch('qsiteApp/REFRESH_PAGE', null, {root: true})
        resolve(true)
      }).catch(error => {
        console.error('[AUTH ACTION] impersonate', error)
        dispatch('USER_LEAVE_IMPERSONATE')
        reject(error)
      })
    } catch (e) {
      console.error('[USER IMPERSONATE] ', e)
      reject(e)
    }
  })
}

//Leave impersonation
export const USER_LEAVE_IMPERSONATE = ({commit, dispatch, state}) => {
  return new Promise(async (resolve, reject) => {
    try {
      //Get original user
      let impersonatorData = await cache.get.item('impersonatorData')
      if (!impersonatorData) return reject(false)

      //Request to Logout impersonate user
      await crud.get('apiRoutes.quser.authLogout').catch(() => {
      })
      //Remove key "impersonatorData" form storage
      await cache.remove('impersonatorData')
      //set original role Id
      await cache.set('auth.role.id', impersonatorData.roleId)
      //Set original department Id
      await cache.set('auth.department.id', impersonatorData.departmentId)
      //AUTH success
      await dispatch('AUTH_SUCCESS', impersonatorData.sessionData)

      await dispatch('qsiteApp/REFRESH_PAGE', null, {root: true})
      resolve(true)
    } catch (e) {
      console.error('[USER LEAVE IMPERSONATE] ', e)
      reject(e)
    }
  })
}

//Refresh user token
export const REFRESH_TOKEN = async ({commit, dispatch, state}) => {
  let sesionData = await cache.get.item('sessionData')

  if (sesionData) {
    let inTenMinutosDate = helper.timestamp() + (60000 * 10)//Current date plus 10 minutes
    let expiresIn = helper.timestamp(sesionData.expiresIn)//Get timestamp expiresIn

    //If token expires in ten minute, refresh
    if (expiresIn <= inTenMinutosDate) {
      //Request to refresh token
      crud.index('apiRoutes.quser.refreshToken').then(response => {
        sesionData.expiresIn = response.data.expiresIn//Get expires in
        cache.set('sessionData', sesionData)//Update expiresIn in sessionData
      }).catch(error => {
        console.error('[REFRESH_TOKEN] ', error)
      })
    }
  }
}

//Reset password request
export const RESET_PASSWORD_REQUEST = ({commit, dispatch}, authData) => {
  return new Promise(async (resolve, reject) => {
      //Request Data
      let dataRequest = {email: authData.username}
      //Request
      crud.post('apiRoutes.quser.authReset', dataRequest).then(response => {
        dispatch('AUTH_LOGOUT').then(() => resolve(true)).catch(error => reject(error))
      }).catch(error => reject(error))
    }
  )
}

//Change password
export const CHANGED_PASSWORD_REQUEST = ({commit, dispatch}, authData) => {
  return new Promise(async (resolve, reject) => {
      //Request Data
      let dataRequest = {
        password: authData.password,
        password_confirmation: authData.passwordConfirmation,
        userId: authData.userId,
        code: authData.token
      }
      //Request
      crud.post('apiRoutes.quser.authChanged', dataRequest).then(response => {
        dispatch('AUTH_LOGOUT').then(() => resolve(response)).catch(error => reject(error))
      }).catch(error => reject(error));
    }
  )
}

//Open modal sesion
export const VALIDATE_SESION = ({commit, dispatch, state}, params = {}) => {
  return new Promise(resolve => {
    if (state.authenticated) return resolve(true)
    params = params || {}
    //Emit event to open modal login
    eventBus.$emit(params.listenEventName || 'open-auth-login')
    //Watch callback login
    eventBus.$on('auth-callback', () => resolve(true))
  })
}

