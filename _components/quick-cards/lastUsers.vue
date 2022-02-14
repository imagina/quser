<template>
  <quick-card :params="quickCardParams"/>
</template>
<script>
//Component
import quickCard from '@imagina/qsite/_components/master/quickCard'

export default {
  props: {},
  components: {quickCard},
  watch: {},
  mounted() {
    this.$nextTick(function () {
    })
  },
  data() {
    return {
      loading: false,
      posts: []
    }
  },
  computed: {
    quickCardParams() {
      return {
        type: 'list-v',
        title: this.$tr('iprofile.cms.quickCard.lastUsers'),
        icon: 'fas fa-users',
        apiRoute: 'apiRoutes.quser.users',
        requestParams: {
          include: 'roles',
          filter: {order: {way: 'desc'}}
        },
        information: {
          image: {field: 'mediumImage'},
          text1: {field: 'createdAt', format: val => this.$trd(val, {type: 'long'})},
          text2: {field: 'fullName'},
          text3: {
            field: 'roles', format: val => val ? val.map(item => {
              return item.name
            }).join(', ') : ''
          },
        },
        actionTo: 'quser.admin.users'
      }
    }
  },
  methods: {}
}
</script>
<style lang="stylus">
</style>
