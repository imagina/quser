export const AUTH_SUCCESS = (state, data) => {
  if(data?.userData){
    state.userData = {
      ...data.userData,
      fullName: `${data.userData.firstName} ${data.userData.lastName}`,
    }
    state.permissions = data.userData.permissions
    state.userId = data.userData.id
    state.organizations = data.userData.organizations || []
  }
  state.userToken = data?.userToken || state.userToken,
  state.refreshToken = data?.refreshToken || state.refreshToken
  state.expiresIn = data?.expiresIn || state.expiresIn
  state.authenticated = true
}


export const AUTH_REFRESH = (state, data) => {
  state.userToken = data.userToken
  state.refreshToken = data.refreshToken
  state.expiresIn = data.expiresIn
  state.authenticated = true
}


export const SET_ROLE_ID = (state, data) => {
  state.selectedRoleId = data
}

export const SET_DEPARTMENT_ID = (state, data) => {
  state.selectedDepartmentId = data
}

export const SET_PASSWORD_CHANGE = (state, data) => {
  state.shouldChangePassword = data
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
  state.organizations = []
}

export function OBTAINED_DEPARTMENTS(state, data) {
  state.departments = data
}

export const SET_ORGANIZATION = (state, data) => {
  state.organizationId = data
}

export const SET_REFRESHING = (state, data) => {
  state.isRefreshing = data
}
