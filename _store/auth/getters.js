/*
export const someGetter = (state) => {}
*/

export const user = (state) => {
    return state.userData;
};

export const isAuthenticated = (state) => {
    return (state.userToken !== null);
};
