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

export const fullName = (state) => {
  return state.userData.fullName;
};

export const departmentsSelect = (state) => {
  return helper.array.tree(state.departments);
};
