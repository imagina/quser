<template>
  <div id="q-app">

    <div class="border">

      <div class="form-title q-title">
        New Customer
      </div>

      <div class="form-container">

        <div class="row gutter-xs q-px-md">
          <div class="item-form col-12 col-md-3">
            <q-field  :error="$v.form.firstName.$error"
                      error-label="This field is required"
            >
              <q-input v-model="form.firstName" 
              clearable float-label="First Name:"/>
            </q-field>
          </div>
          
          <div class="item-form col-12 col-md-3">
            <q-field  :error="$v.form.lastName.$error"
                      error-label="This field is required"
            >
              <q-input  v-model="form.lastName" 
                        clearable float-label="Last Name:"
              />
            </q-field>
          </div>

          <div class="item-form col-12 col-md-3">
            <q-field    
              :error="$v.form.cellularPhone.$error"
              error-label="This field is required"
              :count="14"
            >
              <q-input  type="text" clearable v-model="form.cellularPhone"
                        :maxlength="14"
                        :before="[{icon: 'fa fa-phone'}]"
                        float-label="Cellular Phone *:"
              />
            </q-field>
          </div>
    
          <div class="item-form col-12 col-md-3">
            <q-field
              :error="$v.form.email.$error"
              error-label="This field is required"
            >
              
              <q-input 
                clearable
                
                :before="[{icon: 'email'}]"
                v-model="form.email"   
                float-label="Email:"/>
            </q-field>
            
          </div>
        </div>
        
        <div class="row">

          <div class="col-12 q-mb-md">
            <q-tabs animated swipeable inverted color="primary" align="justify">

              <q-tab default name="fields" slot="title" label="Fields" />
              <q-tab name="address" slot="title" label="Addresses" />
              <q-tab name="contacts" slot="title" label="Contacts" />

              <q-tab-pane name="fields">
                <div class="row gutter-md">
                  <div class="col-12 col-md-6">
                    
                    <q-field
                      :error="$v.field.name.$error"
                      error-label="This field is required"
                    >
                      <q-select
                        v-model="field.name"
                        float-label="Type"
                        :options="selectOptions"
                      />
                    </q-field>

                    <q-field v-if="field.name==''">
                      <q-input  type="text" clearable v-model="field.value"
                        :maxlength="14"
                        :before="[{icon: 'close'}]"
                        float-label="Select type first"
                        disabled
                      />
                    </q-field>

                    <q-field v-if="field.name=='cellular_phone' || field.name=='day_phone' 
                    || field.name=='evening_phone'" :count="14" 
                    :error="$v.field.value.$error"
                    error-label="This field is required">
                      
                      <q-input  type="text" clearable v-model="field.value"
                                :maxlength="14"
                                :before="[{icon: 'close'}]"
                                float-label="Select type first"
                                v-if="field.name==''"
                                disabled 
                                @input="deleteError"
                      />
                      <q-input  type="text" clearable v-model="field.value"
                                :maxlength="14"
                                :before="[{icon: 'fa fa-phone'}]"
                                float-label="Cellular Phone *:"
                                v-if="field.name=='cellular_phone'"
                                @input="deleteError"
                      />
                      <q-input  type="text" clearable v-model="field.value"
                                :maxlength="14"
                                :before="[{icon: 'fa fa-phone'}]"
                                float-label="Day Phone *:"
                                v-if="field.name=='day_phone'"
                                @input="deleteError"
                      />
                      <q-input  type="text" clearable v-model="field.value"
                                :maxlength="14"
                                :before="[{icon: 'fa fa-phone'}]"
                                float-label="Evening Phone *:"
                                v-if="field.name=='evening_phone'"
                                @input="deleteError"
                      />

                    </q-field>

                    <q-field v-if="field.name=='email'"
                    :error="$v.field.value.$error"
                    error-label="This field is required">
                      <q-input  type="text" clearable v-model="field.value"
                        :before="[{icon: 'email'}]"
                        float-label="Email *:"
                      />
                    </q-field>

                    <p class="q-mt-md text-negative float-left" v-if="fieldExist">Already Exist</p>

                    <q-btn class="float-right q-mt-sm" color="primary"                    :label="fieldEdit ? 'Save':'Add Field'" @click="addField"/>
                    
                    <q-btn class="float-left q-mt-sm" color="negative" label="Cancel" @click="cancelField" v-if="fieldEdit" />  
                  
                  </div>
                  <div class="col-12 col-md-6">
                    <q-list highlight>
                      <q-list-header>Fields Added</q-list-header>
                      <q-item separator v-for="(field, index) in fields" :key="index">
                        
                        <q-item-main v-if="field.name=='day_phone'">
                          Day Phone: {{field.value}}
                        </q-item-main>

                        <q-item-main v-if="field.name=='cellular_phone'">
                          Alternative Cellular Phone: {{field.value}}
                        </q-item-main>

                        <q-item-main v-if="field.name=='evening_phone'">
                          Evening Phone: {{field.value}}
                        </q-item-main>

                        <q-item-main v-if="field.name=='email'">
                          Alternative Email: {{field.value}}
                        </q-item-main>

                        <q-item-side right>
                          <q-btn round color="positive" icon="edit"
                          @click="editField(field)" size="sm" v-if="!fieldEdit"/>
                          <q-btn round color="negative" icon="delete"  
                          @click="deleteField(field,index)" size="sm" class="q-ml-md"/>
                        </q-item-side>
                      </q-item>
                    </q-list>
                  </div>
                </div>
              </q-tab-pane>

              <q-tab-pane name="address">
                <div class="row gutter-md">
                  <div class="col-12 col-md-6">

                    <q-field
                      :error="$v.address.address.$error"
                      error-label="This field is required"
                    >
                      <q-input  v-model="address.address"
                              clearable
                              float-label="Address:"
                              @input="deleteError"
                      />
                    </q-field>

                  
                    <q-input  v-model="address.city"
                              clearable
                              float-label="City:"
                    />
                  
                    <q-input  v-model="address.state"
                              clearable
                              float-label="State:"
                    />
                  
                    <q-input  v-model="address.zipCode"
                              clearable
                              float-label="Zip Code:"
                    /> 
                    
                    <p class="text-negative float-left q-mt-md" v-if="addressExist">Already Exist</p>
                    <q-btn class="float-right q-mt-sm" color="primary" icon="add" 
                    :label="addressEdit ? 'Save':'Add Address'" @click="addAddress"/>

                    <q-btn class="float-left q-mt-sm" color="negative" label="Cancel" @click="cancelAddress" v-if="addressEdit" />  
                  </div>
                  <div class="col-12 col-md-6">
                    <q-list highlight>
                      <q-list-header>Addresses Added</q-list-header>
                      <q-item separator v-for="(address, index) in addresses" :key="index">

                        <q-item-main>
                          {{index+1}}. {{address.address}} - {{address.city}} - {{address.zipCode}}
                        </q-item-main>

                        <q-item-side right>
                          <q-btn round color="positive" icon="edit"
                          @click="editAddress(address)" size="sm" v-if="!addressEdit"/>
                          <q-btn round color="negative" icon="delete"  
                          @click="deleteAddress(index)" size="sm" class="q-ml-md"/>
                        </q-item-side>
                      </q-item>
                    </q-list>
                  </div>
                </div>
              </q-tab-pane>

              <q-tab-pane name="contacts">
                <div class="row gutter-md">
                  <div class="col-12 col-md-6">
                  
                    <q-field
                      :count="10"
                    >
                      <q-input v-model="contact.firstName" type="text"  placeholder="First Name" 
                      @input="deleteError"/>
                    </q-field> 

                    <q-field
                      :count="10"
                    >
                      <q-input v-model="contact.lastName" type="text"  placeholder="Last Name" />
                    </q-field> 

                    <q-field
                      :count="10"
                    >
                      <q-input v-model="contact.cellularPhone" type="text"  placeholder="Number Phone" />
                    </q-field> 

                    <q-field
                    >
                      <q-input v-model="contact.email" type="text"  placeholder="Email" />
                    </q-field> 

                    <p class="text-negative float-left q-mt-md" v-if="contactExist">Already Exist</p>
                    <q-btn class="float-right q-mt-sm" color="primary" icon="add" 
                    :label="contactEdit ? 'Save':'Add Contact'" @click="addContact"/>

                    <q-btn class="float-left q-mt-sm" color="negative" label="Cancel" @click="cancelContact" v-if="contactEdit" /> 

                  </div>
                  <div class="col-12 col-md-6">
                    <q-list highlight>
                      <q-list-header>Contacts Added</q-list-header>
                      <q-item separator v-for="(contact, index) in contacts" :key="index">

                        <q-item-main>
                          {{index+1}}. {{contact.firstName}} {{contact.lastName}} - {{contact.cellularPhone}}
                        </q-item-main>

                        <q-item-side right>
                          <q-btn round color="positive" icon="edit"
                          @click="editContact(contact)" size="sm" v-if="!contactEdit"/>
                          <q-btn round color="negative" icon="delete"  
                          @click="deleteContact(contact)" size="sm" class="q-ml-md"/>
                        </q-item-side>
                      </q-item>
                    </q-list> 
                  </div>
                </div>
              </q-tab-pane>

            </q-tabs>
          </div>

        </div>
      </div>

    </div>
    <div class="col-12 text-center q-py-lg">
      <q-btn 
        color="primary"
        @click="submit">
        Save
      </q-btn>
    </div>

  </div>
</template>

<script>
  //Plugins
  import {alert} from '@imagina/qhelper/_plugins/alert'
  import {required, email, numeric, minLength} from 'vuelidate/lib/validators'

  export default {
    components: {
    },
    data() {
      return {
        selectOptions: [
          {
            label: 'Evening Phone',
            value: 'evening_phone',
            disable: false
          },
          {
            label: 'Day Phone',
            value: 'day_phone',
            disable: false
          },
          {
            label: 'Alternative Email',
            value: 'email',
            disable: false
          },
          {
            label: 'Alternative Cellular Phone',
            value: 'cellular_phone',
            disable: false
          },

        ],

        fieldAux:{},
        field:{
          name:'',
          value:'',
        },
        fields:[], 

        contactAux:{},
        contacts:[],
        contact:{
          firstName:'',
          lastName:'',
          cellularPhone: '',
          email:''
        },


        form:{
          firstName:'',
          lastName:'',
          cellularPhone:'',
          email:''
        },

        addressExist:false,
        fieldExist:false,

        addressEdit:false,
        fieldEdit:false,

        contactExist:false,
        contactEdit:false,

        address:{
          address:'',
          city:'',
          state:'',
          zipCode:''
        },
        addressAux:{},
        addresses:[],

      }
    },
    
    /*=== VALIDATIONS ===*/
    validations: {
      form:{
        firstName:{required},
        lastName:{required},
        cellularPhone: {required},
        email:{required,email}
      },
      field:{
        name:{required},
        value:{required},
      },
      contact:{
        firstName:{required},
        lastName:{required},
        cellularPhone: {required},
        email:{required,email}
      },
      address:{
        address:{required},
        city:{required},
        state:{required},
        zipCode:{required}
      },
    },

    mounted() {
      this.$nextTick(function () {

      })
    },
    methods:{
      deleteError(){
        this.fieldExist=false;
        this.addressExist=false;
        this.contactExist=false;
      },

      //-------------------------------------------- ADDRESS
      addField(){
        this.fieldExist=false;
        this.$v.field.$touch()
        if (this.$v.field.$error) {
          alert.error('Please review the fields again.');
          return
        }
        if(this.fieldEdit){
          this.fields.push(this.field);
          this.field={
            name:'',
            value:'',
          };
          this.fieldEdit=false;
        } else if(!this.existField() && !this.fieldEdit){
          //quitar las opciones
          if(this.field.name=='evening_phone'){
            this.selectOptions[0].disable=true;
          }else
          if(this.field.name=='day_phone'){
            this.selectOptions[1].disable=true;
          }else
          if(this.field.name=='email'){
            this.selectOptions[2].disable=true;
          }else          
          if(this.field.name=='cellular_phone'){
            this.selectOptions[3].disable=true;
          }
          this.fields.push(this.field);
          this.field={
            name:'',
            value:'',
          };
        }
      },
      existField(){
        if(this.fields.find( item => item.value === this.field.value )){
          this.fieldExist=true;
          return true;
        }else 
        this.fieldExist=false;
        return false;
      },
      cancelField(){
        this.fieldEdit=false;
        this.fields.push(this.fieldAux);
        this.field={
          name:'',
          value:'',
        };
      },
      editField(data){
        this.fieldAux = Object.assign({},data);

        var indice = this.fields.indexOf(data);  
        this.fields.splice(indice, 1);

        this.fieldEdit=true;
        this.field = Object.assign({},data);
      },
      deleteField(data,pos){
    
        if(data.name=='evening_phone'){
          this.selectOptions[0].disable=false;
        }else
        if(data.name=='day_phone'){
          this.selectOptions[1].disable=false;
        }else
        if(data.name=='email'){
          this.selectOptions[2].disable=false;
        }else        
        if(data.name=='cellular_phone'){
          this.selectOptions[3].disable=false;
        }
        this.fields.splice(pos, 1);
      },

      //-------------------------------------------- ADDRESS
      addAddress(){
        this.addressExist = false
        if(this.addressEdit){
          this.addresses.push(this.address);
          this.address={
            address:'',
            city:'',
            state:'',
            zipCode:''
          };
          this.addressEdit=false;
        } else 
        if(!this.existAddress()){
          this.addresses.push(this.address);
          this.address={
            address:'',
            city:'',
            state:'',
            zipCode:''
          };
          this.addressEdit=false;
        }
      },
      editAddress(data){
        this.addressAux = Object.assign({},data);
        this.addressEdit=true;

        var index = this.addresses.indexOf(data);
        this.addresses.splice(index, 1);

        this.address= Object.assign({},data);
      },
      cancelAddress(){
        this.addressEdit=false;
        this.addresses.push(this.addressAux);
        this.address={
          address:'',
          city:'',
          state:'',
          zipCode:''
        };
      },
      existAddress(){
  
        if(this.addresses.find( item => item.address === this.address.address )){
          this.addressExist=true;
          return true;
        }else 
        this.addressExist=false;
        return false;
      },
      deleteAddress(data) {
        this.addresses.splice(data, 1);
        
      },
      //-------------------------------------------- CONTACTS
      addContact(){
        this.contactExist = false
        if(this.contactEdit){
          this.contacts.push(this.contact);
          this.contact={
            firstName:'',
            lastName:'',
            cellularPhone: '',
            email:''
          };
          this.contactEdit=false;
        } else 
        if(!this.existContact()){
          this.contacts.push(this.contact);
          this.contact={
            firstName:'',
            lastName:'',
            cellularPhone: '',
            email:''
          };
          this.contactEdit=false;
        }
      },
      editContact(data){
        this.contactAux = Object.assign({},data);
        this.contactEdit=true;
        var index = this.contacts.indexOf(data);
        this.contacts.splice(index, 1);
        this.contact= Object.assign({},data);
      },
      cancelContact(){
        this.contactEdit=false;
        this.contacts.push(this.contactAux);
        this.contact={
          firstName:'',
          lastName:'',
          cellularPhone: '',
          email:''
        };
      },
      existContact(){
        if(this.contacts.find( item => item.firstName === this.contact.firstName )){
          this.contactExist=true;
          return true;
        }else 
        this.contactExist=false;
        return false;
      },
      deleteContact(data) {
        this.contacts.splice(data, 1);
      },
      //----------------------- SUBMIT
      submit(){
    
        //console.log(this.form);
        //console.log(this.address);

        var params = {
          full_name: this.form.firstName + ' ' + this.form.lastName, 
          first_name: this.form.firstName,
          last_name:this.form.lastName,
          email:this.form.email,
          //password:null,
          profile:{
            fields:this.fields
          },
          addresses:this.addresses
        }


        this.$v.form.$touch()

        if (this.$v.form.$error) {
          alert.error('Please review the fields again.');
     
          return
        }
      },
    }
  }
</script>

<style lang="stylus">
  @import "~variables"; 
  
  .border    
    border: 3px solid $grey-3;
    
</style>