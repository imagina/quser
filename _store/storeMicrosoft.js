import { reactive } from 'vue';
import baseService from 'modules/qcrud/_services/baseService.js';
import * as msal from "@azure/msal-browser";
import { store } from "src/plugins/utils"

const msalConfig = {
    auth: {
        clientId: store.getSetting('isite::microsoftClientId'),
        authority: store.getSetting('iprofile::microsoftAuthUrl'),
        redirectUri: window.location.origin,
        postLogoutRedirectUri: window.location.origin
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case msal.LogLevel.Error:
                        return;
                    case msal.LogLevel.Info:
                        return;
                    case msal.LogLevel.Verbose:
                        return;
                    case msal.LogLevel.Warning:
                        return;
                }
            }
        },
        allowRedirectInIframe: true,
    }
};

const loginRequest = {
    scopes: store.getSetting('iprofile::microsoftScopeLogin')
};


const tokenRequest = {
    scopes: ["User.Read", "Mail.Read"],
    forceRefresh: false
};

const state = reactive({
    msalConfig,
    loginRequest,
    tokenRequest,
    username: null,
    token: null,
    loading: false,
    cancelLogin: true,
    cancelLogout: false,
    dataLogin: {},
});
const myMSALObj = new msal.PublicClientApplication(msalConfig);
await myMSALObj.initialize()
export default function storeMicrosoft() {
    function getMsalConfig() {
        return state.msalConfig;
    }
    function getLoginRequest() {
        return state.loginRequest;
    }
    function getTokenRequest() {
        return state.tokenRequest;
    }
    function getCancelLogin() {
        return state.cancelLogin;
    }
    function setCancelLogin(value) {
        state.cancelLogin = value;
    }
    async function signIn() {
        try {
            setCancelLogin(false);
            showLoading();
            const response = await myMSALObj.loginPopup(loginRequest);
            handleResponse(response);
            setToken(response.accessToken);
            const refreshtoken = `${response.account.homeAccountId}-login.windows.net-refreshtoken-${msalConfig.auth.clientId}----`;
            const sessionRefreshtoken = JSON.parse(localStorage.getItem(refreshtoken));
            response.refresh_token = sessionRefreshtoken.secret || null,
            setDataLogin(response);
            hideLoading();
        } catch (error) {
            console.log(error);
            setToken(null);
            hideLoading();
            setCancelLogin(true);
            setDataLogin({});
        }

    }
    function handleResponse(response) {
        if (response) {
            setUsername(response.account.username);

        } else {
            selectAccount();
        }
    }
    function setUsername(value) {
        state.username = value
        localStorage.setItem('userName', value);
    }
    async function signOut() {
        try {
            if(!state.username) return;
            await ssoSilent();
            const userName = myMSALObj.getAccountByUsername(state.username);
            if(!userName) return;
            const logoutRequest = {
                account: userName,
                postLogoutRedirectUri: `${window.location.origin}#/auth/logout/`
            };
            await myMSALObj.logoutRedirect(logoutRequest);
        } catch (error) {
            console.log(error);
        }
    }
    async function ssoSilent() {
        try {
            return await myMSALObj.ssoSilent(loginRequest) || null;
        } catch (err) {
            if (err.name === 'InteractionRequiredAuthError') {
                localStorage.removeItem('socialType');
                localStorage.removeItem('userName');
            }
        }
    }
    function selectAccount() {
        const currentAccounts = myMSALObj.getAllAccounts();
        if (currentAccounts.length === 0) {
            return;
        } else if (currentAccounts.length > 1) {
            // Add choose account code here
            console.warn("Multiple accounts detected.");
        } else if (currentAccounts.length === 1) {
            state.username = currentAccounts[0].username;
        }
    }
    function setToken(token) {
        state.token = token;
    }
    function getToken() {
        return state.token;
    }
    function getAuthProvider() {
        baseService.index('apiRoutes.quser.authProviders',
            {
                refresh: true,
            }).then((response) => {
                console.log(response);
            }).catch((err) => {
                console.log(err);
            });
    }
    function getTokenPopup(request) {

        request.account = myMSALObj.getAccountByUsername(username);

        return myMSALObj.acquireTokenSilent(request)
            .catch(error => {
                console.warn("silent token acquisition fails. acquiring token using popup");
                if (error instanceof msal.InteractionRequiredAuthError) {
                    // fallback to interaction when silent call fails
                    return myMSALObj.acquireTokenPopup(request)
                        .then(tokenResponse => {
                            console.log(tokenResponse);
                            return tokenResponse;
                        }).catch(error => {
                            console.error(error);
                        });
                } else {
                    console.warn(error);
                }
            });
    }
    function hideLoading() {
        state.loading = false;
    }
    function showLoading() {
        state.loading = true;
    }
    function getLoading() {
        return state.loading;
    }
    function getAllAccounts() {
        return myMSALObj.getAccountByUsername(state.username);
    }
    function setDataLogin(data, refreshToken) {
        state.dataLogin = data;
    }
    function getDataLogin() {
        return state.dataLogin;
    }
    return {
        getMsalConfig,
        getLoginRequest,
        getTokenRequest,
        signIn,
        signOut,
        selectAccount,
        getToken,
        setToken,
        handleResponse,
        getAuthProvider,
        getTokenPopup,
        hideLoading,
        showLoading,
        getLoading,
        getCancelLogin,
        getAllAccounts,
        setDataLogin,
        getDataLogin,
        setUsername,
    }
}
