import {Cookies, LocalStorage} from 'quasar'
import {helper} from '@imagina/qhelper/_plugins/helper';

class Remember {

  constructor() {

  }

  /*Return data in cache*/
  sync(key, seconds, callback) {
    helper.storage.get.item(key).then(response => {
      let data = response

      let difference = data ? this.timestamp() - data.updated_at : seconds

      if (difference >= seconds || !data) {
        return callback();
      } else {
        return data.data
      }
    })
  }

  /*Return data in cache*/
  async(key, seconds, callback) {
    return new Promise((resolve, reject) => {
      helper.storage.get.item(key).then(response => {
        let data = response
        let difference = data ? helper.timestamp() - data.updated_at : seconds

        if (difference >= seconds || !data) {
          callback().then(response => {
            try {
              helper.storage.set(key, {
                data: response.data.data,
                meta: response.data.meta ? response.data.meta : '',
                updated_at: helper.timestamp()
              })
            } catch (error) {
              console.log(error)
            }
            resolve(response.data);
          })
            .catch(error => {
              console.log(error);
              reject(error);
            });
        } else {
          resolve(data);
        }
      })
    })
  }
}

const remember = new Remember();

export default ({Vue}) => {

  Vue.prototype.$remember = remember;

}

export {remember};
