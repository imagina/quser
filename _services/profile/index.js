import {Cookies, LocalStorage} from 'quasar'
import config from 'src/config/index'
import http from "axios"
import {remember} from '@imagina/qhelper/_plugins/remember'
import crud from '@imagina/qhelper/_services/baseService'
import auth from '@imagina/quser/_services/profile/auth'
import role from '@imagina/quser/_services/profile/roles'
import department from '@imagina/quser/_services/profile/departments'
import Http from "axios/index";
import {helper} from "@imagina/qhelper/_plugins/helper";


export default {
  crud,
  auth,
  department,
  role
  
}


