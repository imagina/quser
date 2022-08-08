<template>
    <socialBtn 
        :title="`${$tr('isite.cms.label.continueWith')} ${$tr('isite.cms.label.microsoft')}`"
        :icon="require('@imagina/quser/_components/socialAuth/icons/microsoft.svg')"
        @click.native="signIn"
        v-if="microsoftClient"
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
        microsoftClient() {
            return this.$store.getters['qsiteApp/getSettingValueByName']('isite::microsoftClientId')
        },
    },
    methods: {
        async signIn() {
            await storeMicrosoft().signIn();
            await this.$emit('logged');
        },
        signOut() {
            storeMicrosoft().signOut();
        }
    }
}
</script>