<template>
  <v-card>
    <v-card-title>
      <h1>Usuários</h1>    
      
      <v-btn icon @click="dialog = true">
        <v-icon>add</v-icon>
      </v-btn>
             
      <v-spacer></v-spacer>
      
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    
    <v-data-table
      :headers="headers"
      :items="dbUsers"
      :search="search"
      :pagination.sync="pagination"        
      class="elevation-1"
     >      
      <template v-slot:items="props">
        <tr>          
          <td>{{props.item.name}}</td>
          <td>{{props.item.isadmin}}</td>
          <td>{{props.item.expirationdate}}</td>
          <td class="text-xs-center">
            <v-btn icon @click="clickGetToken(dbUsers.find(i => i === props.item))">
              <v-icon>
                get_app
              </v-icon>
            </v-btn>
            <v-btn icon @click="clickEditUser(dbUsers.find(i => i === props.item))">
              <v-icon>
                edit
              </v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon @click="deleteUser(dbUsers.find(i => i === props.item))">
                delete
              </v-icon>
            </v-btn>
          </td>       
        </tr>
      </template>
    </v-data-table>    
    <v-dialog v-model="dialog" persistent max-width="800">
      <user-register 
        v-on:OnCloseUserRegister="OnCloseUserRegister"
        v-on:OnUserCreated='OnUserCreated'>
      </user-register>
    </v-dialog>
    <v-snackbar
      v-model="snackbar" 
      :bottom="false"
      :left="false"
      :multi-line="true"
      :right="false"
      :timeout="6000"
      :top="true"
      :vertical="false">
    {{text}}
    <v-btn
        color="pink"
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-card>  
</template>

<script>
import UserRegister from '../components/UserRegister'
export default {
  data() {
    return {
      pagination: {
        rowsPerPage: 10
      },
      search: '',
      headers: [
          {
            text: 'User name',
            value: 'name'
          },
          { 
            text: 'Admin', 
            value: 'isadmin' 
          },          
          { 
            text: 'Expiration',
            value: 'expirationdate' 
          },          
          {
            text: 'Options',
            value: '_id',
            sortable: false,
            align: 'center'            
          }          
        ],
      dbUsers: [],
      dialog: false,
      editFunc: Function,
      snackbar: false,
      text: ''
    }
  },
  components: {
        'user-register': UserRegister
  },
  methods: {
    OnCloseUserRegister(registered) {      
      this.dialog = false;
      if (registered)
        this.fetchUsers();
    },
    fetchUsers(){
      const database = JSON.parse(localStorage.getItem('database'));
      if (!database){
        this.$router.push({name: 'home'});
        return;
      }
      fetch("http://localhost:3000/users/?dbid=" + database.id).then(response => response.json()).then(data => {        
          this.dbUsers = data;
        }).catch(function(error) {
          undefined
        });  
    },
    deleteUser(item){
      var vm = this;

      var data = JSON.stringify({
        id: item.id
      });
      fetch("http://localhost:3000/users/delete", {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: data
      }).then(response => response.json()).then(data => {        
        if (data.sucess){
          this.fetchUsers();
        }
      }).catch(function(error) {
        console.error(error);
      });  
    },
    OnUserCreated(childFunc){
      this.editFunc = childFunc;
    },
    clickEditUser(item){
      this.dialog = true;
      this.editFunc(item);
    },
    clickGetToken(item){
      var vm = this;
      fetch("http://localhost:3000/users/token/?name=" + item.name + "&dbid=" + item.dbid, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      }).then(response => response.json()).then(data => {        
        if (data.token){
          vm.snackbar = true;
          vm.text = "Token: " + data.token;
        }
      }).catch(function(error) {
        undefined
      });       
    }
  },
  mounted() {
    this.fetchUsers();
  }
}
</script>
