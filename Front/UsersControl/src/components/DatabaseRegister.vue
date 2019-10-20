<template>
  <v-card>    
    <v-card-title>
      <span class="headline">Cadastro de banco de dados</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>              
          <v-flex xs12>
            <v-text-field label="Nome*" v-model="name" required></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Servidor*" v-model="server" required></v-text-field>
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
        name: "",
        server: "",
        snackbar: false,
        text: "",
        itemObject: undefined
      };
    },
    mounted(){
      this.registered = false;
    },
    created: function() {
      this.$emit('OnDatabaseCreated', this.updateDatabaseItem);
    },
    methods: { 
        updateDatabaseItem(item){
          this.itemObject = item;

          if (this.itemObject) {
            this.name = this.itemObject.name;
            this.server = this.itemObject.servername;
          }
        },
        close() {
          this.$emit("OnCloseDatabaseScreen", this.registered);
          this.registered = false;
          this.itemObject = null;
          this.clean();
          this.snackbar = false;
        },
        clean() {          
          this.name = "";
          this.server = "";
        },             
        updateItem(){
          this.itemObject.name = this.name;
          this.itemObject.servername = this.server;          
          var vm = this;
          
          fetch("http://localhost:3000/users/update", {
              headers: {
                  'accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              method: "POST",
              body: JSON.stringify(this.itemObject)
          }).then(response => response.json()).then(data => {        
            vm.snackbar = true;
            
            if (data.error){
              vm.text = data.error;              
            }else{
              vm.text = data.sucess;
              vm.registered = true;
            }

            vm.clean();            
          }).catch(function(error) {
            undefined
          });              
        },
        saveItem(){
          let data = {
            name: this.name,
            serverName: this.server
          };

          var vm = this;                

          fetch("http://localhost:3000/dbs/register", {
              headers: {
                  'accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              method: "PUT",
              body: JSON.stringify(data)
          }).then(response => response.json()).then(data => {        
            vm.snackbar = true;
            
            if (data.error){
              vm.text = data.error;              
            }else{
              vm.text = 'Banco de dados cadastrado com sucesso';
              vm.registered = true;
            }

            vm.clean();            
          }).catch(function(error) {
            undefined
          });       
        },
        submit() {
          if (this.itemObject)
            this.updateItem();
          else this.saveItem(); 
          
          this.clean();
          this.itemObject = undefined;
        }
    }
};
</script>