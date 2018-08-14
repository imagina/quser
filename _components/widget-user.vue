<template>
  <!--= USER/LOGIN =-->
  <q-btn-dropdown
    color="white"
    flat
    icon="account_circle"
    :label="userData.first_name"
    id="user-dropdown"
  >
    <q-list>

      <q-item tag="label" :to="{name: 'user.profile.me'}">
        <q-item-side>
          <img :src="userData.profile.smallimage" width="32px" style="border-radius: 100%">

        </q-item-side>
        <q-item-main>
          <q-item-tile tag="a"
                       color="tertiary"
                       style="text-decoration: none">
            Profile
          </q-item-tile>
        </q-item-main>
      </q-item>
      <hr>

      <q-item tag="label" link :to="{name:'auth.logout'}">
        <q-item-side>
          <q-icon color="negative" name="exit_to_app" size="25px"></q-icon>
        </q-item-side>
        <q-item-main>
          <q-item-tile tag="a"
                       color="tertiary"
                       style="text-decoration: none">
            Sign out
          </q-item-tile>
        </q-item-main>
      </q-item>

    </q-list>
  </q-btn-dropdown>
</template>


<script>
  export default {
    props: {},
    components: {},
    watch: {},
    mounted() {
      this.$nextTick(function () {})
    },
    data() {
      return {
        userData : this.$helper.storage.get.item('userData')
      }
    },
    methods: {}
  }
</script>
<style lang="stylus">
  @import "~variables";
</style>
