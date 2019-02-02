/*
export const someGetter = (state) => {}
*/

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

export const getFullName = (state) => {
  return state.userData.fullName;
};

