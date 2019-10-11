<template>
  <v-card>    
    <v-card-title>
      <span class="headline">Cadastro de Produto</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>              
          <v-flex xs12>
            <v-text-field label="Descrição*" v-model="descricao" required></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Fabricante*" v-model="fabricante" required></v-text-field>
          </v-flex>              
          <v-flex xs12>
            <v-text-field label="Preço" v-model="price" type="number" prefix="R$" required></v-text-field>
          </v-flex>          
        </v-layout>
      </v-container>
      <small>*Indica campos obrigatórios</small>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" flat @click="submit">Salvar</v-btn>          
      <v-btn color="blue darken-1" flat @click="close">Fechar</v-btn>
    </v-card-actions>
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
export default {    
    data() {
      return {
        registered: false,        
        descricao: "",
        fabricante: "",
        price: 0,
        snackbar: false,
        text: "",
        itemObject: Object,
        setouObj: false
      };
    },
    mounted(){
      this.registered = false;
    },
    created: function() {
      this.$emit('updateProductItem', this.updateProductItem);
    },
    methods: { 
        updateProductItem(item){
          this.itemObject = item;
          this.setouObj = true;

          if (this.itemObject) {
            this.descricao = this.itemObject.description;
            this.fabricante = this.itemObject.manufacturer;
            this.price = this.itemObject.price;
          }
        },
        close() {
          this.$emit("OnCloseProductScreen", this.registered);
          this.registered = false;
          this.itemObject = null;
          this.clean();
          this.snackbar = false;
        },
        clean() {          
          this.descricao = "";
          this.fabricante = "";                       
          this.price = 0;
        },     
        iconClick() {
          this.registered = false; 
        },
        updateItem(){
          let data = {
            "_id": this.itemObject._id,
            "description": this.descricao,
            "manufacturer": this.fabricante,
            "price": this.price
          }
          data = JSON.stringify(data);          
          var vm = this;
          
          fetch("http://localhost:3000/product/", {
              headers: {
                  'accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              method: "POST",
              body: data
          }).then(function(response) {                          
              if (response.ok){       
                vm.registered = true;
                vm.text = "Produto alterado com sucesso!";
                vm.snackbar = true;
                vm.close();
              }else{
                vm.text = "Erro ao alterar um produto!";                
                vm.snackbar = true;
              }           
          }).catch(function(error) {
            vm.text = error;
            vm.snackbar = true;
          });            
        },
        saveItem(){
          let data = {
            "description": this.descricao,
            "manufacturer": this.fabricante,
            "price": this.price
          };

          data = JSON.stringify( data );
          var vm = this;                

          fetch("http://localhost:3000/product/", {
              headers: {
                  'accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              method: "PUT",
              body: data
          }).then(function(response) {            
              if (response.ok){
                  vm.registered = true;
                  vm.text = "Produto cadastrado com sucesso!";                
                  vm.snackbar = true;                    
              }else{
                  vm.text = "Erro ao cadastrar um produto!";                
                  vm.snackbar = true;
              }
              vm.clean();
          }).catch(function(error) {            
              vm.text = error;
              vm.snackbar = true;
              vm.clean();
          });           
        },
        submit() {
          if (this.setouObj)
            this.updateItem();
          else this.saveItem(); 
          
          this.clean();
          this.setouObj = false;
          this.itemObject = null;
        }
    }
};
</script>