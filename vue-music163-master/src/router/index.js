import Vue from "vue";
import VueRouter from "vue-router";

import Home from "../views/Home.vue";
import Hot from "../views/Hot.vue";
import Search from "../views/Search.vue";

import Playlist from "../views/Playlist.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
  {
    path:"/hot",
    name:"Hot",
    component:Hot
  },
  {
    path:"/search",
    name:"Search",
    component:Search
  },
  {
    path:"/playlist",
    name:"Playlist",
    component:Playlist,
    meta: { requiresAuth: true },
  }
];

const router = new VueRouter({
  routes
});

export default router;
