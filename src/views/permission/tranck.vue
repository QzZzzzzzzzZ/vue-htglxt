<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="roleList">
      <el-table-column label="区域编号" prop="keyId" align="center" />
      <el-table-column label="区域" prop="keyValue" align="center" />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.roleId !== 1">
          <el-button size="mini" type="text" icon="el-icon-plus" @click="addUser(scope.row)">添加用户</el-button>
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
      <el-form :model="form" ref="form" label-width="80px" :rules="rules">
        <el-form-item label="角色名称" prop="userId">
          <el-select
            v-model="form.userId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入用户名、拼音、电话"
            :remote-method="remoteMethod"
            :loading="selectLoading"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="股道" prop="track">
          <el-select multiple v-model="form.track">
            <el-option
              v-for="item in trakOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addUser } from "@/api/auth.js";
import { getAllRegion, searchByParentId } from "@/api/dict.js";
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
      trakOptions: [],
      userOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        username: undefined,
        roleKey: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
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
      getAllRegion().then((response) => {
        this.roleList = response.data;
        this.loading = false;
      });
    },
    // 取消按钮（数据权限）
    cancel() {
      this.open = false;
      this.form = {};
      this.trakOptions = [];
      this.userOptions = [];
    },
    /** 新增按钮操作 */
    addUser(row) {
      this.form = {};
      this.title = "添加角色";
      searchByParentId(row.keyId).then((res) => {
        let arr = res.data.map((ele) => {
          if (ele.type == "TRACK") {
            let e = {
              value: ele.keyId,
              label: ele.keyValue,
            };
            return e;
          }
        });
        this.trakOptions = arr;
        this.open = true;
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.selectLoading = true;
        getUser(query).then((res) => {
          let arr = res.data.map((ele) => {
            let e = {
              label: ele.username,
              value: ele.userId,
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
    /** 提交按钮（数据权限） */
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let userName = this.userOptions.filter((ele) => {
            if (ele.value == this.form.userId) {
              return ele.label;
            }
          });
          let params = {};
          params.userName = userName[0].label;
          params.userId = this.form.userId;
          let trackIds = "";
          this.form.track.map((ele) => {
            trackIds += ele + ",";
          });
          params.trackIds = trackIds;
          addUser(params).then((response) => {
            if (response.code == "00000") {
              this.$message({
                message: "完成" + this.title,
                type: "success",
              });
              this.open = false;
              this.cancel();
              this.getList();
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
    handleSizeChange(val) {
      this.listQuery.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
  },
};
</script>