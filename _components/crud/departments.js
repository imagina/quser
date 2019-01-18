import {format} from 'date-fns'
import exportFromJSON from 'export-from-json'
import {alert} from '@imagina/qhelper/_plugins/alert'
import {required, email, sameAs, minLength} from 'vuelidate/lib/validators';
import _pick from 'lodash.pick'
import service from '../../_services/profile/index'

/**
 *
 * @type {{inline: null, headers: *[], formatters: (function(*, *): *)}}
 */
export const crudTable = {
  inline: null,
  headers: [
    { text: 'Id', value: 'id' },
    { text: 'Title', value: 'title' },
    { text: 'Updated At', value: 'updatedAt', type: 'datetime' },
    { text: 'Created At', value: 'createdAt', type: 'datetime' }
  ],

}


export const crudActions = {
  permission: 'fhia.departments',
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
      icon: 'delete',
      tooltip: '',
      //permission:''
    },
    edit: {
      icon: 'edit',
      tooltip: '',
      //permission:''
    }
  }

}

export const crudFields = {
  fieldsData:{
    title: {
      type: 'text',
      label: 'Department Title',
      name: 'title',
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
    //component: import('./departmentForm.vue')
  }),
  defaultRec: () => ({ // you can use function to initialize record as well
    title: ''
    // created: format(new Date(), 'YYYY-MM-DD HH:mm:ss'), // example for date format
  })
}

export const crudOps = { // CRUD
  export: async (payload) => {
    const {filterData,crudTable} = payload // pagination
    let filter = {};
    for (var key in filterData)
      filter[key] = filterData[key].value

    let headers = []
    crudTable.headers.forEach(element => {
      headers.push(element.value);
    })
    console.log("headers", headers)

    let headerData = [];
    await departmentService.index(filter)
      .then((response) =>{

        response.data.forEach((element,index) => {

          headerData.push(_pick(element, headers))
        })

        const data = headerData
        const fileName = 'Departments'
        const exportType = 'xls'
        exportFromJSON({ data, fileName, exportType })
      })
      .catch((error) => {
        let errorMessage = error ? error : 'No Departments found';
        alert.error(errorMessage, 'bottom')
      })
  },


  delete: async (payload) => {
    let {id, ...attributes} = payload

    await service.crud.delete('profile.departments',id)
      .then((response) => {
        alert.success('Department Deleted', 'top')
      }).catch(error => {
        let errorMessage = error ? error: 'Delete failed';
        alert.error(errorMessage, 'bottom')
      })

  },

  index: async (payload) => {
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
          fields:'id,title,updated_at,created_at'
        }
      }
    
      await service.crud.index('profile.departments',params)
        .then((response) => {
          data = response;
      }).catch(error => {
        let errorMessage = error ? error : 'No departments found';
        alert.error(errorMessage, 'bottom')
      })
    return {records:data.data,pagination:data.meta}
  },


  show: async (payload) => {
    const {id} = payload
    let record = { }
    let params = {
        params:{
          fields:'id,title,updated_at,created_at'
        }
    }
    await service.crud.show('profile.departments',id,params)
      .then((response) => {
        record = response.data;
      }).catch(error => {
        let errorMessage = error ? error : 'department not found';
        alert.error(errorMessage, 'bottom')
      })
    return record
  },


  create: async (payload) => {
    const {record: {id, ...attributes}} = payload
   
    await service.crud.create('profile.departments',{attributes:attributes})
      .then((response) => {
        alert.success('Department Created', 'top')
      }).catch(error => {
        let errorMessage = error ? error : 'Create failed';
        alert.error(errorMessage, 'bottom')
      })

  },

  update: async (payload) => {
    let {record: {id, ...attributes}} = payload
    attributes["id"] = id;
    await service.crud.update('profile.departments',id,{attributes:attributes})
      .then((response) => {
        alert.success('Department Updated', 'top')
      }).catch(error => {
        let errorMessage = error ? error : 'Update failed';
        alert.error(errorMessage, 'bottom')
      })

  }

}
