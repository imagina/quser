import LocalForage from "localforage";

class localForage {

  constructor() {
    //Order config to localForage
    let configDrivers = () => {
      let drivers = env('LOCALFORAGE_DRIVERS','INDEXEDDB,LOCALSTORAGE,WEBSQL').split(',')
      let data = []
      drivers.forEach((driver) => {
        data.push(LocalForage[driver])
      })
      return data
    }

    //Config for LocalForage
    LocalForage.config({
      driver: configDrivers(),
      name: 'fhiaDB',
      version: 1,
      storeName: 'storage',
    });

    //Contructor of method get
    this.get = {
      //Return data by index name
      item: (index) => {
        if (index) {
          return new Promise((resolve, reject) => {
            LocalForage.getItem(index).then(value => {
              resolve(value)
            })
          })
        }else{
          return 'Error: index requiered'
        }
      },
      //Return data of one or more items
      //param type {array} require
      items: (items) => {
        if (Array.isArray(items) && items.length) {
          return new Promise(async (resolve, reject) => {
            let dataItems = {}

            //Get data from all items
            for(var index in items){
              dataItems[items[index]] = await LocalForage.getItem(items[index])
            }

            resolve(dataItems) //Return data
          })
        }else{
          return 'Error: param type {array} require'
        }
      },
      //return all data
      all: () => {
        return new Promise((resolve, reject) => {
          //Get all keys in storage
          
          LocalForage.keys().then(function(keys) {
            if(keys.length){
              let allStorage = {};
              //Get data by key
              keys.forEach((key,index) => {
                LocalForage.getItem(key).then(value => {
                  allStorage[key] = value //Add data from storage
                  if(keys.length == index)
                    resolve(allStorage);
                })
              })
            }else{
              resolve(allStorage);
            }
          })
        })
      }
    }
  }

  //Insert or update
  set(index, data) {
    if (index) {
      return new Promise((resolve, reject) => {
        LocalForage.setItem(index, data).then(value => {
          resolve(value)
        })
      })
    }
  }
  
  //Remove an item from storage
  remove(index) {
    if(index){
      return new Promise((resolve, reject) => {
        LocalForage.removeItem(index).then(value => {
          resolve(true)
        })
      })
    }
  }
  
  //Return all keys fron storage
  keys() {

      return new Promise((resolve, reject) => {
        LocalForage.keys().then(value => {
          resolve(value)
        })
      })
    
  }

  //Remove all items from storage
  clear() {
    return new Promise((resolve, reject) => {
      LocalForage.clear().then(value => {
        resolve(true)
      })
    })
  }
}

const Forage = new localForage();


export default ({Vue}) => {
  Vue.prototype.$storage = Forage;
}

export {Forage};
