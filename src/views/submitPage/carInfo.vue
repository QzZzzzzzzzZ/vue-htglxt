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
            style="width:230px"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="股道" prop="currentTrackName">
          <el-input
            v-model="listQuery.currentTrackName"
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
          <el-select
            clearable
            v-model="listQuery.status"
            placeholder="状态"
            size="small"
            style="width: 120px"
          >
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
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
          >导出</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row class="row_win">
      <el-col :span="24">
        <div class>
          <span class="el-form-item__label">表头编辑</span>
          <el-checkbox
            v-for="(item,index) in columnList"
            :key="index"
            :disabled="index==0"
            v-model="item.value"
          >{{item.label}}</el-checkbox>
        </div>
      </el-col>
    </el-row>

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
      <el-table-column v-if="columnList[0].value" align="center" prop="carCode" label="车号" />
      <el-table-column
        v-if="columnList[1].value"
        align="center"
        prop="sourceName"
        width="60"
        label="发站"
      />
      <el-table-column
        v-if="columnList[2].value"
        align="center"
        prop="materialName"
        label="物资"
        width="200"
      />
      <el-table-column
        v-if="columnList[3].value"
        align="center"
        prop="targetName"
        width="60"
        label="去向"
      />
      <el-table-column
        v-if="columnList[4].value"
        align="center"
        prop="currentTrackName"
        label="当前股道"
      />
      <el-table-column v-if="columnList[5].value" align="center" label="入厂时间" width="100">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.grossTime,'{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="columnList[6].value" align="center" label="送检时间" width="100">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.sendCheckTime,'{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="columnList[7].value" align="center" label="取样完成时间" width="105">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.sampleCompleteTime,'{y}-{m}-{d}')}}</span>
          <br />
          <span>{{parseTime(scope.row.sampleCompleteTime,'{h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="columnList[8].value" align="center" label="送妥时间" width="100">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.sendProperlyTime,'{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="columnList[9].value" align="center" label="送装时间" width="100">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.sendPackTime,'{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="columnList[10].value" align="center" label="装好时间" width="100">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.packCompleteTime,'{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="columnList[11].value" align="center" label="出厂时间" width="100">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.leaveFactoryTime,'{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="columnList[12].value" align="center" label="预排时间" width="100">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.arrangementTime,'{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="columnList[13].value"
        align="center"
        prop="trackNames"
        width="80"
        label="股道记录"
      />
      <el-table-column v-if="columnList[14].value" align="center" prop="status" label="状态">
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageQuery.page"
        :page-sizes="[50,100,150,200,250,300]"
        :page-size="pageQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getAllRport } from "@/api/article";
import { searchUser } from "@/api/auth.js";
import waves from "@/directive/waves"; // 水波纹指令
import moment from "moment";
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
      pageQuery: {
        page: 1,
        limit: 50,
      },
      date: [
        moment()
          .subtract(30, "days")
          .startOf("day")
          .format("YYYY-MM-DD 00:00:00"),
        moment()
          .subtract(0, "days")
          .startOf("day")
          .format("YYYY-MM-DD 23:59:59"),
      ],
      listQuery: {
        status: null,
        sourceName: undefined,
        targetName: undefined,
        carCode: undefined,
        startDate: moment()
          .subtract(30, "days")
          .startOf("day")
          .format("YYYY-MM-DD 00:00:00"),
        endDate: moment()
          .subtract(0, "days")
          .startOf("day")
          .format("YYYY-MM-DD 23:59:59"),
      },
      statusOptions: [
        { label: "登记", key: "REGISTER" },
        { label: "送检", key: "SEND_CHECK" },
        { label: "取样完成", key: "COMPLETE_CHECK" },
        { label: "送妥", key: "SEND_PROPERLY" },
        { label: "报空", key: "COMPLETE_EMPTY" },
        { label: "送装", key: "SEND_PACK" },
        { label: "装好", key: "COMPLETE_PACK" },
        { label: "出厂", key: "LEAVE_FACTORY" },
      ],
      regionOptions: [], //区域选项
      trackOptions: [], //股道选项
      // 表单数据  临时数据
      temp: {
        operatorType: undefined, //操作类型
        recodeId: "", //数据编号
        currentTrackName: "",
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
      columnList: [
        {
          label: "车号",
          value: true,
        },
        {
          label: "发站",
          value: true,
        },
        {
          label: "物资",
          value: true,
        },
        {
          label: "去向",
          value: true,
        },
        {
          label: "当前股道",
          value: true,
        },
        {
          label: "入厂时间",
          value: true,
        },
        {
          label: "送检时间",
          value: true,
        },
        {
          label: "取样完成时间",
          value: true,
        },
        {
          label: "送妥时间",
          value: true,
        },
        {
          label: "送装时间",
          value: true,
        },
        {
          label: "装好时间",
          value: true,
        },
        {
          label: "出厂时间",
          value: true,
        },
        {
          label: "预排时间",
          value: true,
        },
        {
          label: "股道记录",
          value: true,
        },
        {
          label: "状态",
          value: true,
        },
      ],
    };
  },

  created() {
    // 初始化表格高度
    this.toableHeight = document.documentElement.clientHeight - 200;
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
        targetName: undefined,
        carCode: undefined,
        startDate: moment()
          .subtract(30, "days")
          .startOf("day")
          .format("YYYY-MM-DD 23:59:59"),
        endDate: moment()
          .subtract(0, "days")
          .startOf("day")
          .format("YYYY-MM-DD 23:59:59"),
      };
    },
    getList() {
      this.listLoading = true;
      this.listQuery.startDate = this.date[0];
      this.listQuery.endDate = this.date[1];
      getAllRport(this.listQuery).then((response) => {
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
        currentTrackName: "",
        trackId: "",
        operatorTime: "",
      };
    },
    handleExport() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let date = this.date;
      this.download(
        "train-stoptime/recode/getRecord/download ",
        {
          ...this.listQuery,
        },
        `火车停时管理[${moment(date[0]).format("YYYY-MM-DD")}至${moment(
          date[1]
        ).format("YYYY-MM-DD")}].xls`
      )
        .then((res) => {
          loading.close();
        })
        .catch((err) => {
          console.log(err);
        });
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
.row_win {
  margin-bottom: 20px;
}
</style>
