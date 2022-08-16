import { reactive } from '@vue/composition-api';
import baseService from '@imagina/qcrud/_services/baseService.js';
import * as msal from "@azure/msal-browser";

const msalConfig = {
    auth: {
        clientId: "43331c90-0692-47a9-a48f-662f1bbf9c3e",
        authority: "https://login.microsoftonline.com/7e761206-66fa-448b-a3e6-6c0660e38ed5",
        redirectUri: window.location.origin,
        postLogoutRedirectUri: window.location.origin
    },
    cache: {
        cacheLocation: "sessionStorage",
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
    scopes: ["User.Read"]
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
});
const myMSALObj = new msal.PublicClientApplication(msalConfig);

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
            hideLoading();
        } catch (error) {
            setToken(null);
            hideLoading();
            setCancelLogin(true);
        }
        
    }
    function handleResponse(response) {
        if (response) {
            state.username = response.account.username;
        } else {
            selectAccount();
        }
    }
    async function signOut() {
            const logoutRequest = {
                account: myMSALObj.getAccountByUsername(state.username),
            };
    
        return myMSALObj.logoutPopup(logoutRequest);
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
        getCancelLogout,
    }
}