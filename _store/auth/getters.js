/*
export const someGetter = (state) => {}
*/
import array from '@imagina/qsite/_plugins/array'
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

export const hasAccess = (state) => (can, params = {}) => {
  let permissions = state.permissions//Get default permissions

  //Get role permissions
  if (params && params.roleId) {
    //Search role
    let role = state.userData ?
      state.userData.roles.find(role => parseInt(role.id) == parseInt(params.roleId)) : false
    //Set role permissions
    permissions = role ? role.permissions : []
  }

  //Validate params
  if (!can || !permissions) return true

  //Validate permission
  if (permissions && Object.keys(permissions).length)
    return permissions[can] || false
  else return false
}

export const hasSetting = (state) => (name) => {
  return state.settings[name] || false
}

export const getRolesField = (state) => (field = 'id') => {
  let roles = state.userData.roles
  let response = []

  roles.forEach(item => {
    response.push(item[field])
  })

  return response
}

export const getDepartmentsField = (state) => (field = 'id') => {
  let departments = state.userData.departments
  let response = []

  departments.forEach(item => {
    response.push(item[field])
  })

  return response
}
