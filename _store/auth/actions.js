//Services
import crud from '@imagina/qcrud/_services/baseService'

//Plugins
import helper from '@imagina/qhelper/_plugins/helper'
import alert from '@imagina/qhelper/_plugins/alert'
import cache from '@imagina/qhelper/_plugins/cache'

//Features
import axios from 'axios'
import config from 'src/config/index'

//Request Login
export const AUTH_REQUEST = ({commit, dispatch, state}, authData) => {
  return new Promise(async (resolve, reject) => {
    let dataRequest = {username: authData.username, password: authData.password}

    //Request login
    crud.post('apiRoutes.quser.authLogin', dataRequest).then(async response => {
      await dispatch('AUTH_SUCCESS', response.data)
      resolve(true)
    }).catch(error => {
      alert.error(error)
      reject(error)
    })
  })
}

//Set user Data
export const AUTH_SUCCESS = ({commit, dispatch, state}, data = false) => {
  return new Promise(async (resolve, reject) => {
    //Validate if is impersonating
    const impersonatorData = await cache.get.item('impersonatorData')
    if (impersonatorData) {
      commit('SET_IMPERSONATE', true)
    } else {
      commit('SET_IMPERSONATE', false)
    }

    //Search sesion data in storage if not exist
    data = data || await cache.get.item('sessionData')

    if (data) {
      commit('AUTH_SUCCESS', data)//commit userdata in store
      await dispatch('SET_ROLE_DEPARTMENT')//Set role and department
      await dispatch('SET_PERMISSIONS')//Set Permissions
      await dispatch('SET_SETTINGS')//Set settings
      //Set default headers to axios
      axios.defaults.headers.common['Authorization'] = data.userToken

      await cache.set('sessionData', data)//Save sesion data in storage
      commit('SET_AUTHENTICATED')
      return resolve(true)//Resolve
    } else {
      console.info('[AUTH_SUCCESS]::LOGOUT')
      dispatch('AUTH_LOGOUT')//Logout
      return reject(false)
    }
  })
}

//Set user role and user department
export const SET_ROLE_DEPARTMENT = ({state, commit}) => {
  return new Promise(async (resolve, reject) => {
    //Search role and department in cache
    let roleUser = await cache.get.item('auth.role.id')
    let departmentUser = await cache.get.item('auth.department.id')

    //If not found in cache, get it from store
    if (!roleUser) roleUser = state.userData.roles[0].id || false
    if (!departmentUser) departmentUser = state.userData.departments[0].id || false

    //Set default params to axios
    axios.defaults.params.setting.departmentId = departmentUser
    axios.defaults.params.setting.roleId = roleUser

    //Save role and department sleected in cache and store
    commit('SET_ROLE_ID', roleUser)
    commit('SET_DEPARTMENT_ID', departmentUser)
    await cache.set('auth.role.id', roleUser)
    await cache.set('auth.department.id', departmentUser)

    resolve({departmentId: departmentUser, roleId: roleUser})//Response
  })
}

//Set permission of user
export const SET_PERMISSIONS = ({dispatch, commit, state}) => {
  return new Promise(async (resolve) => {
    try {
      const roleId = state.selectedRoleId//Get role selected
      const role = state.userData.roles.find(role => role.id === roleId)//Get role
      const rolePermissions = JSON.parse(JSON.stringify(role.permissions))//Get role permissions
      const userPermissions = state.userData.permissions//Get user permissions

      //Merge permissions
      for (const permission in userPermissions) {
        rolePermissions[permission] = userPermissions[permission]
      }

      //Save in store permissions
      commit('SET_PERMISSIONS', rolePermissions)
      resolve(true)//Resolve
    } catch (error) {
    }
  })
}

//Set settings of user
export const SET_SETTINGS = ({dispatch, commit, state}) => {
  return new Promise(async (resolve) => {
    try {
      const departmentId = state.selectedDepartmentId//Get department selected
      const department = state.userData.departments.find(dep => dep.id === departmentId)//Get department selected
      const roleId = state.selectedRoleId//Get role selected
      const role = state.userData.roles.find(role => role.id === roleId)//Get role
      const departmentSettings = department.settings//Get department settings
      const userSettings = state.userData.settings//Get user settings
      const roleSettings = role.settings ? role.settings : []//Get role settings
      let settings = {}//All settings

      //Merge settings
      const mergeSettings = (data) => {
        data.forEach((item) => {
          settings[item.name] = item
        })
      }

      //Merge in order of priority the settings
      mergeSettings(roleSettings)
      mergeSettings(departmentSettings)
      mergeSettings(userSettings)

      //Save in store the settins
      commit('SET_SETTINGS', Object.values(settings))
      resolve(true)//Resolve
    } catch (e) {
    }
  })
}

//Try login
export const AUTH_TRYAUTOLOGIN = ({commit, dispatch, state}) => {
  return new Promise(async (resolve, reject) => {
    try {
      let sessionData = await cache.get.item('sessionData')
      //Validate session data
      if (!sessionData) {
        dispatch('AUTH_LOGOUT')//Logout
        return resolve(false)//Close if there isn't token
      }

      //Check if session has expired
      if (helper.timestamp(sessionData.expiresIn) <= helper.timestamp()) {
        dispatch('AUTH_LOGOUT')//Logout
        return resolve(false)
      }

      await dispatch('AUTH_SUCCESS')//Set sesion data from storage

      resolve(state.authenticated)//Resolve
    } catch (error) {
      console.error('[AUTH_TRYAUTOLOGIN] ', error)
      reject(false)
    }
  })
}

//Logout
export const AUTH_LOGOUT = async ({commit, dispatch, state}) => {
  return new Promise(async resolve => {
    if (state.authenticated)//Request to Logout in backend
      await crud.get('apiRoutes.quser.authLogout').catch(() => {
      })
    await dispatch('app/RESET_STORE', null, {root: true})//Reset Store
    await cache.restore(config('app.saveCache.logout'))//Reset cache
    resolve(true)
  })
}

//Refresh user Data
export const AUTH_UPDATE = ({commit, dispatch, state}) => {
  return new Promise(async (resolve, reject) => {
    if (!state.authenticated) return reject('unauthenticated')
    let params = {refresh: true}

    //Get userData
    crud.index('apiRoutes.quser.me', params).then(async response => {
      let sessionData = await cache.get.item('sessionData')//Get  session Data

      //Update session data in storage
      sessionData.userData = response.data.userData
      await cache.set('sessionData', sessionData)

      commit('AUTH_USER_DATA', sessionData.userData)//update userData
      await dispatch('AUTH_TRYAUTOLOGIN')//Re-login

      resolve(true)
    }).catch(error => {
      console.error('[AUTH_UPDATE] ', error)
      reject(true)
    })
  })
}

//Get departments
export const GET_DEPARTMENTS = ({commit, dispatch}) => {
  return new Promise((resolve, reject) => {
    let configName = 'apiRoutes.quser.departments'
    crud.index(configName, {params: {filter: {}}}).then(response => {
      commit('OBTAINED_DEPARTMENTS', response.data)
      resolve(true)
    }).catch(error => {
      console.error('[GET_DEPARTMENTS]', error)
      reject(error)
    })
  })
}

//Impersonate User
export const USER_IMPERSONATE = ({commit, dispatch, state}, userId = false) => {
  return new Promise(async (resolve, reject) => {
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

      await dispatch('app/REFRESH_PAGE', null, {root: true})
      resolve(true)
    }).catch(error => {
      console.error('[AUTH ACTION] impersonate', error)
      dispatch('USER_LEAVE_IMPERSONATE')
      reject(error)
    })
  })
}

//Leave impersonation
export const USER_LEAVE_IMPERSONATE = ({commit, dispatch, state}) => {
  return new Promise(async (resolve, reject) => {
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

    await dispatch('app/REFRESH_PAGE', null, {root: true})
    resolve(true)
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
      let dataRequest = {username: authData.username}
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
        passwordConfirmation: authData.passwordConfirmation,
        userId: authData.userId,
        token: authData.token
      }
      //Request
      crud.post('apiRoutes.quser.authChanged', dataRequest).then(response => {
        dispatch('AUTH_LOGOUT').then(() => resolve(response)).catch(error => reject(error))
      }).catch(error => reject(error));
    }
  )
}

