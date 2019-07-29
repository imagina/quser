import {helper} from '@imagina/qhelper/_plugins/helper';
import router from 'src/router/index';
import store from 'src/store/index';

class Auth {
  constructor() {
  }

  /**
   * Validate permissions of user
   *
   * @param can
   * @returns {Promise<boolean>}
   */
  hasAccess(can) {
    if(!can) return true
    let userPermissions = store.getters["quserAuth/getPermissions"]
    if(userPermissions && Object.keys(userPermissions).length){
      let access = userPermissions[can]
      return access == null ? false : access
    }else{
      return false
    }
  }


  hasSetting(name) {
    let userSettings = store.getters["quserAuth/getSettings"]
    let setting = userSettings.find(setting => setting.name === name)
    return setting ? setting :false
  }
}

const auth = new Auth();

export default auth;
