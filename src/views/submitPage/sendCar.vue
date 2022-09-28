<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!-- 搜索 start -->
      <el-form :model="listQuery" ref="queryForm" :inline="true" label-width="60px">
        <el-form-item label="入厂时间" label-width="80px">
          <el-date-picker
            unlink-panels
            v-model="date"
            size="small"
            style="width: 180px"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="股道" prop="currentTrackName ">
          <el-input
            v-model="listQuery.currentTrackName "
            placeholder="股道"
            clearable
            size="small"
            style="width: 100px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="车号" prop="carCode">
          <el-input
            v-model="listQuery.carCode"
            placeholder="车号"
            clearable
            size="small"
            style="width: 100px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="物资" prop="materialName">
          <el-input
            v-model="listQuery.materialName"
            placeholder="物资名称"
            clearable
            size="small"
            style="width: 100px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="发站" prop="sourceName">
          <el-input
            v-model="listQuery.sourceName"
            placeholder="发站"
            clearable
            size="small"
            style="width: 80px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="去向" prop="targetName">
          <el-input
            v-model="listQuery.targetName"
            placeholder="去向"
            clearable
            size="small"
            style="width: 80px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="listQuery.status" placeholder="状态" size="small" style="width: 120px">
            <el-option
              clearable
              v-for="order in statusOptions"
              :key="order.key"
              :label="order.label"
              :value="order.key"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="primary" size="mini" plain @click="showForm('送检')">送检</el-button>
          <el-button type="primary" size="mini" plain @click="showForm('送妥')">送妥</el-button>
          <el-button type="primary" size="mini" plain @click="showForm('送装')">送装</el-button>
          <el-button type="warning" size="mini" plain @click="handleUpdate({},'yp')">预排</el-button>
          <el-button type="warning" size="mini" plain @click="handleUpdate({},'cc')">出厂</el-button>
          <el-button type="danger" size="mini" plain @click="handleBackCar">撤回</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
      <el-table-column fixed="left" align="center" type="selection" width="40"></el-table-column>
      <el-table-column fixed="left" align="center" prop="carCode" width="80" label="车号" />
      <el-table-column fixed="left" align="center" prop="sourceName" label="发站" />
      <el-table-column fixed="left" align="center" prop="materialName" label="物资" width="100" />
      <el-table-column fixed="left" align="center" prop="targetName" label="去向" />
      <el-table-column fixed="left" align="center" prop="currentTrackName" label="当前股道" />
      <el-table-column fixed="left" align="center" label="入厂时间" width="100">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.grossTime,'{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="送检时间" width="100">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.sendCheckTime,'{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="取样完成时间" width="105">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.sampleCompleteTime,'{y}-{m}-{d}')}}</span>
          <br />
          <span>{{parseTime(scope.row.sampleCompleteTime,'{h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="送妥时间" width="100">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.sendProperlyTime,'{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="报空时间" width="100">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.emptyTime,'{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="送装时间" width="100">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.sendPackTime,'{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="装好时间" width="100">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.packCompleteTime,'{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="预排时间" width="100">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.arrangementTime,'{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status=='SEND_CHECK'" style="color:#fff;" color="#2980b9">送检</el-tag>
          <el-tag v-else-if="scope.row.status=='COMPLETE_CHECK'" type="success">取样完成</el-tag>
          <el-tag
            v-else-if="scope.row.status=='SEND_PROPERLY'"
            style="color:#fff;"
            color="#b1d5c8"
          >送妥</el-tag>
          <el-tag
            v-else-if="scope.row.status=='COMPLETE_EMPTY'"
            style="color:#fff;"
            color="#fea29b"
          >报空</el-tag>
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageQuery.page"
        :page-sizes="[50,100,150,200,250,300]"
        :page-size="pageQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogPvVisible" width="30%">
      <div class="block">
        <!-- <span class="dialog_content">时间</span> -->
        <el-date-picker v-model="modifyDate" type="datetime" placeholder="选择日期"></el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogConfirm">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="dialogTitle" width="440px" :visible.sync="dialogFormVisible">
      <el-form
        :rules="rules"
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="区域" prop="reginId">
          <el-select
            class="filter-item"
            v-model="temp.reginId"
            @change="selectRegion"
            placeholder="请选择"
          >
            <el-option
              v-for="item in  regionOptions"
              :key="item.keyId"
              :label="item.keyValue"
              :value="item.keyId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="股道" prop="trackId">
          <el-select
            :disabled="!showTrack"
            class="filter-item"
            filterable
            v-model="temp.trackId"
            no-data-text="请先选择区域"
            @change="selectTrack"
            placeholder="请选择"
          >
            <el-option
              v-for="item in  trackOptions"
              :key="item.keyId"
              :label="item.keyValue"
              :value="item.keyId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="操作时间" prop="operatorTime">
          <el-date-picker v-model="temp.operatorTime" type="datetime" placeholder="选择日期"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogForm">取消</el-button>
        <el-button type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from "@/api/article";
import { loginSend, backWl, arrangement, leaveFactory } from "@/api/api";
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
      showList: null,
      showTrack: false,
      total: null,
      listLoading: false,
      pageQuery: {
        page: 1,
        limit: 50,
      },
      date: null,
      listQuery: {
        status: null,
        sourceName: undefined,
        targetName: undefined,
        currentTrackName: undefined,
        carCode: undefined,
        startDate: undefined,
        endDate: undefined,
      },
      statusOptions: [
        // { label: "待操作", key: null },
        { label: "登记", key: "REGISTER" },
        { label: "送检", key: "SEND_CHECK" },
        { label: "取样完成", key: "COMPLETE_CHECK" },
        { label: "送妥", key: "SEND_PROPERLY" },
        { label: "报空", key: "COMPLETE_EMPTY" },
        { label: "送装", key: "SEND_PACK" },
        { label: "装好", key: "COMPLETE_PACK" },
        // { label: "出厂", key: "LEAVE_FACTORY" },
      ],
      regionOptions: [], //区域选项
      trackOptions: [], //股道选项
      // 表单数据  临时数据
      temp: {
        operatorType: undefined, //操作类型
        recodeId: "", //数据编号
        trackName: "",
        trackId: "",
        operatorTime: "",
      },
      dialogFormVisible: false,
      textMap: {
        update: "修改",
        create: "新增",
      },
      rules: {
        trackId: [{ required: true, message: "股道不可为空", trigger: "blur" }],
        reginId: [{ required: true, message: "区域不可为空", trigger: "blur" }],
        operatorTime: [
          { required: true, message: "时间不可为空", trigger: "blur" },
        ],
      },
      downloadLoading: false,
      dialogPvVisible: false,
      modifyDate: undefined,
      dialogTitle: "送装",
    };
  },

  created() {
    // 初始化表格高度
    this.toableHeight = document.documentElement.clientHeight - 300;
    this.getList();
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const userId = this.$store.getters.userId;
      // 获取区域信息
      searchUser(userId).then((res) => {
        if (res.code == "00000") {
          this.regionOptions = res.data;
        }
      });
    },
    // 修改选中数据
    modifySelected() {
      let { min, max } = this.getCurrentPage();
      this.showList.forEach((row) => {
        if (row.selected) {
          this.$refs.multipleTable.toggleRowSelection(row, true);
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
        status: null,
        sourceName: undefined,
        carCode: undefined,
        targetName: undefined,
        currentTrackName: undefined,
        startDate: undefined,
        endDate: undefined,
      };
    },
    getList() {
      this.listLoading = true;
      this.listQuery.startDate = this.date ? this.date[0] : "";
      this.listQuery.endDate = this.date ? this.date[1] : "";
      fetchList(this.listQuery).then((response) => {
        this.list = response.data;
        this.total = response.data.length;
        this.pageSplict();
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
    resetTemp() {
      this.temp = {
        operatorType: undefined, //操作类型
        recodeId: "", //数据编号
        trackName: "",
        trackId: "",
        operatorTime: "",
      };
    },

    handleUpdate(row, type) {
      this.handleType = type;
      let flag = false;
      switch (type) {
        case "cc":
          this.dialogTitle = "出厂时间登记";
          break;
        case "yp":
          this.dialogTitle = "预排时间登记";
          break;
      }
      if (type != "gmsj") {
        for (let i = 0; i < this.list.length; i++) {
          const element = this.list[i];
          if (element.selected) {
            flag = true;
            break;
          }
        }
      }
      if (!flag && type != "gmsj") {
        this.$message({
          message: "请至少选中一项数据",
          type: "warning",
        });
        return;
      }
      this.selectedItem = row;
      this.dialogPvVisible = true;
    },
    dialogConfirm() {
      if (!this.modifyDate) {
        this.$message({
          message: "请正确输入时间",
          type: "warning",
        });
        return;
      }
      switch (this.handleType) {
        case "yp":
          this.handleYp();
          return;
        case "cc":
          this.handleCc();
          return;
        default:
          break;
      }
    },
    handleYp() {
      let recodeIds = "";
      for (let i = 0; i < this.list.length; i++) {
        const element = this.list[i];
        if (element.selected) {
          recodeIds += element.id + ",";
        }
      }

      let data = {
        operatorTime: parseTime(this.modifyDate, "{y}-{m}-{d} {h}:{i}"),
        recodeId: recodeIds,
      };
      arrangement(data).then((res) => {
        if (res.code == "00000") {
          this.$message({
            message: "操作完成",
            type: "success",
          });
          this.getList();
          this.dialogPvVisible = false;
          this.modifyDate = "";
        }
      });
    },
    handleCc() {
      let recodeIds = "";
      for (let i = 0; i < this.list.length; i++) {
        const element = this.list[i];
        if (element.selected) {
          recodeIds += element.id + ",";
        }
      }

      let data = {
        operatorTime: parseTime(this.modifyDate, "{y}-{m}-{d} {h}:{i}"),
        recodeId: recodeIds,
      };
      leaveFactory(data).then((res) => {
        if (res.code == "00000") {
          this.$message({
            message: "操作完成",
            type: "success",
          });
          this.getList();
          this.dialogPvVisible = false;
          this.modifyDate = "";
        }
      });
    },
    handleBackCar() {
      let recodeIds = "";
      for (let i = 0; i < this.list.length; i++) {
        const element = this.list[i];
        if (element.selected) {
          recodeIds += element.id + ",";
        }
      }
      if (recodeIds == "") {
        this.$message({
          message: "请至少选中一项数据",
          type: "warning",
        });
        return;
      }
      const that = this;
      this.$confirm("是否确认撤回?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.loading = true;
          return backWl(recodeIds);
        })
        .then(() => {
          this.getList();
          this.$message({
            message: "完成操作",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let recodeIds = "";
          for (let i = 0; i < this.list.length; i++) {
            const element = this.list[i];
            if (element.selected) {
              recodeIds += element.id + ",";
            }
          }
          let data = {
            trackId: this.temp.trackId,
            trackName: this.temp.trackName,
            operatorType: this.temp.operatorType,
            recodeId: recodeIds,
            operatorTime: parseTime(
              this.temp.operatorTime,
              "{y}-{m}-{d} {h}:{i}"
            ),
          };
          loginSend(data).then((res) => {
            if (res.code == "00000") {
              this.dialogFormVisible = false;
              this.showTrack = false;
              this.$message({
                message: "完成操作",
                type: "success",
              });
              this.getList();
            }
          });
        }
      });
    },
    showForm(title) {
      let flag = false;
      for (let i = 0; i < this.list.length; i++) {
        const element = this.list[i];
        if (element.selected) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        this.$message({
          message: "请至少选中一项数据",
          type: "warning",
        });
        return;
      }
      this.resetTemp();
      switch (title) {
        case "送检":
          this.temp.operatorType = "SEND_CHECK";
          break;
        case "送妥":
          this.temp.operatorType = "SEND_UNLOAD";
          break;
        case "送装":
          this.temp.operatorType = "SEND_COMPLETE";
          break;
        default:
          break;
      }
      this.dialogTitle = title;
      this.dialogFormVisible = true;
    },
    closeDialogForm() {
      this.dialogFormVisible = false;
      this.showTrack = false;
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
      this.$set(this.temp, "trackId", "");
      this.trackOptions = ele.children;
      const userId = this.$store.getters.userId;
      searchUserByParent(userId, ele.keyId).then((res) => {
        if (res.code == "00000") {
          this.trackOptions = res.data;
          this.showTrack = true;
        }
      });
    },
    selectTrack(value) {
      for (let i = 0; i < this.trackOptions.length; i++) {
        const element = this.trackOptions[i];
        if (element.keyId == value) {
          this.temp.trackName = element.keyValue;
          break;
        }
      }
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

<style lang="scss" scoped>
.el-link {
  margin-right: 10px;
}
.dialog_content {
  margin-right: 10px;
}
::v-deep .el-table .el-table__cell {
  padding: 0 !important;
}
</style>
