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
        helper.alert.error(error.response.data.errors, "top", false, 2500);
        reject(error.response.data.errors)
      });
    } else {
      helper.alert.error("Network Conection Error", "top");
      reject(false)
    }
  })
}

export const AUTH_TRYAUTOLOGIN = ({commit, dispatch, state}) => {
  return new Promise(async (resolve, reject) => {
    let userToken = await helper.storage.get.item('userToken')
    if (!userToken) return resolve(false)//Close if there isn't token

    //Check if sesion is expired
    let expirationDate = await helper.storage.get.item('expirationDate')
    const now = new Date();
    if (now.getTime >= expirationDate) {
      dispatch("AUTH_LOGOUT");
      return resolve(false)
    }

    //Set user data to store
    let userId = await helper.storage.get.item('userId')
    let userData = await helper.storage.get.item('userData')
    await dispatch('AUTH_SUCCESS', {
      userToken: userToken,
      userId: userId,
      userData: userData
    })
    await dispatch('SET_PERMISSIONS')//Add permissions of user
    await dispatch('SET_SETTINGS')//Add settings of user

    resolve(true)//Resolve
  })
}

export const AUTH_SUCCESS = ({commit, dispatch}, data) => {
  return new Promise(async (resolve) => {
    let roleUser = await helper.storage.get.item('auth.role.id')//Get role form storage
    let departmentUser = await helper.storage.get.item('auth.department.id')//Get department form storage
    //Get timestamp to expirate sesion
    const now = new Date();
    const expirationDate = now.getTime() + ((env('DAYS_EXPIRE_SESSION') * 86400) * 1000)

    //Save user data in storage
    await helper.storage.set('userToken', data.userToken)
    await helper.storage.set('userId', data.userData.id)
    await helper.storage.set('expirationDate', expirationDate)
    await helper.storage.set('userData', data.userData)

    //Set role and departmen in axios
    if (roleUser && departmentUser) {//Config rol and department
      //Set in axios how default params
      axios.defaults.params = {
        setting: {departmentId: departmentUser, roleId: roleUser}
      }
    }

    //Register token by default in axios
    axios.defaults.headers.common['Authorization'] = data.userToken;
    commit('AUTH_SUCCESS', data);//commit userdata in store
    resolve(true)//Resolve
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
    profileServices.auth.logout().then(()=>{
      clearData()
    }).catch(()=>{
      clearData()
    })
  })
}

export const AUTH_UPDATE = ({commit, dispatch}) => {
  return new Promise(async (resolve, reject, state) => {
    //Get userData
    let response = await profileServices.crud.index('apiRoutes.profile.me', {remember: false})
    let userData = response.data.userData
    //Set userData in store and storage
    await helper.storage.set('userData', userData)
    commit('AUTH_USER_DATA', userData)
    resolve(true)
  })
}

export const SET_PERMISSIONS = ({dispatch, commit, state}) => {
  return new Promise(async (resolve) => {
    try {
      const roleId = await helper.storage.get.item('auth.role.id')//Get role selected
      const role = state.userData.roles.find(role => role.id === roleId)//Get role
      const rolePermissions = JSON.parse(JSON.stringify(role.permissions))//Get role permissions
      const userPermissions = (await helper.storage.get.item('userData')).permissions//Get user permissions

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
    let configName = 'apiRoutes.profile.departments'
    profileServices.crud.index(configName, {params: {filter: {}}}).then(response => {
      commit('OBTAINED_DEPARTMENTS', response.data)
      resolve(true)
    }).catch(error => {
      console.error('Error Store fhia getting Departments:', error)
      reject(error)
    })
  })
}
