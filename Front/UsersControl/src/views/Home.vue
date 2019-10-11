<template>
  <v-card>
    <v-card-title>
      <h1>Produtos</h1>    
      
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
      :items="products"
      :search="search"
      :pagination.sync="pagination"        
      class="elevation-1"
     >      
      <template v-slot:items="props">
        <tr>          
          <td>{{props.item.description}}</td>
          <td>{{props.item.manufacturer}}</td> 
          <td>{{props.item.price}}</td> 
          <td class="text-xs-center">
            <v-btn icon @click="addProductToChart(products.find(i => i === props.item))">
              <v-icon>
                add_shopping_cart
              </v-icon>
            </v-btn>
            <v-btn icon @click="clickProductEdit(products.find(i => i === props.item))">
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon 
              @click="deleteProduct(products.find(i => i === props.item))">
                delete
              </v-icon>
            </v-btn>
          </td>       
        </tr>
      </template>
    </v-data-table>    
    <v-dialog v-model="dialog" persistent max-width="800">
      <productRegister 
        v-on:OnCloseProductScreen="closeProductScreen"
        v-on:updateProductItem='childCreated'>
      </productRegister>
    </v-dialog>
  </v-card>  
</template>

<script>
import productRegister from '../components/Product'
import CartData from '../data/CartData'
export default {
  data() {
    return {
      pagination: {
        rowsPerPage: 10
      },
      search: '',
      headers: [
          {
            text: 'Descrição',
            value: 'description'
          },
          { 
            text: 'Fabricante', 
            value: 'manufacturer' 
          },
          {
            text: "Valor Unitário",
            value: "price"
          },
          {
            text: 'Opções',
            value: '_id',
            sortable: false,
            align: 'center'            
          }          
        ],
      products: [],
      selectedItem: Object,
      dialog: false,
      editFunc: Function
    }
  },
  components: {
        'productRegister': productRegister
  },
  methods: {
    closeProductScreen(ProductRegistered) {      
      this.dialog = false;
      if (ProductRegistered)
        this.fetchProducts();
    },
    fetchProducts(){
      fetch("http://localhost:3000/product/").then(response => response.json()).then(data => {
          this.products = data;
        }).catch(function(error) {
          console.error(error);
        });  
    },
    deleteProduct(item){         
      var vm = this;

      var data = {
        "_id": item._id
      }
      fetch("http://localhost:3000/product/", {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify( data )
      }).then(function(response){
        if (response.ok){          
          vm.fetchProducts();
        }else{
          console.log(response);
        }
      }).catch( function(error){
        console.log(error);
      });      
    },
    childCreated(childFunc){
      this.editFunc = childFunc;
    },
    clickProductEdit(item){
      this.dialog = true;
      this.editFunc(item);
    },
    addProductToChart(item){
      var cartProducts = CartData.getProducts();            
      var productData = null;
      
      function EncontrarProduto(itemProd){
        if (itemProd.product._id === item._id)
          productData = itemProd;
      }

      cartProducts.forEach(EncontrarProduto);

      if (!productData)
        cartProducts.push({
          "product": item,
          "quantity": 1,
          "discount": 0
          });
      else productData.quantity += 1;

      CartData.setProducts(cartProducts);
    }
  },
  mounted() {
    this.fetchProducts();
  }
}
</script>
