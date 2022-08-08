import { reactive } from '@vue/composition-api';
import baseService from '@imagina/qcrud/_services/baseService.js';
import * as msal from "@azure/msal-browser";
import Vue from "vue";
import Vuex from 'vuex';

const coreStores = require('@imagina/qsite/_config/master/application/stores').default;
const stores = new Vuex.Store({modules: coreStores, strict: process.env.DEV});

const msalConfig = {
    auth: {
        clientId: "9565fd41-baa6-41ee-8e43-50cc4df0e1a5",
        authority: "https://login.microsoftonline.com/e5512bdb-4fa6-4e52-8f2a-af3270f25f34",
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
        const prototype = Vue.prototype;
        try {
            const response = await myMSALObj.loginPopup(loginRequest);
            handleResponse(response);
            setToken(response.accessToken);
            await stores.dispatch('quserAuth/AUTH_SOCIAL_NETWORK', {
                type: 'microsoft',
                token: state.token
            });
        } catch (error) {
            setToken(null);
            prototype.$alert.error(prototype.$tr('isite.cms.message.errorRequest'))
        }
        
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
    }
}