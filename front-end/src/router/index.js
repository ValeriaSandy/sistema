import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Usuario from '../views/Usuario.vue'
import Nota from '../views/Nota.vue'
import Contacto from '../views/Contacto.vue'
import Evento from '../views/Evento.vue'


Vue.use(Router)

var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        administrador: true,
        secretaria: true,
        usuario: true
      }
    },
    {
      path: '/',
      name: 'login',
      component: Login,
      meta: {
        libre: true
      }
    },
    {
      path: '/nota',
      name: 'nota',
      component: Nota,
      meta: {
        administrador: true,
        usuario: true
      }
    },
    {
      path: '/evento',
      name: 'evento',
      component: Evento,
      meta: {
        administrador: true,
        usuario: true
      }
    },
    {
      path: '/contacto',
      name: 'contacto',
      component: Contacto,
      meta: {
        administrador: true,
        usuario: true
      }
    },
    {
      path: '/usuario',
      name: 'usuario',
      component: Usuario,
      meta: {
        administrador: true,

      }
    },
    
  ]
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.libre)){
    next();
  } else if ( store.state.usuario && store.state.usuario.rol == 'Administrador'){
    if (to.matched.some(record => record.meta.administrador)){
      next();
    }
  } else if ( store.state.usuario && store.state.usuario.rol == 'Secretaria'){
    if (to.matched.some(record => record.meta.secretaria)){
      next();
    }
  } else if ( store.state.usuario && store.state.usuario.rol == 'Usuario'){
    if (to.matched.some(record => record.meta.usuario)){
      next();
    }
  } else{
    next({name: 'login'});
  }
})
export default router
