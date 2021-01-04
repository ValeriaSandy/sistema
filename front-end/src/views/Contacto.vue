<template> 
<default-dashboard>
             <v-toolbar>
            <v-toolbar-title> Mis Contactos</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
          
              <v-spacer></v-spacer>
               <!-- Dialogo para agregar/modificar un usuario -->
            <v-dialog v-model="dialog" max-width="400px">
              <template v-slot:activator="{ on }">
               <v-btn class="mx-2" fab dark color="primary" v-on="on">
                          <v-icon dark>mdi-plus</v-icon>
               </v-btn>
              </template>
              <v-card outlined >
          <v-card-title >
            {{formTitle}}
          </v-card-title>
          <v-divider/>
          <v-container>
            <v-card-text>
              <v-form>
            <v-row class="mx-2">
              <v-col class="align-center justify-space-between" cols="6">              
                  <v-text-field v-model="contacto.nombre" prepend-icon="person" placeholder="Nombres"></v-text-field>                
              </v-col>
                <v-col class="align-center justify-space-between" cols="6">              
                  <v-text-field v-model="contacto.apellido" prepend-icon="person" placeholder="Apellidos"></v-text-field>                
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="contacto.telefono" prepend-icon="mdi-phone" placeholder="Telefono"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="contacto.email"  prepend-icon="mdi-mail" placeholder="Email"></v-text-field>
              </v-col>  
               <v-col cols="6">
                <v-text-field v-model="contacto.direccion"  prepend-icon="mdi-address" placeholder="Direccion"></v-text-field>
              </v-col>
            </v-row>
              </v-form>
                <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">  </div>
            </v-card-text>
          </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
              <v-btn color="error"  @click="close">Cancelar</v-btn>
              <v-btn color="success"  @click="guardar">Guardar</v-btn>
          </v-card-actions>
        </v-card>
            </v-dialog>
           <v-dialog v-model="dialogDelete" max-width="500px">
           <v-card>
            <v-card-title class="headline">Estas seguro de eliminar este contacto?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="erros" text @click="closeDelete">NO</v-btn>
              <v-btn color="success" text @click="deleteItemConfirm">SI</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
             </v-toolbar>     
        <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg3 v-for="(item, index) in contactos"  :key="index">
          <v-card   class="text-xs-center ma-3" >
            <v-responsive class="pt-4" >
              <v-avatar color="blue-grey lighten-3" permanent size="50" >
                 <span class="white--text headline text-uppercase" >{{item.nombre.charAt(0)}} {{item.apellido.charAt(0)}}</span>
              </v-avatar>
            </v-responsive>
            <v-card-text>
              <div class="subheading">{{nombres}}:{{ item.nombre }}</div>
              <div class="grey--text">{{apellidos}}{{ item.apellido }}</div>
              <div class="grey--text">{{telefono}}{{ item.telefono}}</div>
              <div class="grey--text">{{correo}}:{{ item.email}}</div>
          <v-btn icon  @click="editContacto(item)">
            <v-icon color="success" >mdi-square-edit-outline</v-icon>
          </v-btn>
          <v-btn icon  @click="deleteContacto(item)">
            <v-icon color="red">mdi-delete-outline</v-icon>
          </v-btn>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
</default-dashboard>
</template>

<script>
import DefaultDashboard from '../components/DefaultDashboard'
export default {
    name:'Contactos',
  data() {
    return {
      nombres:'Nombres:',
      apellidos: 'Apellidos:',
      telefono:'Telefono:',
      correo:'Email',
      dialog: false,
      dialogDelete: false,
      search :"",
      contactos: [],
      contacto:{},
      valida: 0,
      validaMensaje: [],
      editedIndex: -1,
       snackbar: true, 
      mensaje: 'Bienvenido',
        color: "success",
        mode: '',
        x: 'right',
        y: 'top',
    }
  },
  components:{
      DefaultDashboard
  },
  computed: {
      formTitle() {
      return this.editedIndex === -1 ? "Nuevo contacto" : "Actualizar Contacto";
    },
     formattedDate () {
      console.log(this.due)
      return this.due ? format(this.due, 'Do MMM YYYY') : ''
    }
  },

   watch: {
    dialog(val) {
      val || this.close();
    },
     dialogDelete (val) {
        val || this.closeDelete()
      },
  },
   created(){ 
    this.listarContactos();
  },

   methods: {

    listarContactos(){
      let me = this;
      let header={"Token" : this.$store.state.token};
      let configuracion= {headers : header};
      this.axios.get('/contacto/getAll',configuracion)
      .then(function(response) {
        me.contactos = response.data;
      })
      .catch((e)=>{
        console.log(error);
      })
    },

    limpiar() {
      this.contacto._id = "";
      this.contacto.nombre = "";
      this.contacto.apellido="";
      this.contacto.telefono="";
      this.contacto.email="";
      this.contacto.direccion="";
       this.validaMensaje = [];
      this.editedIndex = -1;
    },

    close() {
      this.dialog = false;
      this.limpiar();
    },
    deleteContacto(item){
      let header={"Token" : this.$store.state.token};
      let configuracion= {headers : header};
      this.axios.delete(`contacto/deleteOne${item._id}`, configuracion)
      .then(res => {
        this.editedIndex = this.contactos.indexOf(item)
        this.dialogDelete= true;
      })
    },
   deleteItemConfirm () {
        this.contactos.splice(this.editedIndex, 1)
        this.closeDelete()
      },

    closeDelete () {
        this.dialogDelete = false
        
      },
      editContacto(item) {
      this.contacto._id = item._id;
      this.contacto.nombre= item.nombre;
      this.contacto.apellido = item.apellido;
      this.contacto.telefono = item.telefono;
      this.contacto.email = item.email;
      this.contacto.direccion = item.direccion;
      this.editedIndex = 1;
      this.dialog = true;     
    },
    validar(){
                this.valida=0;
                this.validaMensaje=[];
                if(!this.contacto.nombre){
                    this.validaMensaje.push('Escriba un Nombre');
                }
                if(!this.contacto.apellido){
                    this.validaMensaje.push('Escriba un Apellido.');
                }
                 if(!this.contacto.telefono){
                    this.validaMensaje.push('Escriba un Telefono.');
                }
                if(!this.contacto.email){
                    this.validaMensaje.push('Escriba un Email.');
                }
                if(!this.contacto.direccion){
                    this.validaMensaje.push('Escriba una Direccion.');
                }
                
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
     guardar() {
      let header={"Token" : this.$store.state.token};
      let configuracion= {headers : header};
       if (this.validar()){
                    return;
                }
      if (this.editedIndex > -1) {
        // Código para Guardar una edición
        this.axios.put(`contacto/updateOne${this.contacto._id}`,{
            _id: this.contacto._id,
            nombre: this.contacto.nombre,
            apellido: this.contacto.apellido,
            telefono: this.contacto.telefono,
            email: this.contacto.email,
            direccion: this.contacto.direccion
          },configuracion)
          .then(res => {
          this.listarContactos(); 
          this.close();
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        // Código para Guardar
        let newContacto = {
            _id: this.contacto._id,
            nombre : this.contacto.nombre,
            apellido: this.contacto.apellido,
            telefono: this.contacto.telefono,
            email: this.contacto.email,
            direccion: this.contacto.direccion,
         }
       this.axios.post('contacto/createOne', newContacto, configuracion)
        .then(res => {
          this.close();
          this.listarContactos();
          this.limpiar();        
        })
        .catch( e => {
          console.log('error'+ e);
        })

      }
     },
    
  },
}
</script>