<template>
  <q-dialog id="modalFormLogin" persistent v-model="show">
    <q-card>
      <!--Header-->
      <q-card-section class="row items-center q-pa-none">
        <q-space/>
        <q-btn icon="close" flat round dense v-close-popup @click="emitResponse()"/>
      </q-card-section>

      <!--Form-->
      <q-card-section class="q-pa-none">
        <form-login @registered="emitResponse()" @logged="emitResponse()"/>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
  import formLogin from '@imagina/quser/_components/auth/form'

  export default {
    props: {},
    components: {formLogin},
    watch: {},
    beforeDestroy() {
      this.$eventBus.$off('open-auth-login')
    },
    created() {
      this.$nextTick(function () {
        this.$eventBus.$on('open-auth-login', () => {
          this.show = true
        })
      })
    },
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {
        show: false
      }
    },
    computed: {},
    methods: {
      emitResponse() {
        this.show = false
        this.$eventBus.$emit('auth-callback')
        setTimeout(() => this.$eventBus.$off('auth-callback'), 1000)
      }
    }
  }
</script>
<style lang="stylus">
  #modalFormLogin
    .q-card
      box-shadow none
</style>
