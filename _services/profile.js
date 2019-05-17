import {Cookies, LocalStorage} from 'quasar'
import config from 'src/config/index'
import http from "axios";
import crud from '@imagina/qhelper/_services/baseService'
import {helper} from "@imagina/qhelper/_plugins/helper";

export default {
  crud,
  update(id, data) {
    //let response = Http.get(Config('api.logout'));
    return new Promise((resolve, reject) => {
      http.put(config('apiRoutes.api.api_url') + '/profile/me', data)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  edit(id) {
    return new Promise((resolve, reject) => {
      http.get(config('apiRoutes.api.api_url') + '/profiles/' + id)
      /*})*/.then(response => {
        resolve(response.data);
      })
        .catch(error => {
          reject(error);
        });
    });
  },

  //Change password
  changePassword(data) {
    return new Promise((resolve, reject) => {
      //Validations
      if (!data) return reject('Data is required')
      let urlApi = config('apiRoutes.profile.changePassword')//Get url from config
      //Request
      http.put(urlApi, {attributes : data}).then(response => {
        resolve(response.data)//Successful response
      }).catch(error => {
        reject(error.response.data.errors)//Failed response
      })
    })
  },
}
