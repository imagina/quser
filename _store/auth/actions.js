import router from 'src/router/index';
import profileService from '@imagina/quser/_services/profile/index';
import auth from '../../_plugins/auth';
import {alert} from '@imagina/qhelper/_plugins/alert';
import {helper} from '@imagina/qhelper/_plugins/helper';
import axios from 'axios';
import config from 'src/config/index'
import store from 'src/store/index'
import profileServices from '@imagina/quser/_services/profile/index'

export const AUTH_REQUEST = async ({commit, dispatch}, authData) => {
  if (navigator.onLine)
    return profileService.auth.login(authData.username, authData.password).then((response) => {
        dispatch('AUTH_SUCCESS',response.data);
    }).catch(error => {
      dispatch("AUTH_ERROR");
    });
  else
    alert.error("Network Conection Error", "top");
}

export const AUTH_TRYAUTOLOGIN = ({commit, dispatch}) => {
  return new Promise((resolve, reject) => {
    helper.storage.get.item('userToken').then(userToken => {
      if (!userToken) {
        resolve(false)
        return
      }

      helper.storage.get.item('expirationDate').then(expirationDate => {
        const now = new Date();
        if (now.getTime >= expirationDate) {
          dispatch("AUTH_LOGOUT");
          resolve(false)
          return
        }

        helper.storage.get.item('userId').then(userId => {
          helper.storage.get.item('userData').then(userData => {
            dispatch('AUTH_SUCCESS', {
              userToken: userToken,
              userId: userId,
              userData: userData
            }).then(response => {
              resolve(true)
            });
          })
        })
      })
    })
  })
}

export const AUTH_SUCCESS = ({commit, dispatch}, data) => {
  return new Promise(async (resolve) => {
    //Save data user in storage
    const now = new Date();
    const expirationDate = now.getTime() + ((env('DAYS_EXPIRE_SESSION') * 86400) * 1000)
    const deparmentSelected = data.userData.departments.length ? data.userData.departments[0].id : 0;
    
    await helper.storage.set('userToken', data.userToken)
    await helper.storage.set('userId', data.userData.id)
    await helper.storage.set('expirationDate', expirationDate)
    await helper.storage.set('depSelected', deparmentSelected) //TODO remove this data
    await helper.storage.set('userData', data.userData)
  
  
    //Register token by default in axios
    axios.defaults.headers.common['Authorization'] = data.userToken;
  
    commit('AUTH_SUCCESS', data);//commit in store userData
    
    await dispatch('SET_ROLE')//Dispatch role selected
    await dispatch('SET_DEPARTMENT')//Dispatch department selected
    await dispatch('SET_PERMISSIONS',data.userData); // merge permissions of role selected and user
    await dispatch('SET_SETTINGS',data.userData); // merge settings of role, department and user
  
    
    //check if user have permission for login in app
    if(auth.hasAccess('profile.api.login')){
      if (router.currentRoute.path == "/auth/login") {
        router.push(data.userData.default_route)
      }
    }else{//Remove data if user have not permission for login
      alert.error("User without access", "top");
      dispatch("AUTH_LOGOUT");
    }
    
    resolve(true)
  })
}

export const AUTH_ERROR = ({commit, dispatch}) => {

  alert.error("Email or password incorrect.", "top");

}

export const AUTH_LOGOUT = async ({commit, dispatch}) => {
  if (navigator.onLine)
    profileService.auth.logout();

  await dispatch("AUTH_CLEAR");
  router.push({name: 'auth.login'});
}

export const AUTH_CLEAR = async ({commit, dispatch}) => {

  let offRqsts = await helper.storage.get.item("offlineRequests");
  let notifications = await helper.storage.get.item("notifications") || [];
  await helper.storage.clear();
  await helper.storage.set('offlineRequests', offRqsts);
  await helper.storage.set('notifications', notifications) ;
  commit('AUTH_LOGOUT');
}

export const SET_DEPARTMENT = ({dispatch, commit, state}, data = false) => {
  return new Promise(async (resolve)=> {
    let nameInCache = 'auth.department.id'
  
    if (data) {
      helper.storage.set(nameInCache, data)
      commit('CHANGE_DEPARTMENT', data)
    } else {
      let departmentId = await helper.storage.get.item(nameInCache)
    
      //If there isn't data, set by default, first role in userData
      if(!departmentId && state.userData.departments.length)
        departmentId = state.userData.departments[0].id
      
      commit('CHANGE_DEPARTMENT', departmentId)
    }
    resolve(true)
  })
}

export const SET_ROLE = ({dispatch, commit, state}, data = false) => {
  return new Promise(async (resolve)=> {
    let nameInCache = 'auth.role.id'
    
    if (data) {
      helper.storage.set(nameInCache, data)
      commit('CHANGE_ROLE', data)
    } else {
      let roleId = await helper.storage.get.item(nameInCache)
      
      //If there isn't data, set by default, first role in userData
      if(!roleId && state.userData.roles.length)
        roleId = state.userData.roles[0].id
      
      commit('CHANGE_ROLE', roleId)
    }
    resolve(true)
  })
}

export const SET_PERMISSIONS = ({dispatch, commit, state}, data = false) => {
  return new Promise(async (resolve)=> {
    let permissions = {};
  let roleId = state.roleId
  let role, userPermissions;
  if (!data){
    role = state.userData.roles.find(role => role.id === roleId);
    userPermissions = state.userData.permissions;
  }else{
    role = data.roles.find(role => role.id === roleId);
    userPermissions = data.permissions;
  }
  let rolePermissions = role.permissions;
  
  for (const permission in userPermissions) {
    rolePermissions[permissions] = userPermissions[permission]
  }
  
  commit('SET_PERMISSIONS', rolePermissions)
  
  resolve(true)
})
}

export const SET_SETTINGS = ({dispatch, commit, state}, data = false) => {
  return new Promise(async (resolve)=> {
  
    let permissions = {};
  let roleId = state.roleId;
  let departmentId = state.departmentId
  let role, department, userSettings;
  
  if(!data) {
    role = state.userData.roles.find(role => role.id === roleId);
    department = state.userData.departments.find(dep => dep.id === departmentId);
    userSettings = state.userData.settings;
  }else{
    role = data.roles.find(role => role.id === roleId);
    department = data.departments.find(dep => dep.id === departmentId);
    userSettings = data.settings;
  }
  
  let departmentSettings = department.settings;
  
  // initializing final Setting with role settings
  let finalSettings = role.settings ? role.settings : [];
  
  // Merging department settings with role settings
  departmentSettings.forEach(departmentSetting => {
    let findSetting = false
    finalSettings.forEach(finalSetting => {
      if(finalSetting.name == departmentSetting.name){
        findSetting = true;
        finalSetting = departmentSetting;
      }
    });
      if(!findSetting){
        finalSettings.push(departmentSetting)
      }
    });
  
  // Merging user settings with role settings
  userSettings.forEach(userSetting => {
    let findSetting = false
    finalSettings.forEach(finalSetting => {
    if(finalSetting.name == userSetting.name){
      findSetting = true;
      finalSetting = userSetting;
    }
  });
    if(!findSetting){
      finalSettings.push(userSetting)
    }
  });
  
  
  commit('SET_SETTINGS', finalSettings)
  
  resolve(true)
})
}

/**
 * GET Branch Office
 *
 * @param commit
 * @param dispatch
 * @returns {Promise<any>}
 * @constructor
 */
export const GET_DEPARTMENTS = ({commit, dispatch}) => {
  let configName = 'profile.departments'
  profileServices.crud.index(configName,{params:{filter:{}}}).then(response => {
    commit('OBTAINED_DEPARTMENTS',response.data)
}).catch(error => {
    console.error('Error Store fhia getting Departments:', error)
})
}
