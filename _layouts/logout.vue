<template>
  <q-page class="flex flex-center">

    <div class="row shadow-3 q-mx-xl" style="width: 550px">
      <div class="flex flex-center col-md-7"
           style="padding: 30px 25px; min-height: 365px">
        <div class="text-center">
          <q-spinner-hourglass color="primary" :size="60"/>
          <h5 class="q-ma-none q-mt-lg text-faded">Closing session...</h5>
        </div>
      </div>
      <div id="form-login-left" class="col-md-5">
        <div class="bg-color flex flex-center">
          <img src="../_assets/image/logo_white.png" alt="">
        </div>
      </div>
    </div>

  </q-page>
</template>

<script>
  export default {
    mounted() {
      this.$store.dispatch("auth/AUTH_LOGOUT")
    }
  }
</script>
