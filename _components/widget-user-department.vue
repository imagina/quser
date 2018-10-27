<template>
  <!--= USER/DEPARTMENT =-->
  <q-btn-dropdown
    split
    class="float-right"
    color="primary"
    v-if="departments.length"
    :label="departments && depSelected !== 'all' ? departments[posDepSelected].title : 'All'"
  >
    <q-list link>
      <!--Departments-->
      <q-item v-for="(department,index) in departments" :key="index">
        <q-item-side>
          <q-radio v-model="depSelected" :val="department.id" @click.native="changeDepartment()"/>
        </q-item-side>
        <q-item-main>
          <q-item-tile label>{{department.title}}</q-item-tile>
        </q-item-main>
      </q-item>
      <!--All-->
      <q-item v-if="departments.length >= 2">
        <q-item-side>
          <q-radio v-model="depSelected" val="all" @click.native="changeDepartment()"/>
        </q-item-side>
        <q-item-main>
          <q-item-tile label>All</q-item-tile>
        </q-item-main>
      </q-item>
    </q-list>

  </q-btn-dropdown>
</template>


<script>
  import {helper} from '@imagina/qhelper/_plugins/helper'

  export default {
    props: {},
    components: {},
    watch: {},
    mounted() {
      this.$nextTick(function () {
        this.setData()
      })
    },
    data() {
      return {
        departments: false,
        depSelected: false,
        posDepSelected: 0,
        auth: require('@imagina/quser/_plugins/auth').default
      }
    },
    methods: {
      /**
       * set department selected
       */
      setData() {
        helper.storage.get.item('userData').then(response => {
          this.departments = response.departments
        })
        helper.storage.get.item("depSelected").then(response => {
          this.depSelected = response

          let departmentSelected = this.depSelected;
          if (!departmentSelected) {
            if (this.auth.hasAccess('fhia.role.admin'))
              this.depSelected = 'all';
            else
              this.depSelected = this.departments[0].id;

            helper.storage.set("depSelected", this.depSelected);
          } else
            this.depSelected = departmentSelected;

          let selected = 'all';
          if (this.depSelected != 'all') {
            Object.keys(this.departments).forEach((index) => {
              if (this.departments[index].id == this.depSelected)
                selected = index;
            })
            this.posDepSelected = selected;
          }
        })
      },

      changeDepartment() {
        helper.storage.set("depSelected", this.depSelected);
        location.reload();
      },
    }
  }
</script>
<style lang="stylus">
  @import "~variables";
</style>
