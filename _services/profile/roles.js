import {Cookies, LocalStorage} from 'quasar'
import config from 'src/config/index'
import http from "axios"
import {remember} from '@imagina/qhelper/_plugins/remember'

export default {

	getPermissions() {
		return new Promise((resolve, reject) => {
			return http.get(config('apiRoutes.site.permissions')).then(response => {
				resolve(response.data);
			}).catch(error => {
				reject([]);
			});
		});
	}
}
