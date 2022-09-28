<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="roleList">
      <el-table-column label="用户编号" prop="userId" align="center" />
      <el-table-column label="用户名称" prop="userName" align="center" />
      <el-table-column label="分配股道数" prop="trackNum" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.roleId !== 1">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="addUserHandel(scope.row)"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="deleteHandel(scope.row)"
          >清除权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryParams.pageNum"
        :page-sizes="[10,20,30, 50]"
        layout="total, prev, pager, next"
        :page-size="queryParams.pageSize"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-descriptions :column="2">
        <el-descriptions-item label="用户名">{{user.userName}}</el-descriptions-item>
        <el-descriptions-item label="管理股道数">{{user.trackNum}}</el-descriptions-item>
        <el-descriptions-item label="股道" v-if="regionOptions.length>0">
          <el-tree :data="regionOptions" default-expand-all :props="props"></el-tree>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserTrack,
  searchUser,
  addUser,
  searchUserByParent,
} from "@/api/auth.js";
import { getUser } from "@/api/user.js";
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      selectLoading: false,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 数据范围选项
      regionOptions: [],
      user: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        username: undefined,
        roleKey: undefined,
        status: undefined,
      },
      props: {
        label: "keyValue",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
        ],
        track: [{ required: true, message: "股道不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      getUserTrack().then((response) => {
        this.roleList = response.data;
        this.loading = false;
      });
    },
    // 取消按钮（数据权限）
    cancel() {
      this.open = false;
    },
    /** 新增按钮操作 */
    async addUserHandel(row) {
      this.user = row;
      this.title = "查看";
      const userId = this.$store.getters.userId;
      let res = await searchUser(userId);
      if (res.code == "00000") {
        this.regionOptions = [];
        for (let i = 0; i < res.data.length; i++) {
          let ele = res.data[i];
          this.open = true;
          let childrenRes = await searchUserByParent(userId, ele.keyId);
          if (childrenRes.code == "00000") {
            let arr = childrenRes.data.map((e) => {
              return e;
            });
            ele.children = arr;
            this.regionOptions.push(ele);
          }
        }
      }
    },

    handleSizeChange(val) {
      this.listQuery.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    deleteHandel(row) {
      let params = {};
      params.trackIds = "";
      params.userName = row.userName;
      params.userId = row.userId;
      addUser(params).then((response) => {
        if (response.code == "00000") {
          this.$message({
            message: "完成操作",
            type: "success",
          });
          this.getList();
        } else {
          this.$message({
            message: response.msg,
            type: "error",
          });
        }
      });
    },
  },
};
</script>