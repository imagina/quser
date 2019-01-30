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

//Set department id
export function CHANGE_DEPARTMENT (state,data) {
    let userData = state.userData
    let departmentId = data

    //If there isn't data, set by default, first department in userData
    if(!data && userData.departments.length)
        departmentId = userData.departments[0].id

    state.departmentId = departmentId
    UPDATE_AXIOS_PARAMS(state)
}

//Set role id
export function CHANGE_ROLE (state,data) {
    let userData = state.userData
    let roleId = data

    //If there isn't data, set by default, first role in userData
    if(!data && userData.roles.length)
        roleId = userData.roles[0].id

    state.roleId = roleId
    UPDATE_AXIOS_PARAMS(state)
}

//Update axios default params
function UPDATE_AXIOS_PARAMS (state){
    axios.defaults.params = {
        setting :{
            departmentId : state.departmentId,
            roleId : state.roleId
        }
    }
}