<template>
<default-dashboard>
    <v-layout align-start>
        <v-flex>
            <v-toolbar >
                <v-toolbar-title>Usuarios</v-toolbar-title>
                <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" 
                label="Búsqueda" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        </v-card-title>            
                        <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="nombres" label="Nombres">                                        
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="apellidos" label="Apellidos">                                        
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-select v-model="rol"
                                    :items="roles" label="Rol">
                                    </v-select>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="telefono" label="Teléfono">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="email" label="Email">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field type="password" v-model="password" label="Password">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12 v-show="valida">
                                    <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                                    </div>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        </v-card-text>            
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error"  @click="close">Cancelar</v-btn>
                        <v-btn color="success"  @click="guardar">Guardar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Estas seguro de eliminar este usuario?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="closeDelete">NO</v-btn>
              <v-btn color="success" text @click="deleteItemConfirm">SI</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
                <v-dialog v-model="adModal" max-width="290">
                    <v-card>
                        <v-card-title class="headline" v-if="adAccion==1">
                            Activar Item
                        </v-card-title>
                        <v-card-title class="headline" v-if="adAccion==2">
                            Desactivar Item
                        </v-card-title>
                        <v-card-text>
                            Estás a punto de <span v-if="adAccion==1">activar </span>
                            <span v-if="adAccion==2">desactivar </span> el item {{adNombre}}
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click="activarDesactivarCerrar()" color="primary" >
                                Cancelar
                            </v-btn>
                            <v-btn v-if="adAccion==1" @click="activar()" color="warning" >
                                Activar
                            </v-btn>
                            <v-btn v-if="adAccion==2" @click="desactivar()" color="error" >
                                Desactivar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="usuarios"
                :search="search"
                class="elevation-1"
            >
            
                <template  v-slot:[`item.opciones`]="{ item }">
                     <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil</v-icon>
                     <v-icon small class="mr-2" @click="deleteItem(item)"> mdi-delete</v-icon>
                </template>
                    
            </v-data-table>
        </v-flex>
    </v-layout>
    </default-dashboard>
</template>
<script>
  import DefaultDashboard from '../components/DefaultDashboard'
    import axios from 'axios'
    export default {
        data(){
            return{
                dialog: false,
                 dialogDelete: false,
                search:'',
                usuarios:[],
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Nombres', value: 'nombres', sortable: true },
                    { text: 'Apellidos', value: 'apellidos', sortable: true },
                    { text: 'Rol', value: 'rol', sortable: true },
                    { text: 'Teléfono', value: 'telefono', sortable: false  },
                    { text: 'Email', value: 'email', sortable: false  },
                    { text: 'Estado', value: 'estado', sortable: false  } 
                ],
                editedIndex: -1,
                _id:'',
                nombres:'',
                apellidos:'',
                rol:'',
                roles: ['Administrador','Secretaria','Usuario'],
                telefono: '',
                email: '',
                password:'',
                valida:0,
                validaMensaje:[],
                adModal:0,
                adAccion:0,
                adNombre:'',
                adId:''
            }
        },
         components:{
      DefaultDashboard
  },
        computed: {
            formTitle () {
            return this.editedIndex === -1 ? 'Nuevo registro' : 'Editar registro'
            }
        },
        watch: {
            dialog (val) {
            val || this.close();
            }
        },
        created () {
            this.listar();
        },
        methods: {
            listar(){
                let me=this;
                let header={"Token" : this.$store.state.token};
                let configuracion= {headers : header};            
                axios.get('usuario/list',configuracion).then(function (response){
                    me.usuarios=response.data;
                }).catch(function(error){
                    console.log(error);
                });

            },
            limpiar(){
                this._id='';
                this.nombres='';
                this.apellidos='',
                this.telefono='';
                this.email='';
                this.password='';
                this.valida=0;
                this.validaMensaje=[];
                this.editedIndex=-1;
            },
            validar(){
                this.valida=0;
                this.validaMensaje=[];
                if(!this.rol){
                    this.validaMensaje.push('Seleccione un rol.');
                }
                if(!this.nombres){
                    this.validaMensaje.push('Escriba un nombre');
                }
                if(!this.apellidos){
                    this.validaMensaje.push('Escriba un apellido');
                }
                if(!this.telefono){
                    this.validaMensaje.push('Escriba un numero de telefono.');
                }
                if(!this.email){
                    this.validaMensaje.push('El email esta vacio');
                }
                if(!this.password){
                    this.validaMensaje.push('El password esta vacio');
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            guardar(){
                let me=this;
                let header={"Token" : this.$store.state.token};
                let configuracion= {headers : header};
                if (this.validar()){
                    return;
                }
                if (this.editedIndex >-1){
                    let me=this;
                    //Código para editar
                    axios.put(`usuario/update${this._id}`,{
                        '_id':this._id,
                        'rol':this.rol,
                        'nombres':this.nombres,
                        'apellidos':this.apellidos,
                        'telefono': this.telefono,
                        'email':this.email,
                        'password':this.password
                    },configuracion)
                    .then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();
                        
                        
                    })
                    .catch(function(error){
                        console.log(error);
                    });
                }else{
                    let me = this;
                    //Código para guardar
                    axios.post('usuario/add',
                    {
                        'rol':this.rol,
                        'nombres':this.nombres,
                        'apellidos':this.apellidos,
                        'telefono': this.telefono,
                        'email':this.email,
                        'password':this.password
                    },configuracion)
                    .then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();
                    })
                    .catch(function(error){
                        console.log(error);
                    });
                }
            },
            editItem (item) {
                this._id=item._id;
                this.rol=item.rol;
                this.nombres=item.nombres;
                this.apellidos=item.apellidos;
                this.telefono=item.telefono;
                this.email=item.email;
                this.password=item.password;
                this.dialog = true;
                this.editedIndex=1;
            },
    deleteItem(item){
       let header={"Token" : this.$store.state.token};
      let configuracion= {headers : header};
      this.axios.delete(`usuario/remove${item._id}`, configuracion)
      .then(res => {
        this.editedIndex = this.usuarios.indexOf(item)
        this.dialogDelete = true;
      })
    },
    deleteItemConfirm () {
        this.usuarios.splice(this.editedIndex, 1)
        this.closeDelete()
      },

    closeDelete () {
        this.dialogDelete = false
        
      },
     activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre=item.nombre;
                this.adId=item._id;
                if (accion==1){
                    this.adAccion=1;
                } else if(accion==2){
                    this.adAccion=2;
                } else{
                    this.adModal=0;
                }
            },
     activarDesactivarCerrar(){
                this.adModal=0;
            },
            activar(){
                let me=this;
                let header={"Token" : this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('usuario/activate',{'_id':this.adId},configuracion)
                    .then(function(response){
                        me.adModal=0;
                        me.adAccion=0;
                        me.adNombre='';
                        me.adId='';
                        me.listar();
                    })
                    .catch(function(error){
                        console.log(error);
                    });
            },
            desactivar(){
                let me=this;
                let header={"Token" : this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('usuario/deactivate',{'_id':this.adId},configuracion)
                    .then(function(response){
                        me.adModal=0;
                        me.adAccion=0;
                        me.adNombre='';
                        me.adId='';
                        me.listar();
                    })
                    .catch(function(error){
                        console.log(error);
                    });
            },
            close () {
                this.dialog = false;

            }
        }
    }
</script>
