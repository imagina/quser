import {format} from 'date-fns'
import exportFromJSON from 'export-from-json'
import {alert} from '@imagina/qhelper/_plugins/alert'
import {required, email, sameAs, minLength} from 'vuelidate/lib/validators';
import _pick from 'lodash.pick'
import service from '@imagina/quser/_services/profile/index'

/**
 *
 * @type {{inline: null, headers: *[], formatters: (function(*, *): *)}}
 */
export const crudTable = {
  inline: null,
  headers: [
    { text: 'Id', value: 'id' },
    { text: 'Name', value: 'name' }
  ],

}


export const crudActions = {
  permission: 'profile.role',
  actionsData:{
    add: {
      icon: 'add',
      tooltip: '',
      //permission:''
    },
    export: {
      icon: 'fas fa-download',
      tooltip: '',
      //permission:''
    },
    delete: {
      icon: 'fas fa-trash-alt',
      tooltip: '',
      //permission:''
    },
    edit: {
      icon: 'fas fa-pen',
      tooltip: '',
      //permission:''
    }
  }

}

export const crudFields = {
  fieldsData:{
    name: {
      type: 'text',
      label: 'Role Name',
      name: 'name',
      placeHolder: '',
      viewPosition: 'left',
      rules: {
        required,
      }
    }
  }
}

export const crudFilter = {
  FilterVue: () => ({
    //component: import('./departmentFilter.vue')
  }),
  filterData: {
    search: {
      type: 'text',
      label:'',
      placeHolder: 'Text Search',
      value: '',
      cols:'4'
    }
  }
}

export const crudForm = {
  FormVue: () => ({
    component: import('@imagina/quser/_layouts/roleForm')
  }),
  defaultRec: () => ({ // you can use function to initialize record as well
    name: ''
    // created: format(new Date(), 'YYYY-MM-DD HH:mm:ss'), // example for date format
  })
}

export const crudOps = { // CRUD
  export: async (payload, configNames) => {
    const {filterData,crudTable} = payload // pagination
    let filter = {};
    for (var key in filterData)
      filter[key] = filterData[key].value

    let headers = []
    crudTable.headers.forEach(element => {
      headers.push(element.value);
    })

    let headerData = [];

    let params = {
      params:{
        filter:filter,
        fields:'id,name'
      }
    }
      await service.crud.index('apiRoutes.profile.roles',params)
      .then((response) =>{

        response.data.forEach((element,index) => {

          headerData.push(_pick(element, headers))
        })

        const data = headerData
        const fileName = 'Roles'
        const exportType = 'xls'
        exportFromJSON({ data, fileName, exportType })
      })
      .catch((error) => {
        let errorMessage = error ? error : 'No Roles found';
        alert.error(errorMessage, 'bottom')
      })
  },


  delete: async (payload, configNames) => {
    let {id, ...attributes} = payload

    await service.crud.delete('apiRoutes.profile.roles',id)
      .then((response) => {
        alert.success('Role Deleted', 'top')
      }).catch(error => {
        let errorMessage = error ? error: 'Delete failed';
        alert.error(errorMessage, 'bottom')
      })

  },

  index: async (payload, configNames) => {
    let data = []
    const {pagination, filterData} = payload
    let filter = {};

    for (var key in filterData)
      filter[key] = filterData[key].value

      let params = {
        params:{
          filter:filter,
          page: pagination.page ? pagination.page : 1,
          take: 10,
          fields:'id,name,updated_at,created_at'
        }
      }
    
      await service.crud.index('apiRoutes.profile.roles',params)
        .then((response) => {
          data = response;
      }).catch(error => {
        let errorMessage = error ? error : 'No roles found';
        alert.error(errorMessage, 'bottom')
      })
    return {records:data.data,pagination:data.meta}
  },


  show: async (payload, configNames) => {
    const {id} = payload
    let record = { }
    let params = {
        params:{
          fields:'id,name,slug,permissions,updated_at,created_at',
          include: 'settings'
        }
    }
    await service.crud.show('apiRoutes.profile.roles',id,params)
      .then((response) => {
        record = response.data;
      }).catch(error => {
        let errorMessage = error ? error : 'role not found';
        alert.error(errorMessage, 'bottom')
      })
    return record
  },


  create: async (payload, configNames) => {
    const {record: {id, ...attributes}} = payload
   
    await service.crud.create('apiRoutes.profile.roles',attributes)
      .then((response) => {
        alert.success('Role Created', 'top')
      }).catch(error => {
        let errorMessage = error ? error : 'Create failed';
        alert.error(errorMessage, 'bottom')
      })

  },

  update: async (payload, configNames) => {
    let {record: {id, ...attributes}} = payload
    attributes["id"] = id;
    await service.crud.update('apiRoutes.profile.roles',id,attributes)
      .then((response) => {
        alert.success('Role Updated', 'top')
      }).catch(error => {
        let errorMessage = error ? error : 'Update failed';
        alert.error(errorMessage, 'bottom')
      })

  }

}
