<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getPerLists } from "@/api/userAuth";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      routes: [],
    };
  },
  mounted() {
    let routes = this.$router.options.routes;
    let routerList = [];
    // 菜单根据权限过滤
    getPerLists({ userId: this.userId }).then((res) => {
      for (let i = 0; i < routes.length; i++) {
        const element = routes[i];
        let item = this.handleAuth(element, res.data.permissions);
        if (item) {
          routerList.push(item);
        }
      }
      this.routes = routerList;
    });
  },
  methods: {
    handleAuth(item, authList) {
      if (item.children && item.children.length) {
        item.children = this.handleChidren(item.children, authList);
      }
      if (item.meta && item.meta.roles) {
        for (let i = 0; i < item.meta.roles.length; i++) {
          const auth = item.meta.roles[i];
          for (let x = 0; x < authList.length; x++) {
            const isAuth = authList[x].permissionName;
            if (auth == isAuth) {
              return item;
            }
          }
        }
      } else {
        return item;
      }

      return undefined;
    },
    handleChidren(children, authList) {
      let list = [];
      for (let index = 0; index < children.length; index++) {
        const element = children[index];
        if (element.meta && element.meta.roles) {
          let item = this.handleAuth(element, authList);
          if (item) {
            list.push(item);
          }
        } else {
          list.push(element);
        }
      }
      return list;
    },
  },
  computed: {
    ...mapGetters(["sidebar", "userId"]),
    // routes() {
    //   return this.$router.options.routes;
    // },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
};
</script>
