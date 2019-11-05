export const AUTH_SUCCESS = (state, data) => {
  state.userData = data.userData
  state.userToken = data.userToken
  state.userId = data.userData.id
  state.authenticated = true
}

export const SET_ROLE_ID = (state, data) => {
  state.selectedRoleId = data
}

export const SET_DEPARTMENT_ID = (state, data) => {
  state.selectedDepartmentId = data
}

export const SET_AUTHENTICATED = (state, data = true) => {
  state.authenticated = data
}

export const SET_IMPERSONATE = (state, data = true) => {
  state.impersonating = data
}

export const AUTH_LOGOUT = (state) => {
  state.userToken = null
  state.userId = null
  state.userData = null
  state.authenticated = false
}

export const SET_PERMISSIONS = (state, permissions) => {
  state.permissions = permissions
}

export const SET_SETTINGS = (state, settings) => {
  state.settings = settings
}

export const RESET = (state, settings) => {
  state.userToken = null
  state.userId = null
  state.userData = null
  state.permissions = null
  state.settings = null
  state.departments = []
  state.selectedRoleId = false
  state.selectedDepartmentId = false
  state.authenticated = false
  state.impersonating = false
}

export function OBTAINED_DEPARTMENTS (state, data) {
  state.departments = data
}




