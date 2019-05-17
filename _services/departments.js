import {Cookies, LocalStorage} from 'quasar'
import config from 'src/config/index'
import http from "axios"
import {remember} from '@imagina/qhelper/_plugins/remember'

export default {

  index(filter, take, page, fields, include) {

    filter = JSON.stringify(filter);
    let key = ":"+JSON.stringify(filter + take + page + fields + include);
    key = key==":null" ? "" : key;
    return new Promise((resolve, reject) => {
      remember.async("departments"+key, 3600 * 3, () => {
        return http.get(config('apiRoutes.api.api_url') + '/departments', {
          params: {
            filter: filter,
            take: take,
            page: page,
            fields: fields,
            include: include
          }
       })
      }).then(response => {
        resolve(response);
      })
        .catch(error => {
          reject(error);
        });
    });
  },


  show(id,filter, fields, include) {
    filter = JSON.stringify(filter);
    let key = JSON.stringify(filter + fields + include + id);
    return new Promise((resolve, reject) => {
      //remember.async(key, 3600 * 3, () => {
        return http.get(config('apiRoutes.api.api_url') + '/departments/' + id, {
          params: {
            filter: filter,
            fields: fields,
            include: include
          }
       /* })*/
      }).then(response => {
        resolve(response.data);
      })
        .catch(error => {
          reject(error);
        });
    });
  },

  update(data,id) {
    return new Promise((resolve, reject) => {
      http.put(config('apiRoutes.api.api_url') + '/departments/'+id, data)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  create(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      http.post(config('apiRoutes.api.api_url') + '/departments', data)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  delete(id) {
    return new Promise((resolve, reject) => {
      http.delete(config('apiRoutes.api.api_url') + '/departments/'+id)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  getSettings(data) {

    return new Promise((resolve, reject) => {
        return http.get(config('apiRoutes.api.api_url') + '/departments/settings', {
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
