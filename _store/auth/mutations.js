
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
