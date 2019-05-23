import {format} from 'date-fns'
import exportFromJSON from 'export-from-json'
import {alert} from '@imagina/qhelper/_plugins/alert'
import {array} from '@imagina/qhelper/_plugins/array'
import store from 'src/store/index'
import {required, email, sameAs, minLength} from 'vuelidate/lib/validators';
import _pick from 'lodash.pick'

// change this import for which you are going to use
import service from '@imagina/quser/_services/profile/index'

/**
 *
 * @type {{inline: null, headers: *[], formatters: (function(*, *): *)}}
 */
export const crudTable = {
  inline: null,
  headers: [
    {text: 'Id', value: 'id'},
    {text: 'Title', value: 'title'},
    {text: 'Updated At', value: 'updatedAt', type: 'datetime'},
    {text: 'Created At', value: 'createdAt', type: 'datetime'}
  ],

}


export const crudActions = {
  // base permission to make crud, example 'fhia.departments' + '.create' or + '.index' or + '.destroy' or + '.edit'
  permission: 'profile.departments',
  actionsData: {
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
  fieldsData: {
    title: {
      type: 'text',
      label: 'Department Title',
      name: 'title',
      placeHolder: '',
      viewPosition: 'left',
      rules: {
        required,
      }
    },
    parentId: {
      type: 'treeselect',
      label: 'Parent',
      name: 'parentId',
      filter: true,
      valueConsistsOf: 'BRANCH_PRIORITY',
      placeHolder: 'Parent Department',
      viewPosition: 'right',
      optionsFn: async () => {
        let params = {
          params: {
            fields: 'id,title,parent_id,updated_at,created_at'
          }
        }
        let data;
        await service.crud.index('apiRoutes.profile.departments', params)
          .then((response) => {
            data = array.tree(response.data);
          }).catch(error => {
            let errorMessage = error ? error : 'No departments found';
            alert.error(errorMessage, 'bottom')
          })
        return data;
      },
      rules: {}
    }
  }
}

export const crudFilter = {
  FilterVue: () => ({// you can set your custom filter view
    //component: import('./departmentFilter.vue')
  }),
  filterData: {
    search: {
      type: 'text',
      label: '',
      placeHolder: 'Text Search',
      value: '',
      cols: '4'
    }
  }
}

export const crudForm = {
  FormVue: () => ({
    component: import('@imagina/quser/_layouts/departmentForm')
  }),
  defaultRec: () => ({ // you can use function to initialize record as well
    title: '',
    parentId: null
    // created: format(new Date(), 'YYYY-MM-DD HH:mm:ss'), // example for date format
  })
}

export const crudOps = { // CRUD

  export: async (payload, configNames) => {
    const {filterData, crudTable} = payload // pagination
    let filter = {};
    for (var key in filterData)
      filter[key] = filterData[key].value

    let headers = []
    crudTable.headers.forEach(element => {
      headers.push(element.value);
    })

    let params = {
      params: {
        filter: filter,
        fields: 'id,title'
      }
    }


    let headerData = [];
    await service.crud.index(configNames.storeName, params)
      .then((response) => {

        response.data.forEach((element, index) => {

          headerData.push(_pick(element, headers))
        })

        const data = headerData
        const fileName = configNames.pluralName
        const exportType = 'xls'
        exportFromJSON({data, fileName, exportType})
      })
      .catch((error) => {
        let errorMessage = error ? error : 'No ' + configNames.pluralName + ' found';
        alert.error(errorMessage, 'bottom')
      })
  },


  delete: async (payload, configNames) => {
    let {id, ...attributes} = payload

    await service.crud.delete(configNames.storeName, id)
      .then((response) => {
        alert.success(configNames.singularName + ' Deleted', 'top')
      }).catch(error => {
        let errorMessage = error ? error : 'Delete failed';
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
      params: {
        filter: filter,
        page: pagination.page ? pagination.page : 1,
        take: 10,
        fields: 'id,title,parent_id,updated_at,created_at'
      }
    }
    
    await service.crud.index(configNames.storeName, params)
      .then((response) => {
        data = response;
      }).catch(error => {
        let errorMessage = error ? error : 'No ' + configNames.pluralName + ' found';
        alert.error(errorMessage, 'bottom')
      })
    return {records: data.data, pagination: data.meta}
  },


  show: async (payload, configNames) => {
    const {id} = payload
    let record = {}
    let params = {
      params: {
        fields: 'id,title,parent_id,updated_at,created_at',
        include: 'settings'
      }
    }
    await service.crud.show(configNames.storeName, id, params)
      .then((response) => {
        record = response.data;
      }).catch(error => {
        let errorMessage = error ? error : configNames.singularName + ' not found';
        alert.error(errorMessage, 'bottom')
      })
    return record
  },


  create: async (payload, configNames) => {
    const {record: {id, ...attributes}} = payload


    await service.crud.create(configNames.storeName, attributes)
      .then((response) => {
        alert.success(configNames.singularName + ' Created', 'top')
      }).catch(error => {
        let errorMessage = error ? error : 'Create failed';
        alert.error(errorMessage, 'bottom')
      })

  },

  update: async (payload, configNames) => {
    let {record: {id, ...attributes}} = payload
    attributes["id"] = id;
    await service.crud.update(configNames.storeName, id, attributes)
      .then((response) => {
        alert.success(configNames.singularName + ' Updated', 'top')
      }).catch(error => {
        let errorMessage = error ? error : 'Update failed';
        alert.error(errorMessage, 'bottom')
      })

  }

}




