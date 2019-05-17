import {Cookies, LocalStorage} from 'quasar'
import config from 'src/config/index'
import http from "axios"
import {remember} from '@imagina/qhelper/_plugins/remember'

export default {
  
  getSettings(data) {

    return new Promise((resolve, reject) => {
        return http.get(config('apiRoutes.profile.departmentsSettings'), {
          params: data
      }).then(response => {
        resolve(response);
      })
        .catch(error => {
          reject(error);
        });
    });
  },
}
