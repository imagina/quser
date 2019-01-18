import {helper} from '@imagina/qhelper/_plugins/helper';

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
  async hasAccess(can) {
    let userPermissions = await helper.storage.get.item("userData")
    let access = userPermissions.permissions[can]

    return access == null ? false : access
  }
}

const auth = new Auth();

export default auth;
