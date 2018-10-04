import {Cookies, LocalStorage, Loading, QSpinnerHourglass} from 'quasar'
import {Forage} from '@imagina/qhelper/_plugins/localForage' //LocalForage
import {Notify} from 'quasar'

class Helper {

  constructor() {
    this.storage = Forage
  }

  loadingShow() {
    Loading.show({
      spinner: QSpinnerHourglass,
      spinnerColor: 'white',
      //customClass : 'bg-loading'
      //message: 'Some message',
      //messageColor: 'blue',
      //spinnerSize: 250, // in pixels
      //customClass : 'bg-primary'
    })
  }

  loadingHidden() {
    Loading.hide();
  }

  /*return timestamp in seconds unix*/
  timestamp() {
    return Date.now() / 1000 | 0
  }

  /*mask value with format phone US*/
  maskPhone(number) {
    if (number) {
      let value = this.getInt(number)
      let response = ''

      if (value) {
        value = value.toString()
        value.length >= 1 ? response += '(' : false;
        response += value.substr(0, 3)
        value.length >= 4 ? response += ') ' : false;
        response += value.substr(3, 3)
        value.length >= 7 ? response += '-' + value.substr(6, 4) : false;
      } else {
        response = value ? value[0] : ''
      }

      return response
    } else {
      return number
    }
  }

  /*get only numbers from a string*/
  getInt(value) {
    let regex = /(\d+)/g;
    let response = value.match(regex)
    response = response ? response.join('') : response;

    return response
  }

  /**
   * Return range date
   * @param type {string} requiere : ('today','currentMonth','lastMonth')
   */
  rangeDate(type) {
    type ? true : type = 'today'

    let d = new Date(); //Create object date
    let year = d.getFullYear() //Date current year
    let month = d.getMonth() + 1  //Date current month

    switch (type) {
      case 'today':
        return {
          from: year + '/' + month + '/' + d.getDate(),
          to: year + '/' + month + '/' + d.getDate(),
        }
        break;
      case 'currentMonth':
        return {
          from: year + '/' + month + '/' + new Date(year, month, 1).getDate(),
          to: year + '/' + month + '/' + new Date(year, month + 1, 0).getDate()
        }
        break;
      case 'lastMonth':
        return {
          from: year + '/' + (month - 1) + '/' + new Date(year, month - 1, 1).getDate(),
          to: year + '/' + (month - 1) + '/' + new Date(year, month - 1, 0).getDate()
        }
        break;

    }
  }

  /*set names months in dom*/
  nameMonths() {
    var d = new Date();
    var months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return [
      {label: months[d.getMonth() - 1], value: 'lastMonth'},
      {label: months[d.getMonth()], value: 'currentMonth'},
      {label: 'Today', value: 'today'}
    ];
  }

  /**
   * Clear Cache Data
   * @param data type {string} required
   *
   */
  async clearCache(data) {
    await this.storage.keys().then(keys =>{
      keys.forEach(el => {
        if (el.indexOf(data) > -1)
          this.storage.remove(el);
      })
    });
  
    
    
  }
}

const helper = new Helper();

export default ({Vue}) => {
  Vue.prototype.$helper = helper;
}

export {helper};
