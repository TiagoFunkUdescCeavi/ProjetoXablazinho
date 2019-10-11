<template>
  <v-card>
    <v-card-title>
      <h1>Carrinho</h1>    
                   
      <v-spacer></v-spacer>
           
    </v-card-title>
    
    <v-data-table
      :headers="headers"
      :items="cartProducts"
      :pagination.sync="pagination"        
      class="elevation-1"
     >      
      <template v-slot:items="props">
        <tr>
          <td>{{props.item.product.description}}</td>
          <td>{{props.item.quantity}}</td>
          <td>{{props.item.product.price}}</td>        
          <td>{{props.item.discount}}</td>
          <td class="text-xs-center">
            <v-btn icon @click="clickOrderEdit(cartProducts.find(i => i === props.item))">
              <v-icon> 
                edit
              </v-icon>
            </v-btn>
            <v-btn icon @click="clickOrderDelete(cartProducts.find(i => i === props.item))">              
              <v-icon >
                delete
              </v-icon>
            </v-btn>
          </td>       
        </tr>
      </template>
    </v-data-table>          
    <v-layout>
      <v-flex md2>
        <v-card-text>Valor Total: R${{totalValue}}</v-card-text>
      </v-flex>
      <v-flex xs12 md4>
        <v-select
        v-model="selected"
        :items="clients"
        item-text="name"
        label="Cliente"
        v-on:change="changeClient"
        return-object
        ></v-select>
      </v-flex>      
      <v-flex xs12 md4>
        <v-btn @click="salvar">
          Finalizar Pedido
        </v-btn>
      </v-flex>
    </v-layout>      
    <v-snackbar
      v-model="snackbar" 
      :bottom="false"
      :left="false"
      :multi-line="true"
      :right="false"
      :timeout="5000"
      :top="true"
      :vertical="false">
    {{snackText}}
    <v-btn
        color="pink"
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-dialog v-model="dialog" persistent max-width="800">
      <OrderScreen 
        v-on:OnCloseOrderScreen="closeOrderScreen"
        v-on:updateOrderItem='childCreated'>
      </OrderScreen>
    </v-dialog>    
  </v-card>  
</template>

<script>
import CartData from '../data/CartData';
import OrderScreen from '../components/Order'
import { log } from 'util';
export default {
    data(){
        return {
            cartProducts: CartData.getProducts(),
            selected: null,
            clients: [],
            totalValue: this.getTotalValue(),
            snackbar: false,
            snackText: "",
            dialog: false,
            editFunc: Function,
            pagination:{
                rowsPerPage: 10
            },
            headers:[
                {
                    text: 'Produto',
                    value: 'description',
                    sortable: false
                },
                {
                    text: 'Quantidade',
                    value: 'quantity',
                    sortable: false
                },
                {
                    text: 'Valor Unitário',
                    value: 'price',
                    sortable: false
                },
                {
                    text: 'Desconto %',
                    value: 'discount',
                    sortable: false
                },
                {
                  text: 'Opções',
                  value: '_id',
                  sortable: false,
                  align: "center"
                }
            ],
          orderObj: null
        }
    },
    mounted(){
      this.fetchClients();
    },
    components:{
      "OrderScreen": OrderScreen
    },
    methods: {
      changeClient(client){
        function changeDiscount(product){
          if (client.discount)
            product.discount = client.discount;
          else product.discount = 0;
        }

        this.cartProducts.forEach(changeDiscount);

        this.totalValue = this.getTotalValue();
      },
      childCreated(childFunc){
        this.editFunc = childFunc;
      },
      closeOrderScreen(){
        this.dialog = false;
        this.totalValue = this.getTotalValue();
      },
      fetchClients(){
        fetch("http://localhost:3000/client/").then(response => response.json()).then(data => {              
          this.clients = data;
        }).catch(function(error){
          console.log(error);
        });
      },
      getTotalValue(){
        var total = 0;
        var allProducts = CartData.getProducts();

        if (this.orderObj)
          allProducts = this.orderObj.products;

        function sumTotal(item){
          var itemVal = item.product.price * item.quantity;
          total += (itemVal * (1 - (item.discount / 100)));
        }

        allProducts.forEach(sumTotal);

        return total;
      },
      updateOrder(){
        this.orderObj.client = this.selected;
        const data = JSON.stringify(this.orderObj);
        var vm = this;
        fetch("http://localhost:3000/order/", {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: data
        }).then(function(response) {                   
            vm.cartProducts = [];
            vm.selected = null;
            vm.totalValue = 0;              
            vm.$emit("OnCloseCartScreen");
            vm.orderObj = null;
        }).catch(function(error) {
          console.log(error);
        });        
      },
      salvar(){
        if (!this.selected){
          this.snackText = "Necessário selecionar um cliente!";
          this.snackbar = true;
          return;
        }

        if (this.cartProducts.length == 0){
          this.snackText = "Não há produtos no carrinho!";
          this.snackbar = true;
          return;
        }

        if (this.orderObj){
          this.updateOrder();
          return;
        }
        
        const newOrder = {
          "client": this.selected,
          "products": this.cartProducts
        };

        const data = JSON.stringify( newOrder );

        var vm = this;

        fetch("http://localhost:3000/order/", {
              headers: {
                  'accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              method: "PUT",
              body: data
          }).then(function(response) {     
              CartData.setProducts([]);
              vm.cartProducts = [];
              vm.selected = null;
              vm.totalValue = 0;
              vm.snackText = "Pedido realizado com sucesso, você pode encontrá-lo na página de pedidos de cada cliente!";
              vm.snackbar = true;
          }).catch(function(error) {
            console.log(error);
          });
      },
      clickOrderEdit(item){
        this.dialog = true;
        this.editFunc(item);
      },
      clickOrderDelete(item){
        var index = this.cartProducts.indexOf(item);
        if (index > -1){
          this.cartProducts.splice(index, 1);          
          this.totalValue = this.getTotalValue();
        }
      },
      orderItem(order){
        this.orderObj = order;
        this.cartProducts = order.products;
        this.selected = order.client;
        this.totalValue = this.getTotalValue();
      }      
    },
    created(){
      this.$emit("updateCartItem", this.orderItem);
    }
}
</script>