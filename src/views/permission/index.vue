<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="配置管理" name="first">
      <Tranck />
    </el-tab-pane>
    <el-tab-pane label="用户管理" name="second">
      <User />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import Tranck from "./tranck.vue";
import User from "./userAuth.vue";
export default {
  components: { Tranck, User },
  data() {
    return {
      activeName: "first",
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>
<style scoped>
::v-deep .el-tabs__nav {
  margin-left: 20px;
}
</style>