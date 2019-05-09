/*
export const someGetter = (state) => {}
*/
import {helper} from '@imagina/qhelper/_plugins/helper'

export const user = (state) => {
    return state.userData;
};

export const isAuthenticated = (state) => {
  return (state.userToken !== null);
};

export const getPermissions = (state) => {
  return state.permissions;
};

export const getSettings = (state) => {
  return state.settings;
};

export const getDepartmentBy = (state) => (field,value) => {
  let results = state.departments.filter(department => department[field] == value)
  return results
};

export const fullName = (state) => {
  let userData = state.userData
  return (userData && userData.fullName) ? userData.fullName : '';
};

export const departmentsSelect = (state) => {
  return helper.array.tree(state.departments);
};

export const userRolesSelect = (state) => {
  let userData = state.userData
  let roles = userData ? userData.roles : []
  return helper.array.select(roles)
}

export const userDepartmentsSelect = (state) => {
  let userData = state.userData
  let departments = userData ? userData.departments : []
  return helper.array.tree(departments)
}
