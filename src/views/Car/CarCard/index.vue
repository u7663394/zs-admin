<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input
        clearable
        placeholder="请输入内容"
        class="search-main"
        v-model="query.carNumber"
      />
      <span class="search-label">车主姓名：</span>
      <el-input
        clearable
        placeholder="请输入内容"
        class="search-main"
        v-model="query.personName"
      />
      <span class="search-label">状态：</span>
      <el-select v-model="query.cardStatus">
        <el-option
          v-for="item in stateList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" class="search-btn" @click="searchFn"
        >查询</el-button
      >
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/add-card')"
        >添加月卡</el-button
      >
      <el-button @click="dels">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" />
        <el-table-column label="车主名称" prop="personName" />
        <el-table-column label="联系方式" prop="phoneNumber" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="车辆品牌" prop="carBrand" />
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate" />
        <el-table-column
          label="状态"
          prop="cardStatus"
          :formatter="formatterFn"
        />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <!-- scope 的值： { row: 一行数据对象 } -->
            <el-button size="mini" type="text">续费</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="edit(scope.row.id)"
              >编辑</el-button
            >
            <el-button size="mini" type="text" @click="del(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next, sizes"
        :total="total"
        :page-sizes="[2, 4, 6, 8, 10]"
        :page-size="query.pageSize"
        @current-change="currentChangeFn"
        @size-change="sizeChangeFn"
      />
    </div>
  </div>
</template>

<script>
import { delCardAPI, getCardListAPI } from "@/apis/car";

export default {
  data() {
    return {
      query: {
        page: 1,
        pageSize: 4,
        cardStatus: "", // 筛选状态
        carNumber: "",
        personName: "",
      },
      tableData: [],
      total: 0,
      stateList: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "0",
          label: "可用",
        },
        {
          value: "1",
          label: "已过期",
        },
      ],
      selectedCarList: [], // 已选行对象
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表数据
    async getList() {
      const res = await getCardListAPI(this.query);
      this.tableData = res.data.rows;
      this.total = res.data.total;
    },
    // 格式化状态列
    formatterFn(row) {
      return row.cardStatus === 0 ? "可用" : "已过期";
    },
    // 页码切换
    currentChangeFn(newPage) {
      this.query.page = newPage;
      this.getList();
    },
    // 尺寸变化
    sizeChangeFn(newSize) {
      this.query.pageSize = newSize;
      this.getList();
    },
    // 查询按钮
    searchFn() {
      this.query.page = 1;
      this.getList();
    },
    // 编辑按钮
    edit(id) {
      this.$router.push(`/add-card?id=${id}`);
    },
    // 删除按钮
    async del(id) {
      await delCardAPI(id);
      this.getList();
    },
    // 表格复选框变化
    handleSelectionChange(value) {
      // value 是选中行的对象数组
      this.selectedCarList = value;
    },
    // 批量删除
    async dels() {
      // 1. 得到所有的 id
      const idArr = this.selectedCarList.map((ele) => {
        return ele.id;
      });
      // 2. 调删除接口
      await delCardAPI(idArr.join(","));
      // 3. 刷新列表
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;

  .search-main {
    width: 220px;
    margin-right: 10px;
  }

  .search-btn {
    margin-left: 20px;
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
