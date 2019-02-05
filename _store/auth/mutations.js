import axios from 'axios'

export const AUTH_SUCCESS = (state, data) => {
    state.userToken = data.userToken;
    state.userId = data.userId;
    state.userData = data.userData;
};

export const AUTH_LOGOUT = (state) => {
  state.userToken = null;
  state.userId = null;
  state.userData = null;
};

export const SET_PERMISSIONS = (state, permissions) => {
  state.permissions = permissions;
  
};

export const SET_SETTINGS = (state, settings) => {
  state.settings = settings;
  
};

//Set department id
export function CHANGE_DEPARTMENT (state,data) {

    state.departmentId = data
    UpdateAxiosParams(state)
}

//Set role id
export function CHANGE_ROLE (state,data) {
    
    state.roleId = data
    UpdateAxiosParams(state)
}

export function OBTAINED_DEPARTMENTS (state,data) {
  state.departments = data
}
//Update axios default params
function UpdateAxiosParams (state){
    axios.defaults.params = {
        setting :{
            departmentId : state.departmentId,
            roleId : state.roleId
        }
    }
}

