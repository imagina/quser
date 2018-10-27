<template>
  <q-page class="flex flex-center">

    <div class="row shadow-3 q-mx-xl" style="width: 550px">
      <div id="form-login-left" class="col-12 col-md-5">
        <div class="bg-color flex flex-center">
          <img src="../../../../src/assets/image/logo-login.png" style="width: auto; max-height: 100px">
        </div>
      </div>
      <div class="flex flex-center col-12 col-md-7"
           style="padding: 30px 25px; min-height: 365px">
        <div class="text-center">
          <q-spinner-hourglass color="primary" :size="60"/>
          <h5 class="q-ma-none q-mt-lg text-faded">Closing session...</h5>
        </div>
      </div>
    </div>

  </q-page>
</template>

<script>
  import {alert} from '@imagina/qhelper/_plugins/alert'
  import {helper} from '@imagina/qhelper/_plugins/helper'
  import {request} from '@imagina/qoffline/_plugins/request';
  
  export default {
    mounted() {
      helper.storage.get.item("offlineRequests")
        .then(offRqsts =>{
          offRqsts = request.userCurrentRequests(offRqsts);
          if(!offRqsts.length)
            this.$store.dispatch("auth/AUTH_LOGOUT")
          else
            this.$router.push({name:"offline"})
        })
    }
  }
</script>
