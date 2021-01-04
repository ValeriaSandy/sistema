<template>
<div class="default-dashboard">
       <v-app-bar app   color="primary" >
        <v-app-bar-nav-icon  @click.stop="mini = !mini"></v-app-bar-nav-icon>
        <v-toolbar-title>Agenda</v-toolbar-title>
           <v-spacer></v-spacer>
       <v-btn  icon @click="LogUserOut">
        <v-icon  color="orange darken-2">mdi-export</v-icon>
      </v-btn>
       </v-app-bar>
      <v-navigation-drawer
        v-model="drawer" :mini-variant.sync="mini" permanent   dense  app >
         <v-list-item  class="px-2">
        <v-list-item-avatar>
          <v-responsive class="pt-4">
              <v-avatar  size="100" >
              </v-avatar>
          </v-responsive>
        </v-list-item-avatar>
        <v-list-item-title>Valeria Sandy</v-list-item-title>
        
      </v-list-item>
      <v-divider></v-divider>
        <v-list dense>
        <template v-if="esAdministrador || esUsuario || esSecretaria">
          <v-list-item :to="{name:''}">
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              Inicio
            </v-list-item-title>
          </v-list-item>
        </template> 
         <template v-if="esAdministrador">
          <v-list-item :to="{name:'usuario'}">
            <v-list-item-action>
              <v-icon>mdi-account-tie-outline</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              Administrar Usuarios
            </v-list-item-title>
          </v-list-item>
        </template>
        <template v-if="esAdministrador || esUsuario">
            <v-list-item :to="{name:'nota'}">
            <v-list-item-action>
              <v-icon>mdi-note-plus-outline</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              Notas
            </v-list-item-title>
          </v-list-item>
        </template>
        <template v-if="esAdministrador || esUsuario">
          <v-list-item :to="{name:'contacto'}">
            <v-list-item-action>
              <v-icon>mdi-contacts-outline</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              Contactos
            </v-list-item-title>
          </v-list-item>
        </template>
        <template v-if="esAdministrador || esUsuario">
          <v-list-item :to="{name:'evento'}">
            <v-list-item-action>
              <v-icon>mdi-calendar-month-outline</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              Eventos
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
      </v-navigation-drawer> 
      <v-main>
       
                <template >
                  <v-container>
                   <slot/>
                  </v-container>
                </template>
       
      </v-main >
      <v-footer color="primary" fixed padless >
        <span class="ml-auto overline">Fundacion Software Libre &copy;2020</span>
      </v-footer>
</div>  
</template>
<script>
export default {
  name: 'DefaultDashboard',
  data () {
    return {
        mini: false,
      drawer: true,
    }
  },
  computed:{
    logueado(){
      return this.$store.state.usuario;
    },
    esAdministrador(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Administrador';
    },
    esSecretaria(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Secretaria';
    },
    esUsuario(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Usuario';
    }
  },
  created(){
    this.$store.dispatch("autoLogin");
  },
  methods:{
    LogUserOut(){
           localStorage.removeItem("jwt");
      this.$router.push("/")
            }
  }
}  
</script>