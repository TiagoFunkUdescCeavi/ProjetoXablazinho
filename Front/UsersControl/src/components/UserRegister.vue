<template>
  <v-card>    
    <v-card-title>
      <span class="headline">Cadastro de usuário</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>              
          <v-flex xs12>
            <v-text-field label="Nome*" v-model="name" required></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Senha*" v-model="password" type="password" required></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-checkbox
              v-model="admin"
              label="Admin"
            ></v-checkbox>
          </v-flex>
          <v-flex xs9>
            <v-text-field label="Expira em*" v-model="expiration" required></v-text-field>
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
        password: "",
        admin: false,
        expiration: "01/01/2019",
        snackbar: false,
        text: "",
        itemObject: undefined
      };
    },
    mounted(){
      this.registered = false;
    },
    created: function() {
      this.$emit('OnUserCreated', this.updateUserItem);
    },
    methods: { 
        updateUserItem(item){
          this.itemObject = item;

          if (this.itemObject) {
            this.name = this.itemObject.name;
            this.password = this.itemObject.password;
            this.admin = this.itemObject.isadmin;
            this.expiration = this.itemObject.expirationdate;
          }
        },
        close() {
          this.$emit("OnCloseUserRegister", this.registered);
          this.registered = false;
          this.itemObject = null;
          this.clean();
          this.snackbar = false;
        },
        clean() {          
          this.name = "";
          this.password = "";
          this.admin = false,
          this.expiration = '01/01/2019'
        },             
        updateItem(){
          this.itemObject.newname = this.name;
          this.itemObject.newpassword = this.password;
          this.itemObject.isadmin = this.admin;
          this.itemObject.expirationdate = this.expiration;
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
            password: this.password,
            isadmin: this.admin,
            expirationdate: this.expiration,
            dbid: JSON.parse(localStorage.getItem('database')).id
          };

          var vm = this;                

          fetch("http://localhost:3000/users/register", {
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
              vm.text = 'Usuário cadastrado com sucesso';
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