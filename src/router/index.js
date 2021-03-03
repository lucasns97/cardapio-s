// Modulos principais
import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase';

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  { 
    path: "*",
    redirect: '/404',
  },
  {
    path: '/',
    component: () => import('@/views/console/index'),
    name: "Home",
    redirect: '/montarcardapio',
    meta: { title: 'Início', requiresAuth: true },
    children: [
      {
        path: 'montarcardapio',
        name: 'MakeMenu',
        component: () => import('@/views/makemenu/index'),
        meta: { title: 'Montar Cardápio', requiresAuth: true }
      },
      {
        path: '/configuracoes',
        component: () => import('@/views/settings/index'),
        name: 'Settings',
        redirect: '/configuracoes/usuario',
        meta: { title: 'Configurações', requiresAuth: true },
        children: [
          {
            path: 'usuario',
            name: 'User',
            component: () => import('@/views/settings/user/index'),
            meta: { title: 'Usuário', requiresAuth: true }
          },
          {
            path: 'temporario',
            name: 'Temp',
            component: () => import('@/views/settings/temp/index'),
            meta: { title: 'Temporário', requiresAuth: true }
          }
        ]
      },
    ]
  },
]

const router = new Router({
  // export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: constantRoutes
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;

  if (currentUser) {
    router.app.$store.commit("SET_USER", currentUser);
    router.app.$store.commit("SET_TOKEN", currentUser.refreshToken);
  } else {
    router.app.$store.commit("SET_USER", null);
    router.app.$store.commit("SET_TOKEN", null);
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next('login');
  else if (!requiresAuth && currentUser) next();
  else next();
});

export default router;
