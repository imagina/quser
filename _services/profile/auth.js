import {Cookies, LocalStorage} from 'quasar'
import config from 'src/config/index'
import Http from "axios";
import {helper} from '@imagina/qhelper/_plugins/helper'

export default {
  
  
  
  logout() {
    //let response = Http.get(Config('api.logout'));
    return new Promise((resolve, reject) => {
      Http.get(config('apiRoutes.profile.authLogout'))
      .then(response => {
      resolve(response);
    }).catch(error => {
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
    Object.assign(data, config('apiRoutes.profile.authLogin'));

    return new Promise((resolve, reject) => {
      Http.post(config('apiRoutes.profile.authLogin'), data)
      .then((response) => {
      resolve(response);
    }).catch((error) => {
        console.log('OAUTH Authentication error: ', error);
      reject(error);
      });
    });
  },
  
  
  getAuthHeader() {
    if (helper.has('access_token')) {
      let access_token = this.getItem('access_token')
      return config('auth.oauth_type') + ' ' + access_token
    }
    return null
  },
  


}
