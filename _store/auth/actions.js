import router from '../../../../../src/router/index';
import authService from '../../_services/auth';
import auth from '../../_plugins/auth';
import {alert} from '@imagina/qhelper/_plugins/alert';
import {helper} from '@imagina/qhelper/_plugins/helper';
import axios from 'axios';

export const AUTH_REQUEST = ({commit, dispatch}, authData) => {
  return authService.login(authData.username, authData.password)
    .then(response => {
      let data = response.data

      const now = new Date();
      const expirationDate = new Date(now.getTime() + data.expires_in * 1000)
      helper.storage.set('userToken', data.userToken)
      helper.storage.set('userId', data.userdata.id)
      helper.storage.set('userData', data.userdata)
      helper.storage.set('expirationDate', expirationDate)
      data.userdata.departments ? helper.storage.set('depSelected', data.userdata.departments[0].id) : false

      if (auth.hasAccess('fhia.login')) {
        dispatch("AUTH_SUCCESS", {
          userToken: data.userToken,
          userId: data.userdata.id,
          userData: data.userdata
        });
      } else {
        alert.error("User without access", "top");
        dispatch("AUTH_LOGOUT");
      }
      //dispatch('setLogoutTimer', res.data.expiresIn)
    }).catch(error => {
      dispatch("AUTH_ERROR");
    });
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
        if (now >= expirationDate) {
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
        router.push("/");
      }

      resolve(true)
    })
  }))
}

export const AUTH_ERROR = ({commit, dispatch}) => {
  alert.error("Email or password incorrect.", "top");
}

export const AUTH_LOGOUT = ({commit, dispatch}) => {
  return authService.logout().then(response => {
    commit('AUTH_LOGOUT');
    helper.storage.clear()
    router.push({name: 'auth.login'});
  }).catch(error => {

  });


};
