<template>
  <v-card>
    <v-card-title>
      <h1>Pedidos - {{client}}</h1>    

      <v-spacer></v-spacer>      
    </v-card-title>
    
    <v-data-table
      :headers="headers"
      :items="orders"
      :pagination.sync="pagination"        
      class="elevation-1"
     >      
      <template v-slot:items="props">
        <tr>                    
          <td>{{props.item._id}}</td> 
          <td>R$ {{getTotalPrice(props.item.products)}}</td> 
          <td>{{getProductsName(props.item.products)}}</td>
          <td class="text-xs-center">
            <v-btn icon @click="editOrder(orders.find(i => i === props.item))">
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn icon @click="deleteOrder(orders.find(i => i === props.item))">
              <v-icon>delete</v-icon>
            </v-btn>
          </td>       
        </tr>
      </template>
    </v-data-table>   
    <v-dialog v-model="dialog" persistent="" max-width="800">
      <v-card>
        <CartPage 
          v-on:OnCloseCartScreen="closeCard"
          v-on:updateCartItem='childCreated'>
        </CartPage>
        <v-card-actions>
          <v-spacer></v-spacer>          
          <v-btn color="blue darken-1" flat @click="closeCard">Fechar</v-btn>
        </v-card-actions>    
      </v-card>
    </v-dialog>       
  </v-card>  
</template>

<script>
import CartPage from './CartPage'
export default {
  data() {
    return {
      pagination: {
        rowsPerPage: 10
      },
      headers: [
          { 
            text: 'Identificador', 
            value: '_id' 
          },
          { 
            text: 'Valor Total', 
            value: 'totalPrice' 
          },
          {
            text: "Produtos",
            value: 'products'
          },
          {
            text: 'Opções',
            value: '_id',
            sortable: false,
            align: 'center'            
          }          
        ],
      orders: [],
      client: "",
      clientObj: null,
      cartFunc: Function,
      dialog: false
    }
  },
  components:{
    "CartPage": CartPage
  },
  created(){
    this.$emit("OrderScreenCreated", this.updateClient);
  },
  methods:{
    closeCard(){
      this.fetchOrders();
      this.dialog = false;
    },
    childCreated(childFunc){
      this.cartFunc = childFunc;
    },
    updateClient(item){      
      this.clientObj = item;
      this.client = this.clientObj.name;
      this.fetchOrders();
    },
    getProductsName(products){
      var names = "";

      function addNames(item){
        names += item.product.description + "; ";
      }

      products.forEach(addNames);
      
      return names;
    },
    getTotalPrice(products){
      var totalPrice = 0.0;

      function sum(item){
        var itemVal = item.product.price * item.quantity;
        totalPrice += (itemVal * (1 - (item.discount / 100)));
      }

      products.forEach(sum);

      return totalPrice;
    },
    fetchOrders(){
      if (this.clientObj){
        fetch("http://localhost:3000/order/client?id=" + this.clientObj._id).then(response => response.json()).then(data => {              
          this.orders = data;
        }).catch(function(error){
          console.log(error);
        });        
      }
    },
    deleteOrder(item){
      var vm = this;
      var data = {
        "_id": item._id
      }
      fetch("http://localhost:3000/order/", {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify( data )
      }).then(function(response){
        if (response.ok){          
          vm.fetchOrders();
        }else{
          console.log(response);
        }
      }).catch( function(error){
        console.log(error);
      });     
    },
    editOrder(item){
      this.dialog = true;
      this.cartFunc(item);
    }
  }
}
</script>
