<template>
  <div class="container">
    <div class="left-container">
      <el-tree
        default-expand-all
        :data="sideNav"
        :props="defaultProps"
        @node-click="handleNodeClick"
      ></el-tree>
    </div>
    <div class="right-container">
      <dir-table v-if="show" :parentId="parentId" @upTree="getSideNav" />
    </div>
  </div>
</template>

<script>
import { getDicTree } from "@/api/dict.js";
import splitPane from "vue-splitpane";
import DirTable from "./table.vue";
export default {
  name: "Dict",
  components: { splitPane, "dir-table": DirTable },
  data() {
    return {
      sideNav: [],
      defaultProps: {
        label: "keyValue",
      },
      parentId: "",
      show: false,
    };
  },
  created() {
    this.getSideNav();
  },
  methods: {
    getSideNav() {
      this.sideNav = [];
      getDicTree().then((res) => {
        this.sideNav.push(res.data);
        this.parentId = res.data.keyId;
        this.show = true;
      });
    },
    handleNodeClick(data) {
      this.parentId = data.keyId;
    },
  },
};
</script>

<style scoped>
.container {
  margin-top: 5px;
  position: relative;
  height: 100vh;
  display: flex;
}

.left-container {
  height: 100%;
  max-width: 20%;
  min-width: 200px;
  flex: 1;
  border-right: 1px solid #cdcdcd;
}

.right-container {
  height: 100%;
  flex: 1;
}

::v-deep .el-tree-node__content {
  height: 50px;
}
::v-deep .el-tree-node:focus > .el-tree-node__content {
  color: #409eff;
}
</style>