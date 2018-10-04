import axios from 'Modules/qhelper/_plugins/axios'

export default ({ Vue }) => {
  Vue.prototype.$axios = axios;
}

axios.defaults.headers.get['Accepts'] = 'application/json';

const reqInterceptor = axios.interceptors.request.use(config => {
    console.log('Request Interceptor', config);
    return config;
});
const resInterceptor = axios.interceptors.response.use(res => {
    console.log('Response Interceptor', res);
    return res;
});

axios.interceptors.request.eject(reqInterceptor);
axios.interceptors.response.eject(resInterceptor);
