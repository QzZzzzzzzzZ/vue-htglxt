import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * 注意:子菜单只在路由子菜单时出现。 长度> = 1
 * 详细见:https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 * 隐藏:true，如果设置为true，项目将不显示在侧边栏(默认为false)
 * 如果设置为true，将总是显示根菜单
 * 如果没有设置alwaysShow，当item有多个子路由时，
 * 它将变成嵌套模式，否则不显示根菜单
 * redirect: noRedirect，如果设置为noRedirect，则breadcrumb中不会有重定向
 * Name:'router-name'，该名称由<keep-alive>使用(必须设置!!)
 * 元:{
 * 角色:['admin'，'editor']控制页面角色(您可以设置多个角色)
 * 标题:' Title '显示在侧边栏和面包屑中的名称(建议设置)
 * 图标:'svg-name'/'el-icon-x'显示在侧边栏的图标
 * 面包屑:false，如果设置为false，项目将隐藏在面包屑中(默认为true)
 * activeMenu: '/example/list'如果设置了path，侧边栏会突出显示你设置的路径
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  {
    path: "",
    component: Layout,
    redirect: "dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
        name: "dashboard",
        meta: {
          title: "首页",
          icon: "dashboard",
          noCache: true,
        },
      },
    ],
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
  {
    path: "/submit",
    component: Layout,
    redirect: "noredirect",
    name: "submit",
    meta: {
      title: "停时登记",
      icon: "form",
    },
    children: [
      {
        path: "inFactory",
        component: () => import("@/views/submitPage/inFactory"),
        name: "inFactory",
        meta: { title: "入厂登记" },
      },
      {
        path: "sendCar",
        component: () => import("@/views/submitPage/sendCar"),
        name: "sendCar",
        meta: { title: "送车登记" },
      },
      {
        path: "finalSample",
        component: () => import("@/views/submitPage/finalSample"),
        name: "finalSample",
        meta: { title: "取样完成登记" },
      },
      {
        path: "reportEmpty",
        component: () => import("@/views/submitPage/reportEmpty"),
        name: "reportEmpty",
        meta: { title: "报空登记" },
      },
      {
        path: "finalLoad",
        component: () => import("@/views/submitPage/finalLoad"),
        name: "finalLoad",
        meta: { title: "装好登记" },
      },
      {
        path: "outFactory",
        component: () => import("@/views/submitPage/outFactory"),
        name: "outFactory",
        meta: { title: "出厂登记" },
      },
      {
        path: "walkthrough",
        component: () => import("@/views/submitPage/walkthrough"),
        name: "walkthrough",
        meta: { title: "预排登记" },
      },
    ],
  },
  {
    path: "/dict",
    component: Layout,
    redirect: "/dict/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/dict/index"),
        name: "dict",
        meta: {
          title: "字典管理",
          icon: "documentation",
          roles: ["admin"], // or you can only set roles in sub nav
        },
      },
    ],
  },
  {
    path: "/permission",
    component: Layout,
    redirect: "/permission/index",
    meta: { roles: ["admin"] }, // you can set roles in root nav
    children: [
      {
        path: "index",
        component: () => import("@/views/permission/index"),
        name: "permission",
        meta: {
          title: "权限管理",
          icon: "lock",
          roles: ["admin"], // or you can only set roles in sub nav
        },
      },
    ],
  },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
