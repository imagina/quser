export const AUTH_SUCCESS = (state, data) => {
	state.userToken = data.userToken;
	state.userId = data.userData.id;
	state.userData = data.userData;
};

export const AUTH_USER_DATA = (state, data) => {
	state.userData = data;
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

export const RESET = (state, settings) => {
	state.userToken = null
	state.userId = null
	state.userData = null
	state.permissions = null
	state.settings = null
	state.departments = []
};

export function OBTAINED_DEPARTMENTS(state, data) {
	state.departments = data
}


