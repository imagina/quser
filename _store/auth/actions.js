//Services
import profileServices from '@imagina/quser/_services/profile/index'

//Plugins
import auth from '@imagina/quser/_plugins/auth'
import {notification} from 'src/plugins/notification'
import {helper} from '@imagina/qhelper/_plugins/helper'

//Features
import axios from 'axios';
import store from 'src/store/index'
import config from 'src/config/index'
import router from 'src/router/index'

export const AUTH_REQUEST = ({commit, dispatch}, authData) => {
  return new Promise(async (resolve, reject) => {
    if (navigator.onLine) {
      profileServices.auth.login(authData.username, authData.password).then((response) => {
        dispatch('AUTH_SUCCESS', response.data.data).then(() => {
          resolve(true)
        }).catch((error) => {
          reject(error)
        });
      }).catch(error => {
        helper.alert.error({message: error.response.data.errors, pos: "top"});
        reject(error.response.data.errors)
      });
    } else {
      helper.alert.error({message: "Network Conection Error", pos: "top"});
      reject(false)
    }
  })
}

export const AUTH_TRYAUTOLOGIN = ({commit, dispatch, state}) => {
  return new Promise(async (resolve, reject) => {
    try {
      let sessionData = await helper.storage.get.item('sessionData')

      //Validate session data
      if (!sessionData) {
        dispatch("AUTH_LOGOUT");//Logout
        return resolve(false)//Close if there isn't token
      }

      //Check if session has expired
      if (helper.timestamp(sessionData.expiresIn) <= helper.timestamp()) {
        dispatch("AUTH_LOGOUT");//Logout
        return resolve(false)
      }

      await dispatch('AUTH_SUCCESS')//Set sesion data from storage
      await dispatch('SET_PERMISSIONS')//Add permissions of user
      await dispatch('SET_SETTINGS')//Add settings of user

      resolve(true)//Resolve
    } catch (error) {
      console.error('[AUTH_TRYAUTOLOGIN] ', error)
      reject(false)
    }
  })
}

export const AUTH_SUCCESS = ({commit, dispatch}, data = false) => {
  return new Promise(async (resolve, reject) => {
    let roleUser = await helper.storage.get.item('auth.role.id')//Get role form storage
    let departmentUser = await helper.storage.get.item('auth.department.id')//Get department form storage
    if (!data) data = await helper.storage.get.item('sessionData')//Find sesion data in storage if not exist

    if (data) {
      await helper.storage.set('sessionData', data)//Save sesion data in storage

      //Set default headers to axios
      axios.defaults.headers.common['Authorization'] = data.userToken;

      //Set default params to axios
      if (roleUser && departmentUser)
        axios.defaults.params.setting = {departmentId: departmentUser, roleId: roleUser}

      commit('AUTH_SUCCESS', data);//commit userdata in store
      resolve(true)//Resolve
    } else {
      dispatch("AUTH_LOGOUT");//Logout
      return reject(false)
    }
  })
}

export const AUTH_LOGOUT = async ({commit, dispatch}) => {
  return new Promise((resolve, reject) => {
    const clearData = async () => {
      await store.dispatch('app/RESET_STORE')//Reset Store
      if (env('PUSHER_ACTIVE') == 'true') notification.leave() //Close pusher
      await helper.storage.restore(config('app.saveStorage.logout'))
      resolve(true)
    }

    //Request to Logout in backend
    profileServices.auth.logout().then(() => {
      clearData()
    }).catch(() => {
      clearData()
    })
  })
}

export const AUTH_UPDATE = ({commit, dispatch, state}) => {
  return new Promise(async (resolve, reject) => {
    //Get userData
    profileServices.crud.index('apiRoutes.quser.me', {refresh: true}).then(async response => {
      let sessionData = await helper.storage.get.item('sessionData')//Get  session Data
      let userData = response.data.userData//Get new user data

      //Update session data in storage
      sessionData.userData = userData
      await helper.storage.set('sessionData', sessionData)

      commit('AUTH_USER_DATA', userData)//update userData
      await dispatch('AUTH_TRYAUTOLOGIN')//Re-login

      resolve(true)
    }).catch(error => {
      console.error('[AUTH_UPDATE] ', error)
      reject(false)
    })
  })
}

export const SET_PERMISSIONS = ({dispatch, commit, state}) => {
  return new Promise(async (resolve) => {
    try {
      const roleId = await helper.storage.get.item('auth.role.id')//Get role selected
      const role = state.userData.roles.find(role => role.id === roleId)//Get role
      const rolePermissions = JSON.parse(JSON.stringify(role.permissions))//Get role permissions
      const sessionData = await helper.storage.get.item('sessionData')//Get session data
      const userPermissions = sessionData.userData.permissions//Get user permissions

      //Merge permissions
      for (const permission in userPermissions) {
        rolePermissions[permission] = userPermissions[permission]
      }

      //Save in store permissions
      commit('SET_PERMISSIONS', rolePermissions)
      resolve(true)//Resolve
    } catch (error) {
      router.push({name: 'auth.logout'})
    }
  })
}

export const SET_SETTINGS = ({dispatch, commit, state}) => {
  return new Promise(async (resolve) => {
    try {
      const departmentId = await helper.storage.get.item('auth.department.id')//Get department selected
      const department = state.userData.departments.find(dep => dep.id === departmentId)//Get department selected
      const roleId = await helper.storage.get.item('auth.role.id')//Get role selected
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
      router.push({name: 'auth.logout'})
    }
  })
}

export const GET_DEPARTMENTS = ({commit, dispatch}) => {
  return new Promise((resolve, reject) => {
    let configName = 'apiRoutes.quser.departments'
    profileServices.crud.index(configName, {params: {filter: {}}}).then(response => {
      commit('OBTAINED_DEPARTMENTS', response.data)
      resolve(true)
    }).catch(error => {
      console.error('[GET_DEPARTMENTS]', error)
      reject(error)
    })
  })
}

export const USER_IMPERSONATE = ({commit, dispatch, state}, userId = false) => {
  if (userId) {
    let params = {
      refresh: true,
      params: {
        userId: state.userId,
        userIdImpersonate: userId
      }
    }

    profileServices.crud.index('apiRoutes.quser.impersonate', params).then(async response => {
      let sessionData = await helper.storage.get.item('sessionData')
      let roleId = await helper.storage.get.item('auth.role.id')
      let departmentId = await helper.storage.get.item('auth.department.id')
      let impersonateToken = response.data.userToken

      //Save original user data
      await helper.storage.set('impersonatorData', {
        sessionData: sessionData,
        roleId: roleId,
        departmentId: departmentId,
      })

      await helper.storage.remove('auth.role.id')//Remove role Id from storage
      await helper.storage.remove('auth.department.id')//Remove department Id from storage

      //AUTH success
      await dispatch('AUTH_SUCCESS', {
        userToken: impersonateToken,
        userData: response.data.userData,
        expiresIn: response.data.expiresIn
      })
      //Redirect to config
      router.push({name: 'app.config'})
    }).catch(error => {
      console.error('[AUTH ACTION] impersonate', error)
      dispatch('USER_LEAVE_IMPERSONATE')
      router.push({name: 'app.config'})
    })
  }
}

export const USER_LEAVE_IMPERSONATE = async ({commit, dispatch, state}) => {
  //Get original user
  let impersonatorData = await helper.storage.get.item('impersonatorData')

  if (impersonatorData) {
    //Request to Logout impersonate user
    profileServices.auth.logout().then(async () => {
      //Remove key "impersonatorData" form storage
      await helper.storage.remove('impersonatorData')
      //set original role Id
      await helper.storage.set('auth.role.id', impersonatorData.roleId)
      //Set original department Id
      await helper.storage.set('auth.department.id', impersonatorData.departmentId)
      //AUTH success
      await dispatch('AUTH_SUCCESS', impersonatorData.sessionData)
      //Redirect to config
      router.push({name: 'app.config'})
    }).catch(async (error) => {
      //Redirect to config
      router.push({name: 'app.config'})
    })
  }
}

export const REFRESH_TOKEN = async ({commit, dispatch, state}) => {
  let sesionData = await helper.storage.get.item('sessionData')

  if (sesionData) {
    let inTenMinutosDate = helper.timestamp() + (60000 * 10)//Current date plus 10 minutes
    let expiresIn = helper.timestamp(sesionData.expiresIn)//Get timestamp expiresIn

    //If token expires in ten minute, refresh
    if (expiresIn <= inTenMinutosDate) {
      //Request to refresh token
      profileServices.crud.index('apiRoutes.quser.refreshToken').then(response => {
        sesionData.expiresIn = response.data.expiresIn//Get expires in
        helper.storage.set('sessionData', sesionData)//Update expiresIn in sessionData
      }).catch(error => {
        console.error('[REFRESH_TOKEN] ', error)
      })
    }
  }
}
