import { reactive } from '@vue/composition-api';
import baseService from '@imagina/qcrud/_services/baseService.js';
import * as msal from "@azure/msal-browser";
import store from '@imagina/quser/_store/index.js'
console.log(store.auth.actions);

const msalConfig = {
    auth: {
        clientId: "9565fd41-baa6-41ee-8e43-50cc4df0e1a5",
        authority: "https://login.microsoftonline.com/e5512bdb-4fa6-4e52-8f2a-af3270f25f34",
        redirectUri: "http://localhost:8080",
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
                        console.error(message);
                        return;
                    case msal.LogLevel.Info:
                        console.info(message);
                        return;
                    case msal.LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case msal.LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            }
        }
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
    async function signIn() {
        const response = await myMSALObj.loginPopup(loginRequest);
        setToken(response.accessToken);
    }
    function handleResponse(response) {
        if (response) {
            state.username = response.account.username;
        } else {
            selectAccount();
        }
    }
    function signOut() {
        const logoutRequest = {
            account: myMSALObj.getAccountByUsername(state.username),
            postLogoutRedirectUri: msalConfig.auth.redirectUri,
            mainWindowRedirectUri: msalConfig.auth.redirectUri
        };
    
        myMSALObj.logoutPopup(logoutRequest);
        state.token = null;
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
    }
}