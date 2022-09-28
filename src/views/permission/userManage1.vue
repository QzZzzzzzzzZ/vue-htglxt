<template>
  <div class="app-container user_windows">
    <div class="user_windows">
      <el-form :model="form" ref="form" label-width="100px" :rules="rules">
        <el-form-item label="已选择用户">
          <el-tag v-for="(item,index) in userList" key="index">{{item.label}}</el-tag>
        </el-form-item>
        <el-form-item label="用户">
          <el-select
            v-model="userId"
            filterable
            remote
            style="width:280px"
            reserve-keyword
            placeholder="请输入用户名、拼音、电话"
            :remote-method="remoteMethod"
            @change="selectedHandle"
            :loading="selectLoading"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.value"
              :label="item.label+'('+item.telephone+')'"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-transfer
          filterable
          :titles="['未选择', '已选择']"
          filter-placeholder="请输入"
          v-model="trackIds"
          :data="regionOptions"
        >
          <span slot-scope="{ option }">{{ option.keyValue }}</span>
        </el-transfer>
        <!-- <el-form-item label="区域" prop="reginId">
          <el-select
            v-model="form.reginId"
            @change="selectRegion"
            style="width:280px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in regionOptions"
              :key="item.keyId"
              :label="item.keyValue"
              :value="item.keyId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="股道" prop="trackId">
          <el-select
            multiple
            filterable
            v-model="form.trackId"
            style="width:280px"
            no-data-text="请先选择区域"
            placeholder="请选择"
          >
            <el-option
              v-for="item in trackOptions"
              :key="item.keyId"
              :label="item.keyValue"
              :value="item.keyId"
            ></el-option>
          </el-select>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="cancel">重 置</el-button>
      </div>
    </div>
    <!-- 分配角色数据权限对话框 -->
  </div>
</template>

<script>
import { searchUser, addUser } from "@/api/auth.js";
import { getUser } from "@/api/user.js";
import { searchByParentId, getAllRegion } from "@/api/dict.js";
export default {
  data() {
    return {
      userOptions: [],
      userList: [], //选择中的用户
      regionOptions: [],
      trackOptions: [],
      selectLoading: false,
      userId: undefined,
      form: {},
      rules: {
        reginId: [{ required: true, message: "区域不能为空", trigger: "blur" }],
        trackId: [{ required: true, message: "股道不能为空", trigger: "blur" }],
      },
      trackIds: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const userId = this.$store.getters.userId;
      getAllRegion().then((res) => {
        if (res.code == "00000") {
          this.regionOptions = res.data.map((ele) => {
            let e = ele;
            e.key = ele.keyId;
            return e;
          });
        }
      });
    },
    selectedHandle(value) {
      for (let i = 0; i < this.userList.length; i++) {
        const element = this.userList[i];
        if (element.value == value.value) {
          this.$message({
            message: "已选择该用户",
            type: "warning",
          });
          return;
        }
      }
      this.userList.push(value);
    },
    selectRegion(Id) {
      let ele = {};
      for (let i = 0; i < this.regionOptions.length; i++) {
        const element = this.regionOptions[i];
        if (element.keyId == Id) {
          ele = element;
          break;
        }
      }
      this.$set(this.form, "trackId", "");
      this.trackOptions = ele.children;
      searchByParentId(ele.keyId).then((res) => {
        if (res.code == "00000") {
          this.trackOptions = res.data;
        }
      });
    },
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let params = {};
          let userName = "";
          let userId = "";
          this.userList.map((ele) => {
            userName += ele.label + ",";
            userId += ele.value + ",";
          });
          let trackIds = "";
          this.form.trackId.map((ele) => {
            trackIds += ele + ",";
          });
          params.trackIds = trackIds;
          params.userName = userName;
          params.userId = userId;
          addUser(params).then((response) => {
            if (response.code == "00000") {
              this.$message({
                message: "完成操作",
                type: "success",
              });
              this.cancel();
            } else {
              this.$message({
                message: response.msg,
                type: "error",
              });
            }
          });
        }
      });
    },
    cancel() {
      this.open = false;
      this.form = {};
      this.userList = []; //选择中的用户
      this.trackOptions = [];
      this.userId = undefined;
      this.userOptions = [];
      this.trackIds = [];
    },
    remoteMethod(query) {
      if (query !== "") {
        this.selectLoading = true;
        getUser(query).then((res) => {
          let arr = res.data.map((ele) => {
            let e = {
              label: ele.username,
              value: ele.userId,
              telephone: ele.telephone,
            };
            return e;
          });
          this.userOptions = arr;
          this.selectLoading = false;
        });
      } else {
        this.userOptions = [];
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.user_windows {
  margin: 0 auto;
  width: 590px;
}
.dialog-footer {
  margin: 0 auto;
  width: 160px;
}
.el-tag {
  margin-right: 10px;
}
.el-form {
  margin-bottom: 10px;
}
</style>