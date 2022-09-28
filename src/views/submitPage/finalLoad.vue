<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!-- 搜索 start -->
      <el-form :model="listQuery" ref="queryForm" :inline="true" label-width="45px">
        <el-form-item label="区域" prop="regionId">
          <el-select
            v-model="listQuery.regionId"
            placeholder="区域"
            size="small"
            @change="selectRegion"
            style="width: 110px"
          >
            <el-option
              v-for="order in regionOptions"
              :key="order.keyId"
              :label="order.keyValue"
              :value="order.keyId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="股道" prop="trackId">
          <el-select
            v-model="listQuery.trackId"
            filterable
            placeholder="股道"
            size="small"
            style="width: 110px"
          >
            <el-option
              v-for="order in trackOptions"
              :key="order.keyId"
              :label="order.keyValue"
              :value="order.keyId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车号" prop="carCode">
          <el-input
            v-model="listQuery.carCode"
            placeholder="请输入车号"
            clearable
            size="small"
            style="width: 110px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="物资" prop="material">
          <el-input
            v-model="listQuery.material"
            placeholder="请输入物资名称"
            clearable
            size="small"
            style="width: 110px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="primary" size="mini" plain @click="showForm('装好登记')">装好登记</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="init">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      ref="multipleTable"
      :key="tableKey"
      :data="showList"
      :max-height="toableHeight"
      v-loading="listLoading"
      @selection-change="handleSelectionChange"
      element-loading-text="给我一点时间"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column align="center" prop="carCode" label="车号" />
      <el-table-column align="center" prop="materialName" label="物资" />
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status=='SEND_CHECK'">送检</el-tag>
          <el-tag v-else-if="scope.row.status=='COMPLETE_CHECK'" type="success">取样完成</el-tag>
          <el-tag
            v-else-if="scope.row.status=='SEND_PROPERLY'"
            style="color:#fff;"
            color="#b1d5c8"
          >送妥</el-tag>
          <el-tag v-else-if="scope.row.status=='SEND_PACK'" style="color:#fff;" color="#a29bfe">送装</el-tag>
          <el-tag v-else-if="scope.row.status=='COMPLETE_PACK'" type="success">装好</el-tag>
          <el-tag v-else-if="scope.row.status=='LEAVE_FACTORY'" type="info">出厂</el-tag>
          <el-tag v-else-if="scope.row.status=='REGISTER'">登记</el-tag>
          <el-tag v-else>待操作</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        background
        small
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="pageQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog :title="'装好时间登记'" width="99%" :visible.sync="dialogFormVisible">
      <el-form
        :rules="rules"
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 300px;"
      >
        <el-form-item label="完成时间" prop="operatorTime">
          <el-date-picker v-model="temp.operatorTime" type="datetime" placeholder="选择日期"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateArticle } from "@/api/article";
import { getRecordByTrackId, completePack } from "@/api/api";
import { searchUser, searchUserByParent } from "@/api/auth.js";
import waves from "@/directive/waves"; // 水波纹指令
import { parseTime } from "@/utils";

export default {
  directives: {
    waves,
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      showList: [],
      listLoading: false,
      total: null,
      pageQuery: {
        page: 1,
        limit: 50,
      },
      status: "SEND_PACK",
      listQuery: {
        regionId: undefined,
        trackId: undefined,
        material: undefined,
        carCode: undefined,
      },
      regionOptions: [], //区域选项
      trackOptions: [], //股道选项
      // 表单数据  临时数据
      temp: {
        operatorTime: "",
      },
      dialogFormVisible: false,
      textMap: {
        update: "修改",
        create: "新增",
      },
      rules: {
        operatorTime: [
          { required: true, message: "时间不可为空", trigger: "blur" },
        ],
      },
      dialogTitle: "送装",
    };
  },

  created() {
    // 初始化表格高度
    this.toableHeight = document.documentElement.clientHeight - 250;
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      // 获取区域信息
      const userId = this.$store.getters.userId;
      this.resetQuery();
      // 获取区域信息
      searchUser(userId).then((res) => {
        if (res.code == "00000") {
          this.regionOptions = res.data;
          // 默认数据查询
          this.listQuery.regionId = res.data[0].keyId;
          this.selectRegion(this.listQuery.regionId);
        }
      });
    },
    // 修改表格中数据选中状态
    modifySelected() {
      // 仅展示这一页的
      let { min, max } = this.getCurrentPage();
      this.list.forEach((row, index) => {
        if (index >= min && index < max) {
          if (row.selected) {
            this.$refs.multipleTable.toggleRowSelection(row, true);
          }
        }
      });
      this.initList = false;
      this.listLoading = false;
    },
    // 搜索
    handleQuery() {
      this.getList();
    },
    //参数重置
    resetQuery() {
      this.listQuery = {
        regionId: undefined,
        trackId: undefined,
        material: undefined,
        carCode: undefined,
      };
    },
    getList() {
      this.listLoading = true;
      let data = {
        carCode: this.listQuery.carCode,
        material: this.listQuery.material,
        status: this.status,
      };
      getRecordByTrackId(this.listQuery.trackId, data).then((response) => {
        this.list = response.data;
        this.total = response.data.length;
        this.pageSplict();
        this.listLoading = false;
      });
    },
    // 分页
    pageSplict() {
      this.initList = true;
      this.listLoading = true;
      let limit = this.pageQuery.limit;
      let page = this.pageQuery.page;
      let total = this.total;
      let showList = [];
      let min = (page - 1) * limit;
      let max = page * limit;
      // 边缘值处理  最后一页特殊处理
      let n = Math.ceil(total / limit);
      if (this.list.length != 0) {
        if (page == n) {
          // 获取最后一页数据
          let m = total % limit;
          if (m == 0) {
            showList = this.listSplict(min, max, this.list);
          } else {
            max = min + m;
            showList = this.listSplict(min, max, this.list);
          }
        } else {
          showList = this.listSplict(min, max, this.list);
        }
      }
      this.showList = showList;
      // $nextTick 是在下次 DOM 更新循环结束之后执行延迟回调
      this.$nextTick(this.modifySelected);
    },
    listSplict(min, max, list) {
      let showList = [];
      for (let index = min; index < max; index++) {
        const element = list[index];
        showList.push(element);
      }
      return showList;
    },
    handleSizeChange(val) {
      this.pageQuery.limit = val;
      this.pageSplict();
    },
    handleCurrentChange(val) {
      this.pageQuery.page = val;
      this.pageSplict();
    },
    selectRegion(Id) {
      const userId = this.$store.getters.userId;
      searchUserByParent(userId, Id).then((res) => {
        if (res.code == "00000") {
          this.trackOptions = res.data;
          this.listQuery.trackId = res.data[0].keyId;
          this.getList();
        }
      });
    },
    selectTrack(value) {
      for (let i = 0; i < this.trackOptions.length; i++) {
        const element = this.trackOptions[i];
        if (element.keyId == value) {
          this.listQuery.trackName = element.keyValue;
          break;
        }
      }
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let operatorTime = parseTime(
            this.temp.operatorTime,
            "{y}-{m}-{d} {h}:{i}"
          );
          let recodeIds = "";
          for (let i = 0; i < this.list.length; i++) {
            const element = this.list[i];
            if (element.selected && element.status == this.status) {
              recodeIds += element.id + ",";
            }
          }
          let data = {
            operatorTime: operatorTime,
            recodeId: recodeIds,
          };
          completePack(data).then((res) => {
            if (res.code == "00000") {
              this.$message({
                message: "操作完成",
                type: "success",
              });
              this.temp.operatorTime = undefined;
              this.dialogFormVisible = false;
              this.getList();
            }
          });
        }
      });
    },
    showForm(title) {
      for (let i = 0; i < this.list.length; i++) {
        const element = this.list[i];
        if (element.selected) {
          break;
        }
        if (i == this.list.length - 1 && !element.selected) {
          this.$message({
            message: "请至少选中一个数据",
            type: "warning",
          });
          return;
        }
      }
      this.dialogFormVisible = true;
    },
    // 获取当前页面中数据的开头与结尾
    getCurrentPage() {
      let page = this.pageQuery.page;
      let limit = this.pageQuery.limit;
      let total = this.total;
      let min = (page - 1) * limit;
      let max = page * limit;
      let n = Math.ceil(total / limit);
      if (page == n) {
        let m = total % limit;
        if (m != 0) {
          max = min + m;
        }
      }
      return { min, max };
    },
    // 多选框选中数据
    handleSelectionChange(selection, index) {
      let page = this.pageQuery.page;
      let limit = this.pageQuery.limit;
      // 判断是否需要初始化
      if (this.initList) {
        return;
      }
      // 每次初始化当前这页的数据
      let { min, max } = this.getCurrentPage();
      for (let i = min; i < max; i++) {
        this.list[i].selected = false;
      }
      for (let i = 0; i < selection.length; i++) {
        const element1 = selection[i];
        for (let j = 0; j < this.showList.length; j++) {
          const element2 = this.showList[j];
          let index = (page - 1) * limit + j;
          if (element1.id == element2.id) {
            element1.selected = true;
            this.list[index] = element1;
            break;
          }
        }
      }
    },
  },
};
</script>
