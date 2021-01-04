<template>
<div class="login">
<v-app id="inspire">
      <v-main>
            <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card justify="center" class="elevation-12"  max-width="400">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title class="overline" >Acceso al Sistema </v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="usuario.email"
                    label="email"
                    name="login"
                    prepend-icon="person"
                    type="text"
                    required
                    :rules="form.email.rules"
                  ></v-text-field>

                  <v-text-field
                    v-model="usuario.password"
                    id="password"
                    label="password"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                    :rules="form.password.rules"
                    required
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="overline" color="primary" @click="login()" >Ingresar</v-btn>
              </v-card-actions>
            </v-card>
           </v-col>
        </v-row>
        <v-snackbar
       shaped
      v-model="snackbar"
      :color="color"
      :right="x ==='right'"
      :timeout="5000"
       :top="y==='top'" 
      :vertical="mode === 'vertical'"
    >
      {{ mensaje}}

    </v-snackbar>
      </v-container>
      </v-main>
       </v-app>
       </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      usuario: {email:"", password:""},
       snackbar: false, 
       errorM:null,
      mensaje: '',
        color: "red accent-1",
        mode: '',
        x: 'right',
        y: 'top',
        form:{
    email: {
        label: 'Email',
        placeholder: 'valita@gmail.com',
        rules: [
          (v) => !!v || 'Este campo es requerido',
        ]
      },
      password: {
        label: 'Password',
        placeholder: 'xxx',
        rules: [(v) => !!v || 'Este campo es requerido']
      },
    }
  }

  },
  methods:{
     login(){
            axios.post('usuario/login',this.usuario)
            .then(respuesta =>{
                return respuesta.data;
            })
            .then(data =>{
                this.$store.dispatch("guardarToken",data.tokenReturn);
                this.$router.push({name: 'home'});
            })
            .catch(error =>{
                //console.log(eror);
                this.errorM=null;
                if (error.response.status==404){
                    this.errorM='No existe el usuario o las credenciales son incorrectas.';
                } else{
                    this.errorM='Ocurrió un error con el servidor.';
                }
            });
        }
  }
}
</script>