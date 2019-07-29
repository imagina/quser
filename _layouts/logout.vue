<template>
  <q-page id="pageLogout" class="flex flex-center">

    <div class="row shadow-3 q-mx-xl" style="width: 350px">
      <div class="flex flex-center col-12 relative-position"
           style="padding: 30px 25px; min-height: 365px">
        <div class="text-center">
          <q-icon name="fas fa-user-lock" color="teal-6" size="60px"/>
          <div class="text-grey-8 q-headline q-mt-md">
            {{$tr('quser.layout.message.logout')}}
          </div>
          <q-btn :label="$tr('quser.layout.label.login')" color="teal-6"
                 :loading="loading"
                 class="q-mt-xl" :to="{name : 'auth.login'}"/>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
  import innerLoading from 'src/components/master/innerLoading'

  export default {
    components: {innerLoading},
    data() {
      return {
        loading : false
      }
    },
    mounted() {
      this.loading = true
      this.$nextTick(async function () {
        await this.$store.dispatch("quserAuth/AUTH_LOGOUT")
        this.loading = false
      })
    }
  }
</script>

<style lang="stylus">
  @import "~variables";
  #pageLogout
    #form-login-left
      min-height 150px

      .bg-color
        background-color $blue-grey
        height 100%
        width 100%
</style>
