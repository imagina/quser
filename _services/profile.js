import {Cookies, LocalStorage} from 'quasar'
import config from '../../../../src/config/index'
import http from "axios";

export default {
  update(id, data) {
    //let response = Http.get(Config('api.logout'));
    return new Promise((resolve, reject) => {
      http.put(config('api.api_url') + '/profiles/' + id, data)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  edit(id) {
    return new Promise((resolve, reject) => {
      http.get(config('api.api_url') + '/profiles/' + id)
      /*})*/.then(response => {
        resolve(response.data);
      })
        .catch(error => {
          reject(error);
        });
    });
  }
}
