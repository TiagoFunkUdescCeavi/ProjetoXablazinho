<template>
  <v-card>
    <v-card-title>
      <h1>Databases</h1>    
      
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
      :items="databases"
      :search="search"
      :pagination.sync="pagination"        
      class="elevation-1"
     >      
      <template v-slot:items="props">
        <tr>          
          <td>{{props.item.name}}</td>
          <td>{{props.item.servername}}</td>
          <td class="text-xs-center">
            <v-btn icon @click="viewUsers(databases.find(i => i === props.item))">
              <v-icon>
                account_circle
              </v-icon>
            </v-btn>
            <v-btn icon @click="clickEditDatabase(databases.find(i => i === props.item))">
              <v-icon>
                edit
              </v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon @click="deleteDatabase(databases.find(i => i === props.item))">
                delete
              </v-icon>
            </v-btn>
          </td>       
        </tr>
      </template>
    </v-data-table>    
    <v-dialog v-model="dialog" persistent max-width="800">
      <database-register 
        v-on:OnCloseDatabaseScreen="OnCloseDatabaseScreen"
        v-on:OnDatabaseCreated='OnDatabaseCreated'>
      </database-register>
    </v-dialog>
  </v-card>  
</template>

<script>
import DatabaseRegister from '../components/DatabaseRegister'
export default {
  data() {
    return {
      pagination: {
        rowsPerPage: 10
      },
      search: '',
      headers: [
          {
            text: 'Database name',
            value: 'name'
          },
          { 
            text: 'Server name', 
            value: 'serverName' 
          },          
          {
            text: 'Options',
            value: '_id',
            sortable: false,
            align: 'center'            
          }          
        ],
      databases: [],
      dialog: false,
      editFunc: Function
    }
  },
  components: {
        'database-register': DatabaseRegister
  },
  methods: {
    OnCloseDatabaseScreen(registered) {      
      this.dialog = false;
      if (registered)
        this.fetchDatabases();
    },
    fetchDatabases(){
      fetch("http://localhost:3000/dbs/").then(response => response.json()).then(data => {        
          this.databases = data;
        }).catch(function(error) {
          undefined
        });  
    },
    deleteDatabase(item){
      var vm = this;

      var data = JSON.stringify({
        id: item.id
      });
      fetch("http://localhost:3000/dbs/delete", {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: data
      }).then(response => response.json()).then(data => {        
        if (data.sucess){
          this.fetchDatabases();
        }
      }).catch(function(error) {
        console.error(error);
      });  
    },
    OnDatabaseCreated(childFunc){
      this.editFunc = childFunc;
    },
    clickEditDatabase(item){
      this.dialog = true;
      this.editFunc(item);
    },
    viewUsers(item){
      localStorage.removeItem('database');
      localStorage.setItem('database', JSON.stringify(item));
      this.$router.push({name: 'dbUsers'});
    }
  },
  mounted() {
    this.fetchDatabases();
  }
}
</script>
