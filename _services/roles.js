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
      remember.async("roles"+key, 3600 * 3, () => {
        return http.get(config('apiRoutes.api.api_url') + '/roles', {
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
  }
}
