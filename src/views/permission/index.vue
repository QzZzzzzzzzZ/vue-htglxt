<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="配置管理" name="1">
      <div v-if="activeName==1">
        <Tranck />
      </div>
    </el-tab-pane>
    <el-tab-pane label="用户信息" name="2">
      <div v-if="activeName==2">
        <User />
      </div>
    </el-tab-pane>
    <el-tab-pane label="用户权限管理" name="3">
      <div v-if="activeName==3">
        <user-manage />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import Tranck from "./tranck.vue";
import User from "./userAuth.vue";
import UserManage from "./userManage.vue";
export default {
  components: { Tranck, User, UserManage },
  data() {
    return {
      activeName: "1",
    };
  },
  methods: {
    handleClick(tab, event) {},
  },
};
</script>
<style scoped>
::v-deep .el-tabs__nav {
  margin-left: 20px;
}
</style>