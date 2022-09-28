<template>
  <div class="app-container">
    <el-form
      :model="listQuery"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="78px"
    >
      <el-form-item label="字典名称" prop="dictName">
        <el-input
          v-model="listQuery.dictName"
          placeholder="请输入字典名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字典类型" prop="dictType">
        <el-input
          v-model="listQuery.dictType"
          placeholder="请输入字典类型"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :tree-props="{children: 'children', hasChildren: false  }"
      :data="list"
      row-key="keyId"
      default-expand-all
    >
      <el-table-column label="字典编号" align="center" prop="keyId" />
      <el-table-column label="字典名称" align="center" prop="keyValue" />
      <el-table-column label="字典类型" align="center" prop="type">
        <template slot-scope="scope">
          <div>{{scope.row.type=='REGION'?'区域':'股道'}}</div>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        layout="total, prev, pager, next"
        :page-size="listQuery.size"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="父节点编号">
          <el-input v-model="form.parentId" :disabled="true" />
        </el-form-item>
        <el-form-item label="数据内容" prop="keyValue">
          <el-input v-model="form.keyValue" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" disabled placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getChildren,
  postDictionary,
  updataDictionary,
  delDictionary,
} from "@/api/dict.js";

export default {
  props: ["parentId"],
  watch: {
    parentId: {
      deep: true,
      handler(val, oldVal) {
        if (val == 0) {
          this.options = [
            {
              value: "REGION",
              label: "区域",
            },
          ];
        } else {
          this.options = [
            {
              value: "TRACK",
              label: "股道",
            },
          ];
        }
        this.getList();
      },
    },
  },
  data() {
    return {
      loading: false, // 遮罩层
      list: [],
      showSearch: true,
      open: false, //表单
      listQuery: {
        size: 10,
        page: 1,
      },
      title: "新增字典",
      total: 10,
      form: {},
      options: [
        {
          value: "REGION",
          label: "区域",
        },
        {
          value: "TRACK",
          label: "股道",
        },
      ],
      rules: {
        keyValue: [
          { required: true, message: "字典名称不能为空", trigger: "blur" },
        ],
        type: [
          { required: true, message: "字典类型不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  mounted() {
    this.getList();
  },
  methods: {
    /** 查询字典类型列表 */
    getList() {
      this.loading = true;
      getChildren(this.parentId, this.listQuery).then((res) => {
        this.list = res.data.records;
        this.listQuery = {
          page: res.data.pages,
          size: res.data.size,
        };
        this.total = res.data.total;
        this.loading = false;
      });
    },
    handleQuery() {},
    resetQuery() {},
    handleDelete(row) {
      delDictionary(row.keyId).then((res) => {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.getList();
        if (row.type == "REGION") {
          this.$emit("upTree");
        }
      });
    },
    handleUpdate(row) {
      this.open = true;
      this.title = "修改";
      this.form = {
        ...row,
      };
    },
    handleSizeChange(val) {
      this.listQuery.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleAdd() {
      this.form = {};
      this.form.parentId = this.parentId;
      this.form.type = this.options[0].value;
      this.open = true;
      this.title = "新增字典";
    },
    cancel() {
      this.form = {};
      this.open = false;
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.keyId) {
            updataDictionary(this.form).then((res) => {
              this.$message({
                message: "完成" + this.title,
                type: "success",
              });
              this.form = {};
              this.open = false;
              this.getList();
              if (this.form.type == "REGION") {
                this.$emit("upTree");
              }
            });
            return;
          }
          postDictionary(this.form).then((res) => {
            this.$message({
              message: "完成" + this.title,
              type: "success",
            });
            this.open = false;
            this.form = {};
            this.getList();
            if (this.form.type == "REGION") {
              this.$emit("upTree");
            }
          });
        }
      });
    },
  },
};
</script>
<style scoped>
.pagination-container {
  margin-top: 10px;
  float: right;
}
</style>