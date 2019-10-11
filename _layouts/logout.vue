<template>
  <q-page id="pageLogout" class="bg-grey-2 flex flex-center">
    <div class="row shadow-3 q-mx-xl" style="width: 350px">
      <div class="flex flex-center col-12 relative-position"
           style="padding: 20px; min-height: 300px">
        <div class="text-center">
          <q-icon name="fas fa-user-lock" color="primary" size="60px"/>
          <div class="text-grey-8 q-headline q-mt-md">
            {{$tr('quser.layout.message.logout')}}
          </div>
          <q-btn :label="$tr('quser.layout.label.login')" color="primary"
                 :loading="loading"
                 class="q-mt-md" :to="{name : 'auth.login'}"/>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
  export default {
    components: {},
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
</style>
