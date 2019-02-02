import {helper} from '@imagina/qhelper/_plugins/helper';
import store from 'src/store/index'

class Auth {
  constructor() {
    helper.storage.get.item("userData").then(user => {
      this.user = user
    })
  }

  /**
   * Validate permissions of user
   *
   * @param can
   * @returns {Promise<boolean>}
   */
  hasAccess(can) {
    let userPermissions = store.getters["auth/getPermissions"]

    let access = userPermissions[can]
  
    return access == null ? false : access
  }
  
  
  hasSetting(name) {
    
    let userSettings = store.getters["auth/getSettings"]

    let setting = userSettings.find(setting => setting.name === name)
    
    return setting ? setting :false
  }
}

const auth = new Auth();

export default auth;
