<template>
    <socialBtn 
        title="Continuar con Microsoft" 
        :icon="require('@imagina/quser/_components/socialAuth/icons/microsoft.svg')"
        @click.native="signIn"
    />
</template>

<script>
import storeMicrosoft from '@imagina/quser/_store/storeMicrosoft.js'
import socialBtn from '@imagina/quser/_components/socialAuth/socialBtn.vue'
export default {
    components: {
      socialBtn,
    },
    computed: {
        token() {
            return storeMicrosoft().getToken();
        }
    },
    methods: {
        async signIn() {
            await storeMicrosoft().signIn();
            await this.$store.dispatch('quserAuth/AUTH_SOCIAL_NETWORK', {
                    type: 'microsoft',
                    token: this.token
                }).then(response => {
                    this.$emit('logged')
                    this.loading = false
                }).catch(error => {
                    this.$alert.error(this.$tr('isite.cms.message.errorRequest'))
                    this.loading = false
                })
        },
        signOut() {
            storeMicrosoft().signOut();
        }
    }
}
</script>