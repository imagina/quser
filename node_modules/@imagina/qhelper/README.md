##Module Qhelper
Module with plugins helpers
#

###Plugin: Helper
- ####Usage 
  *There are two ways to use it:*
  ```js
  1. import {helper} from '@imagina/qhelper/_plugins/helper'
  2. require('@imagina/qhelper/_plugins/helper').default
  ```

- ####Methods
  _Search into storage a element by index name_
  > storage.get.item({String})
  
  _Search in storage one or more items by index name_
  > storage.get.items({Array}) 
  
  _Return all elements stored_
  > storage.get.all()
  
  _Create or update a element in storage_
  > storage.set(index{String},data)
  
  _Remove a element from storage by index name_
  > storage.remove({String})
  
  _Delete all elements from storage_
  > storage.clear()
  
  _Show loader in full screen_
  > loadingShow()
  
  _Hidden loader in full screen_
  > loadingHidden()
  
  _Return timestamp in seconds unix_
  > timestamp()
  
  _Format US phone_
  > maskPhone({String})
  
  _Get only integers from string_
  > getInt({String})
  
  _Get a date range from today or current month or last month / options: 'today','currentMonth','lastMonth'_
  > rangeDate(option{String})
  
#
###Plugin: Alert
- ####Usage 
  *There are two ways to use it:*
  ```js
  1. import {alert} from '@imagina/qhelper/_plugins/alert'
  2. require('@imagina/qhelper/_plugins/alert').default
  ```

- ####Methods
  _You can call a float message with a color and icon reference to message (`success`,`error`,`info`,`warning`,`light`,`dark`)_
  
  Parameters:
  - `message` : _String with message to show / default : 'Notify'_
  - `position` : _String with notification position/ default : 'top-right'_
  - `action` : _If you need do callback in a action from notification, add this parameter'_
  ```js
    @action {object}{
      label: {string} // optional / default : 'Ok'
      icon: {string} // optional
      handler: {F}callback() // optional / default : dimiss notify
    }
  ```
  
  Example:
  ```js
    alert.success('Message','botton',{
      label : 'Ok',
      handler : function(){}
    })
  ```
  
#
###Plugin: Array
- ####Usage 
  *There are two ways to use it:*
  ```js
  1. import {array} from '@imagina/qhelper/_plugins/array'
  2. require('@imagina/qhelper/_plugins/array').default
  ```

- ####Methods
  
  _Order a array in tree format_
  > tree({Array})
  
  _Order a array in object for input select_
  > select({Array})

  _Search all parents in array by parent_id_
  > parents({Array},parentId{Int})
  
  _Search all children in array by parent_id_
  > children({Array},parentId{Int})
  
  _Search diff between two array_
  > diff({Array},{Array})
  
  _Search in array by parameter_
  > findByTag({Array},tag{String},value{String})


#
###Plugin: Remember
- ####Usage 
  *There are two ways to use it:*
  ```js
  1. import {remember} from '@imagina/qhelper/_plugins/remember'
  2. require('@imagina/qhelper/_plugins/remember').default
  ```

- ####Methods
  
  _Remember data or execute it callback `SYNC`_
  > sync(key{String}, seconds{Int}, callback{function})
  
  _Remember data or execute it callback `ASYNC`_
  > async(key{String}, seconds{Int}, callback{function})
