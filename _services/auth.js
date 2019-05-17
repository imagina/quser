import {Cookies, LocalStorage} from 'quasar'
import Config from 'src/config/index'
import Http from "axios";
import {helper} from '@imagina/qhelper/_plugins/helper'

export default {

  logout() {
    //let response = Http.get(Config('api.logout'));
    return new Promise((resolve, reject) => {
      Http.get(Config('apiRoutes.api.logout_url'))
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          console.log('Logout error: ', error);
          reject(error);
        });
    });
  },

  login(username, password) {
    let data = {
      username,
      password
    };

    // We merge grant type and client secret stored in configuration
    Object.assign(data, Config('auth.auth'));
    return new Promise((resolve, reject) => {
      Http.post(Config('apiRoutes.api.login_url'), data)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.log('OAUTH Authentication error: ', error);
          reject(error);
        });
    });
  },

  currentUser() {
    helper.storage.get.item('userToken').then(response => {
      if (response) {
        helper.storage.get.item('userData').then(responseData => {
          let userData = responseData;
          if (userData)
            return new Promise((resolve) => {
              resolve(userData);
            })
          else
            return new Promise((resolve, reject) => {
              Http.get(Config('apiRoutes.api.current_user_url'))
                .then(response => {
                  resolve(response);
                })
                .catch(error => {
                  if (error.response && (error.response.status === 401 || error.response.status === 429)) {
                    this.logout()
                  }
                  reject(error)
                })
            })
        })
      }
      return new Promise(resolve => resolve(null))
    })
  },

  getAuthHeader() {
    if (helper.has('access_token')) {
      let access_token = this.getItem('access_token')
      return Config('auth.oauth_type') + ' ' + access_token
    }
    return null
  },

  getItem(key) {
    if (Config('auth.default_storage') === 'LocalStorage') {
      return helper.get.item(key)
    }
    return helper.get(key)
  },

  storeSession(data) {
    let hourInMilliSeconds = 86400
    let time = data.expires_in / hourInMilliSeconds

    if (Config('auth.default_storage') === 'LocalStorage') {
      helper.set('access_token', data.access_token)
      helper.set('refresh_token', data.access_token)
      //Save user data.
      helper.set('userdata', data.userdata)
    }
    //By default we'll be working only with LocalStorage
    //Are we going to implement more storages?
  },
  
  
}
