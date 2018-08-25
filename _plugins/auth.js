import {Cookies, LocalStorage} from 'quasar'
import Config from 'src/config/index'
import {helper} from '@imagina/qhelper/_plugins/helper'
import {Notify} from 'quasar'
import http from "axios/index";


class Auth {

  constructor() {

  }

  /**
   *
   * @param permission {string}
   * @returns {boolean}
   * Example : auth.hasAccess('account.api-keys.create');
   */
  async hasAccess(can) {
    let userPermissions = await helper.storage.get.item("userData")
    let access = userPermissions.permissions[can]

    return access == null ? false : access
  }
}

const auth = new Auth();
/*
export default ({Vue}) => {

  Vue.prototype.$auth = auth;

}*/

export default auth;
