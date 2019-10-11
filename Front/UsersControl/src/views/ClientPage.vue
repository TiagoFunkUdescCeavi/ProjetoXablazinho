<template>
  <v-card>
    <v-card-title>
      <h1>Clientes</h1>
      
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
      :items="clients"
      :search="search"
      :pagination.sync="pagination"        
      class="elevation-1"
     >      
      <template v-slot:items="props">
        <tr>          
          <td>{{props.item.name}}</td>
          <td>{{props.item.cpf}}</td>
          <td>{{props.item.street}}</td>
          <td>{{props.item.houseNumber}}</td>
          <td>{{props.item.neighborhood}}</td>
          <td>{{props.item.city}}</td>
          <td>{{props.item.cep}}</td>
          <td>{{props.item.state}}</td>
          <td>{{props.item.discount}}</td>
          <td class="text-xs-center">
            <v-btn icon @click="showOrders(clients.find(i => i === props.item))">
              <v-icon> 
                library_books
              </v-icon>
            </v-btn>
            <v-btn icon @click="clickClientEdit(clients.find(i => i === props.item))">
              <v-icon> 
                edit
              </v-icon>
            </v-btn>
            <v-btn icon @click="deleteClient(clients.find(i => i === props.item))">              
              <v-icon >
                delete
              </v-icon>
            </v-btn>
          </td>       
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" persistent max-width="800">
      <clientRegister 
        v-on:OnCloseClientScreen="closeClientScreen"
        v-on:updateClientItem="clientCreated">
      </clientRegister>
    </v-dialog>
    <v-dialog v-model="dialogOrders">
      <ClientOrders
        v-on:OrderScreenCreated="orderScreenCreated">
      </ClientOrders>
    </v-dialog>
  </v-card>
</template>

<script>
import clientRegister from '../components/Client'
import ClientOrders from '../components/ClientOrders'
export default {
    data() {
        return {
            pagination: {
                rowsPerPage: 10},
            search: '',
            headers: [
                {
                    text: 'Nome',
                    value: 'name'
                },
                { 
                    text: 'CPF', 
                    value: 'cpf' 
                },
                { 
                    text: 'Logradouro', 
                    value: 'street' 
                },
                { 
                    text: 'Número', 
                    value: 'houseNumber' 
                },
                { 
                    text: 'Bairro', 
                    value: 'neighborhood' 
                },
                { 
                    text: 'Cidade', 
                    value: 'city' 
                },
                { 
                    text: 'CEP', 
                    value: 'cep' 
                },
                { 
                    text: 'Estado', 
                    value: 'state' 
                },
                {
                  text: "Desconto %",
                  value: "discount"
                },
                {
                    text: 'Opções',
                    value: '_id',
                    sortable: false,
                    align: 'center'            
                }          
                ],
            clients: [],
            dialog: false,
            dialogOrders: false,
            editFunc: Function,
            orderFunc: Function
        }
    },
    components: {
        'clientRegister': clientRegister,
        'ClientOrders': ClientOrders
    },
    methods: {
        fetchClients(){
            fetch("http://localhost:3000/client/").then(response => response.json()).then(data => {
                this.clients = data;
            }).catch(function(error){
                console.log(error);
            });
        },
        closeClientScreen(pRegistered){          
            this.dialog = false;
            if (pRegistered)
              this.fetchClients();
        },
        orderScreenCreated(childFunc){
          this.orderFunc = childFunc;
        },
        deleteClient(item){          
          var vm = this;
          var data = JSON.stringify({
            "_id": item._id
          });
          fetch("http://localhost:3000/client/", {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: data
          }).then(function(response){
            if (response.ok){          
              vm.fetchClients();
            }else{
              console.log(response);
            }
          }).catch( function(error){
            console.log(error);
          });  
        },
        clickClientEdit(item){
          this.dialog = true;
          this.editFunc(item);
        },
        clientCreated(childFunc){
          this.editFunc = childFunc;
        },
        showOrders(item){   
          this.dialogOrders = true;
          this.orderFunc(item);
        }
    },
    mounted(){
        this.fetchClients();
    }
}
</script>