<template>
  <v-app>    
    <v-toolbar dark>         
      <v-toolbar-title class="white--text">        
        Versenha 2.0   
      </v-toolbar-title>

      <v-spacer></v-spacer>          
      
      <router-link :to="{ name: 'home' }">
        <v-btn icon >
          <v-icon>home</v-icon>
        </v-btn>
      </router-link>                

      <router-link :to="{name: 'dbUsers'}">
        <v-btn icon>
          <v-icon>account_circle</v-icon>
        </v-btn>
      </router-link>
      
    </v-toolbar>
    <v-content> 
      <router-view></router-view>     
    </v-content>  
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      //
    }
  }
}
</script>
