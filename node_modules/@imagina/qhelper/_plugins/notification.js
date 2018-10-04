import {helper} from '@imagina/qhelper/_plugins/helper' //LocalForage
import Echo from "laravel-echo";
import Pusher from "pusher-js";

class Notification {
  constructor() {
    this.Echo = new Echo({
      broadcaster: env('BROADCAST_DRIVER','pusher'),
      key: env('PUSHER_APP_KEY'),
      cluster: env('PUSHER_APP_CLUSTER'),
      encrypted: env('PUSHER_APP_ENCRYPTED'),
    });
  }
  
  global(){
    this.Echo.channel('global')
    .listen('.clearCache', (message) => {
      helper.clearCache(message["data"]);
    });
  }
}


const notification = new Notification();


export default ({Vue}) => {
  Vue.prototype.$notification = notification;
}

export {notification};
