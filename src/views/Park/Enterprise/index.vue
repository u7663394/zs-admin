<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input
        v-model="params.name"
        clearable
        placeholder="请输入内容"
        class="search-main"
      />
      <el-button type="primary" @click="searchFn">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/add-ep')"
        >添加企业</el-button
      >
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="enterpriseList"
        @expand-change="expandChangeFn"
      >
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 展开行时展示内容 -->
          <template #default="scope">
            <el-table :data="scope.row.list">
              <el-table-column
                label="租赁楼宇"
                width="320"
                prop="buildingName"
              />
              <el-table-column label="租赁起始时间" prop="startTime" />
              <el-table-column label="合同状态" prop="status">
                <template #default="rowData">
                  <el-tag :type="formatStatus(rowData.row.status)">
                    {{ TYPEMAP[rowData.row.status] }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="{ row }">
                  <el-button
                    size="mini"
                    type="text"
                    :disabled="!(row.status === 1 || row.status === 2)"
                    >续租</el-button
                  >
                  <el-button
                    size="mini"
                    type="text"
                    :disabled="row.status === 3"
                    @click="backRentFn(row.id)"
                    >退租</el-button
                  >
                  <el-button
                    size="mini"
                    type="text"
                    :disabled="row.status !== 3"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column label="联系电话" prop="contactNumber" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="mini"
              type="text"
              @click="showAddRentDialog(scope.row.id)"
              >添加合同</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="$router.push(`/ep-detail?id=${scope.row.id}`)"
              >查看</el-button
            >
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        :page-size="params.pageSize"
        :total="enterpriseTotal"
        layout="total, prev, pager, next"
        @current-change="currentChangeFn"
      />
    </div>
    <!-- 添加合同对话框 -->
    <el-dialog title="添加合同" :visible.sync="rentDialogVisible" width="580px">
      <!-- 表单区域 -->
      <div class="form-container">
        <el-form
          ref="addForm"
          :model="rentForm"
          :rules="rentRules"
          label-position="top"
        >
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select v-model="rentForm.buildingId" placeholder="请选择">
              <el-option
                v-for="item in rentBuildList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="租赁起止日期" prop="rentTime">
            <el-date-picker
              v-model="rentForm.rentTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="租赁合同" prop="contractId">
            <el-upload
              action="#"
              :http-request="uploadHandle"
              :before-upload="beforeUpload"
              :limit="1"
            >
              <el-button size="small" type="primary" plain
                >上传合同文件</el-button
              >
              <!-- slot="tip" 提示说明文字 等价于 v-slot:tip -->
              <div slot="tip" class="el-upload__tip">
                支持扩展名：.doc .pdf, 文件大小不超过5M
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAdd"
          >确 定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getEnterpriseListAPI,
  getRentBuildListAPI,
  createRentAPI,
  uploadAPI,
  getRentListAPI,
  outRentAPI,
} from "@/apis/park";

export default {
  data() {
    return {
      // 查询参数对象
      params: {
        page: 1,
        pageSize: 4,
        name: "",
      },
      enterpriseList: [],
      enterpriseTotal: 0,
      rentDialogVisible: false, // 对话框显示/隐藏
      rentForm: {
        buildingId: null,
        contractId: null,
        contractUrl: "",
        enterpriseId: null,
        type: 0, // 合同类型（0 添加合同，1 续签合同）
        rentTime: [],
      },
      // 合同样式
      TYPEMAP: {
        0: "待生效",
        1: "生效中",
        2: "已到期",
        3: "已退租",
      },
      rentRules: {
        buildingId: [
          { required: true, message: "请选择楼宇", trigger: "change" },
        ],
        rentTime: [
          { required: true, message: "请选择租赁日期", trigger: "change" },
        ],
        contractId: [{ required: false, message: "请上传合同文件" }],
      },
      rentBuildList: [], // 楼宇列表
    };
  },
  created() {
    this.getList();
    this.getRentBuildList();
  },
  methods: {
    // 获取企业列表
    async getList() {
      const res = await getEnterpriseListAPI(this.params);
      this.enterpriseTotal = res.data.total;
      /**
       * 问题说明：
       * 在运行过程中，如果给对象动态新增属性，Vue2 无法监听到这些变化，因此视图不会自动更新。
       *
       * 原因：
       * Vue2 基于 Object.defineProperty 实现数据响应式，
       * 只会对初始化时已存在的属性进行 getter / setter 劫持。
       * enterpriseList 中的对象在初始时仅包含固定的几个字段，
       * 后续新增的属性不会被劫持。
       *
       * 解决：
       * 在数据赋值给 Vue 之前，提前为每个对象补充需要的字段，
       * 这样这些属性就能被 Vue 正确地转换为响应式数据。
       */
      const list = res.data.rows.map((obj) => {
        return {
          ...obj,
          list: [], // 用于后续展开行时存储子数据
        };
      });
      this.enterpriseList = list;
    },
    // 分页切换
    currentChangeFn(newPage) {
      this.params.page = newPage;
      this.getList();
    },
    // 查询
    searchFn() {
      this.getList();
    },
    // 添加合同按钮
    showAddRentDialog(id) {
      this.rentForm.enterpriseId = id;
      this.rentDialogVisible = true;
    },
    // 获取楼宇列表
    async getRentBuildList() {
      const res = await getRentBuildListAPI();
      this.rentBuildList = res.data;
    },
    // 上传文件
    async uploadHandle(file) {
      const fd = new FormData();
      fd.append("file", file.file);
      fd.append("type", "contract");
      const res = await uploadAPI(fd);
      // 保存到表单数据里
      this.rentForm.contractId = res.data.id;
      this.rentForm.contractUrl = res.data.url;
    },
    // 文件上传前校验
    beforeUpload(file) {
      // .doc 或 .pdf 类型文件
      const list = ["application/msword", "application/pdf"];
      const isFile = list.includes(file.type);
      // 大小 byte / 1024 = kb, / 1024 = mb
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isFile) {
        this.$message.error("上传文件只能是 .doc 或者 .pdf 格式！");
      }
      if (!isLt5M) {
        this.$message.error("上传文件大小只能 5 Mb 以内");
      }
      return (isFile && isLt5M) || Promise.reject();
    },
    // 提交合同按钮
    async confirmAdd() {
      // 1. 处理数据 -> 与接口一致
      const data = {
        ...this.rentForm,
      };
      data.startTime = this.rentForm.rentTime[0];
      data.endTime = this.rentForm.rentTime[1];
      delete data.rentTime;
      // 2. 发请求
      await createRentAPI(data);
    },
    // 监听展开行
    async expandChangeFn(row, rows) {
      // row: 当前展开行的数据对象
      // rows：所有展开行的数据对象
      if (rows.includes(row)) {
        // 1. 展开时发请求
        const res = await getRentListAPI(row.id);
        // 2. 给对象新增属性: 对象.新属性 = 值
        row.list = res.data;
      }
    },
    // 获取合同状态
    formatStatus(status) {
      const statusMap = {
        0: "warning",
        1: "success",
        2: "info",
        3: "danger",
      };
      return statusMap[status];
    },
    // 退租按钮
    async backRentFn(rentId) {
      await outRentAPI(rentId);
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.department-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container {
  margin: 10px 0px;
}
.page-container {
  padding: 4px 0px;
  text-align: right;
}
.form-container {
  padding: 0px 80px;
}
</style>
