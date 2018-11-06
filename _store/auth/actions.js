import router from 'src/router/index';
import authService from '../../_services/auth';
import auth from '../../_plugins/auth';
import {alert} from '@imagina/qhelper/_plugins/alert';
import {helper} from '@imagina/qhelper/_plugins/helper';
import axios from 'axios';
import config from 'src/config/index'
import store from 'src/store/index'

export const AUTH_REQUEST = ({commit, dispatch}, authData) => {
  if (navigator.onLine)
    return authService.login(authData.username, authData.password)
      .then(response => {
        let data = response.data
        
        const now = new Date();
        const expirationDate = now.getTime() + ((env('DAYS_EXPIRE_SESSION') * 86400) * 1000)
        const deparmentSelected = data.userdata.departments.length ? data.userdata.departments[0].id : 0;
        
        helper.storage.set('userToken', data.userToken)
        helper.storage.set('userId', data.userdata.id)
        helper.storage.set('expirationDate', expirationDate)
        helper.storage.set('depSelected', deparmentSelected)
        
        helper.storage.set('userData', data.userdata).then(response => {
          auth.hasAccess('iprofile.api.login').then(can => {
            if (can) {
              dispatch("AUTH_SUCCESS", {
                userToken: data.userToken,
                userId: data.userdata.id,
                userData: data.userdata
              });
            } else {
              alert.error("User without access", "top");
            }
          })
        })
        //dispatch('setLogoutTimer', res.data.expiresIn)
      }).catch(error => {
        dispatch("AUTH_ERROR");
      });
  else
    alert.error("Network Conection Error", "top");
};

export const AUTH_TRYAUTOLOGIN = ({commit, dispatch}) => {
  return new Promise((resolve, reject) => {
    helper.storage.get.item('userToken').then(userToken => {
      if (!userToken) {
        resolve(false)
        return
      }
      
      helper.storage.get.item('expirationDate').then(expirationDate => {
        const now = new Date();
        if (now.getTime >= expirationDate) {
          dispatch("AUTH_LOGOUT");
          resolve(false)
          return
        }
        
        helper.storage.get.item('userId').then(userId => {
          helper.storage.get.item('userData').then(userData => {
            dispatch('AUTH_SUCCESS', {
              userToken: userToken,
              userId: userId,
              userData: userData
            }).then(response => {
              resolve(true)
            });
          })
        })
      })
    })
  })
};

export const AUTH_SUCCESS = ({commit, dispatch}, data) => {
  return new Promise((resolve => {
    //Register token by default in axios
    helper.storage.get.item('userToken').then(response => {
      axios.defaults.headers.common['Authorization'] = response;
      
      commit('AUTH_SUCCESS', data);
      if (router.currentRoute.path == "/auth/login") {
        console.log(data.userData.default_route)
        router.push(data.userData.default_route)
      }
      
      resolve(true)
    })
  }))
}

export const AUTH_ERROR = ({commit, dispatch}) => {
  
  alert.error("Email or password incorrect.", "top");
  
}

export const AUTH_LOGOUT = ({commit, dispatch}) => {
  
  if (navigator.onLine)
    authService.logout();
  
  dispatch("AUTH_CLEAR");
};

export const AUTH_CLEAR = async ({commit, dispatch}) => {
  
  let offRqsts = await helper.storage.get.item("offlineRequests");
  let notifications = await helper.storage.get.item("notifications") || [];
  await helper.storage.clear();
  await helper.storage.set('offlineRequests', offRqsts);
  await helper.storage.set('notifications', notifications) ;
  store.dispatch('notification/FLUSH_NOTIFICATIONS');
  commit('AUTH_LOGOUT');
  router.push({name: 'auth.login'});
  
};
