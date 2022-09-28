<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!-- 搜索 start -->
      <el-form :model="listQuery" ref="queryForm" :inline="true" label-width="60px">
        <el-form-item label="入厂时间" label-width="80px">
          <el-date-picker
            style="width: 230px"
            unlink-panels
            v-model="date"
            size="small"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            @change="selectTime"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="车号" prop="carCode">
          <el-input
            v-model="listQuery.carCode"
            placeholder="请输入车号"
            clearable
            size="small"
            style="width: 180px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="物资" prop="materialName">
          <el-input
            v-model="listQuery.materialName"
            placeholder="请输入物资名称"
            clearable
            size="small"
            style="width: 180px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="发站" prop="sourceName">
          <el-input
            v-model="listQuery.sourceName"
            placeholder="请输入发站"
            clearable
            size="small"
            style="width: 120px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="去向" prop="targetName">
          <el-input
            v-model="listQuery.targetName"
            placeholder="请输入去向"
            clearable
            size="small"
            style="width: 120px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="listQuery.status" placeholder="状态" size="small" style="width: 120px">
            <el-option
              v-for="order in statusOptions"
              :key="order.key"
              :label="order.label"
              :value="order.key"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :key="tableKey"
      :data="showList"
      :max-height="toableHeight"
      v-loading="listLoading"
      element-loading-text="给我一点时间"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top:10px;"
    >
      <el-table-column align="center" prop="carCode" label="车号" />
      <el-table-column align="center" prop="materialName" label="物资" width="200" />
      <el-table-column align="center" label="入厂时间" width="180">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.grossTime,'{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sourceName" label="发站" />
      <el-table-column align="center" prop="targetName" label="去向" />
      <el-table-column align="center" prop="currentTrackName" label="股道" />
      <el-table-column align="center" :label="'操作'" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-link type="primary" @click="handleUpdate(scope.row)">修改</el-link>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="pageQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog title="修改车辆信息" :visible.sync="dialogPvVisible" width="500">
      <el-form
        :rules="rules"
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="车号" prop="carCode">
          <el-input
            v-model="temp.carCode"
            placeholder="车号"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="物资" prop="materialName">
          <el-input
            v-model="temp.materialName"
            placeholder="物资名称"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="发站" prop="sourceName">
          <el-input
            v-model="temp.sourceName"
            placeholder="发站"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="去向" prop="targetName">
          <el-input
            v-model="temp.targetName"
            placeholder="去向"
            clearable
            size="small"
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="入厂时间" prop="grossTime">
          <el-date-picker v-model="temp.grossTime" type="datetime" placeholder="选择日期"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPvVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from "@/api/article";
import { modifyWl } from "@/api/api";
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
      showList: null,
      total: null,
      listLoading: false,
      toableHeight: 600, // 表格高度
      pageQuery: {
        page: 1,
        limit: 50,
      },
      listQuery: {
        status: null,
        sourceName: undefined,
        targetName: undefined,
        carCode: undefined,
        startDate: undefined,
        endDate: undefined,
      },
      date: [],
      statusOptions: [
        { label: "待操作", key: null },
        { label: "登记", key: "REGISTER" },
        { label: "送检", key: "SEND_CHECK" },
        { label: "取样完成", key: "COMPLETE_CHECK" },
        { label: "送妥", key: "SEND_PROPERLY" },
        { label: "报空", key: "COMPLETE_EMPTY" },
        { label: "送装", key: "SEND_PACK" },
        { label: "装好", key: "COMPLETE_PACK" },
        // { label: "出厂", key: "LEAVE_FACTORY" },
      ],
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "修改",
        create: "新增",
      },
      dialogPvVisible: false,
      pvData: [],
      modifyDate: undefined,
      rules: {
        carCode: [
          { required: true, message: "车号不可为空", trigger: "blur" },
          { min: 7, max: 7, message: "请检查车牌号是否正确", trigger: "blur" },
        ],
        materialName: [
          { required: true, message: "物资不可为空", trigger: "blur" },
        ],
        sourceName: [
          { required: true, message: "发站不可为空", trigger: "blur" },
        ],
        targetName: [
          { required: true, message: "去向不可为空", trigger: "blur" },
        ],
        grossTime: [
          { required: true, message: "时间不可为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    // 初始化表格高度
    this.toableHeight = document.documentElement.clientHeight - 300;
    this.getList();
  },
  methods: {
    // 搜索
    handleQuery() {
      this.getList();
    },
    //参数重置
    resetQuery() {
      this.listQuery = {
        page: 1,
        limit: 50,
        status: null,
        sourceName: undefined,
        targetName: undefined,
        carCode: undefined,
        startDate: undefined,
        endDate: undefined,
      };
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.list = response.data;
        this.total = response.data.length;
        this.pageSplict();
      });
    },
    // 分页
    pageSplict() {
      let limit = this.pageQuery.limit;
      let page = this.pageQuery.page;
      let total = this.total;
      let showList = [];
      let min = (page - 1) * limit;
      let max = page * limit;
      if (this.list.length != 0) {
        // 边缘值处理  最后一页特殊处理
        let n = Math.ceil(total / limit);
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
      this.listLoading = false;
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
    selectTime(e) {
      this.listQuery.startDate = parseTime(e[0], "{y}-{m}-{d} 00:00:00");
      this.listQuery.endDate = parseTime(e[1], "{y}-{m}-{d} 23:59:59");
    },
    // 行内修改样式
    handleUpdate(row) {
      this.temp = row;
      this.dialogPvVisible = true;
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let data = this.temp;
          data.grossTime = new Date(data.grossTime);
          data.grossTime = parseTime(data.grossTime, "{y}-{m}-{d} {h}:{i}");
          modifyWl(data).then((res) => {
            if (res.code == "00000") {
              this.dialogPvVisible = false;
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.getList();
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog_content {
  display: inline-block;
  margin: 0 5px 0 10px;
}
::v-deep .el-scrollbar__wrap {
  margin-bottom: 0 !important;
}
</style>
