<template>
    <socialBtn
        v-if="microsoftClient"
        :title="`${$tr('isite.cms.label.continueWith')} ${$tr('isite.cms.label.microsoft')}`"
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
        },
        socialData() {
            return storeMicrosoft().getDataLogin();
        },
        microsoftClient() {
            return this.$store.getters['qsiteApp/getSettingValueByName']('isite::microsoftClientId') || false
        },
        loading() {
                return storeMicrosoft().getLoading();
        },
        cancelLogin() {
            return storeMicrosoft().getCancelLogin();
        },
    },
    methods: {
        async signIn() {
            if (!this.loading) {
                await storeMicrosoft().signIn();
                if (!this.cancelLogin) {
                    await this.$store.dispatch('quserAuth/AUTH_SOCIAL_NETWORK', {
                        type: 'microsoft',
                        token: this.token,
                        socialData: this.socialData
                    }).then(response => {
                        this.$emit('logged')
                        localStorage.setItem('socialType', 'microsoft');
                    }).catch(error => {
                        this.$alert.error(this.$tr('isite.cms.message.errorRequest'))
                    })
                }
            }
        },
    }
}
</script>
