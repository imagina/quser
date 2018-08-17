import {Cookies, LocalStorage} from 'quasar'
import Config from 'src/config/index'
import {Notify} from 'quasar'
import http from "axios/index";


class Auth {

  constructor() {
    this.storages = {
      Cookies,
      LocalStorage
    };
    this.storage = this.storages[Config('auth.default_storage')];
  }

  /**
   *
   * @param permission {string}
   * @returns {boolean}
   * Example : auth.hasAccess('account.api-keys.create');
   */
  hasAccess(permission) {
    let permissions = this.storage.get.item("userData").permissions;
    if (permissions.hasOwnProperty(permission))
      return permissions[permission];
    else
      return false;
  }
}

const auth = new Auth();
/*
export default ({Vue}) => {

  Vue.prototype.$auth = auth;

}*/

export default auth;
