<template>
 <default-dashboard>
         <v-toolbar>
            <v-toolbar-title> Mis Notas</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
              class="text-xs-center"
              v-model="search"
              append-icon="search"
              label="Búsqueda"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <!-- Dialogo para agregar/modificar un usuario -->
            <v-dialog v-model="dialog" max-width="400px">
              <template v-slot:activator="{ on }">
               <v-btn class="mx-2" fab dark color="primary" v-on="on">
                     <v-icon dark>mdi-plus</v-icon>
               </v-btn>
              </template>
              <v-card>
               <v-card-title>
                  {{formTitle}}
               </v-card-title>
               <v-divider/>
               <v-container>
               <v-card-text>
                  <v-form>
                  <v-text-field v-model="nota.titulo" label="Titulo" prepend-icon="edit"></v-text-field>
                  <v-textarea v-model="nota.descripcion" label="Descripcion" prepend-icon="edit"></v-textarea>        
                 </v-form>
                  <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">  </div>
                 </v-card-text>
               </v-container>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                      <v-btn color="error"  @click="close">Cancelar</v-btn>
                      <v-btn color="success"  @click="guardar">Guardar</v-btn>
                  </v-card-actions>
            </v-card>
            </v-dialog>
             <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Estas seguro de eliminar esta nota?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="closeDelete">NO</v-btn>
              <v-btn color="success" text @click="deleteItemConfirm">SI</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
          </v-toolbar>
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg3 v-for="(item, index) in notas" :key="index">
          <v-card  outlined flat class="text-xs-center ma-3">
            <v-responsive class="pt-4">
               <v-chip elevation="5" class="ma-2" color="pink" label text-color="white">
                    <v-icon left>mdi-pin</v-icon>             
               </v-chip>
            </v-responsive>
            <v-card-text>
              <div class="subheading">Titulo :{{ item.titulo }}</div>
              <div class="grey--text">Descripcion: {{ item.descripcion }}</div>
           <v-btn icon  @click="editNota(item)">
            <v-icon color="success" >mdi-square-edit-outline</v-icon>
          </v-btn>
          <v-btn icon  @click="deleteNota(item)">
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
    name:'Notas',
  data() {
    return {
      titulo:'titulo:',
      descripcion: 'Descripcion:',
      dialog: false,
      dialogDelete: false,
      search :"",
      notas: [],
      nota:{},
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
      return this.editedIndex === -1 ? "Nueva Nota" : "Actualizar Nota";
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
    this.listarNotas();
  },

   methods: {

     listarNotas(){
      let me = this;
      let header={"Token" : this.$store.state.token};
      let configuracion= {headers : header};
      this.axios.get('/nota/getAll',configuracion)
      .then(function(response) {
        me.notas = response.data;
      })
      .catch((e)=>{
        console.log(error);
      })
    },
     deleteNota(item){
       let header={"Token" : this.$store.state.token};
      let configuracion= {headers : header};
      this.axios.delete(`nota/deleteOne${item._id}`, configuracion)
      .then(res => {
        this.editedIndex = this.notas.indexOf(item)
        this.dialogDelete = true;
      })
    },
    deleteItemConfirm () {
        this.notas.splice(this.editedIndex, 1)
        this.closeDelete()
      },

    closeDelete () {
        this.dialogDelete = false
        
      },
      close() {
      this.dialog = false;
    },
      editNota(item) {
      this.nota._id = item._id;
      this.nota.titulo= item.titulo;
      this.nota.descripcion = item.descripcion;
      this.editedIndex = 1;
      this.dialog = true;     
    },
     validar(){
                this.valida=0;
                this.validaMensaje=[];
                if(!this.nota.titulo){
                    this.validaMensaje.push('Escriba un Titulo.');
                }
                if(!this.nota.descripcion){
                    this.validaMensaje.push('Escriba una descripcion.');
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
        this.axios.put(`nota/updateOne${this.nota._id}`,{
            _id: this.nota._id,
            titulo: this.nota.titulo,
            descripcion: this.nota.descripcion,
          },configuracion)
          .then(res => {
          this.close();
          this.listarNotas(); 
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        // Código para Guardar
        let newNota = {
            _id: this.nota._id,
            titulo : this.nota.titulo,
            descripcion: this.nota.descripcion,
         }
       this.axios.post('nota/createOne', newNota, configuracion)
        .then(res => {
          this.close();
          this.listarNotas();
          this.limpiar();        
        })
        .catch( e => {
          console.log('error'+ e);
        })
      }
     },
    limpiar() {
      this.nota._id = "";
      this.nota.titulo = "";
      this.nota.descripcion="";
       this.validaMensaje = [];
      this.editedIndex = -1;
    },
    },
}
</script>