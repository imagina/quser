/*
export const someGetter = (state) => {}
*/
import array from '@imagina/qhelper/_plugins/array'
import cloneDeep from 'lodash.clonedeep'

export const getState = (state) => (name) => {
  return cloneDeep(state[name] || undefined)
}

export const user = (state) => {
  return state.userData;
};

export const isAuthenticated = (state) => {
  return state.authenticated;
};

export const getPermissions = (state) => {
  return state.permissions;
};

export const getSettings = (state) => {
  return state.settings;
};

export const getDepartmentBy = (state) => (field, value) => {
  let results = state.departments.filter(department => department[field] == value)
  return results
};

export const fullName = (state) => {
  let userData = state.userData
  return (userData && userData.fullName) ? userData.fullName : '';
};

export const departmentsSelect = (state) => {
  return array.tree(state.departments);
};

export const userRolesSelect = (state) => {
  let userData = state.userData
  let roles = userData ? userData.roles : []
  return array.tree(roles, {label: 'name', id: 'id'})
}

export const userDepartmentsSelect = (state) => {
  let userData = state.userData
  let departments = userData ? userData.departments : []
  return array.tree(departments)
}

export const hasAccess = (state) => (can) => {
  if(!can) return true
  let userPermissions = state.permissions
  //Validate permission
  if(userPermissions && Object.keys(userPermissions).length){
    let access = userPermissions[can]
    return access || false
  }else{
    return false
  }
}

export const hasSetting = (state) => (name) => {
  let userSettings = state.settings
  let setting = userSettings.find(setting => setting.name === name)
  return setting || false
}
