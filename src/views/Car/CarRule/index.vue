<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary">增加停车计费规则</el-button>
      <el-button @click="exportToExcel">导出Excel</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table :data="ruleList" style="width: 100%">
        <el-table-column type="index" label="序号" />
        <el-table-column label="计费规则编号" prop="ruleNumber" />
        <el-table-column label="计费规则名称" prop="ruleName" />
        <el-table-column label="免费时长(分钟)" prop="freeDuration" />
        <el-table-column label="收费上线(元)" prop="chargeCeiling" />
        <el-table-column label="计费方式">
          <template #default="scope">
            {{ chargeTypeObj[scope.row.chargeType] }}
          </template>
        </el-table-column>
        <el-table-column label="计费规则" prop="ruleNameView" />
        <el-table-column label="操作" fixed="right" width="120">
          <template>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getRuleListAPI } from "@/apis/car";
import { utils, writeFileXLSX } from "xlsx";

/**
 * Excel 表格导出方式说明：
 * 1. 前端导出：
 *    - 前端先请求接口获取数据
 *    - 使用 xlsx 等插件在浏览器中生成 Excel 文件
 *
 * 2. 后端导出：
 *    - 后端直接将数据生成 Excel 文件并存储在服务器
 *    - 返回该文件的访问地址（URL）给前端
 *    - 前端通过 a 标签的 href 指向该地址，实现文件下载
 */

export default {
  name: "Building",
  data() {
    return {
      ruleList: [],
      params: {
        page: 1,
        pageSize: 10,
      },
      total: 0,
      dialogVisible: false,
      chargeTypeObj: {
        duration: "时长收费",
        turn: "按次收费",
        partition: "分段收费",
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表数据
    async getList() {
      const res = await getRuleListAPI(this.params);
      this.ruleList = res.data.rows;
      this.total = res.data.total;
    },
    // 导出为 Excel 表格
    exportToExcel() {
      /**
       * 目标：
       * 让导出的 Excel 表格列顺序可控，避免顺序混乱
       *
       * 前置知识：
       * 1. utils.json_to_sheet() 会根据对象的属性顺序生成列
       * 2. Object.keys() 获取对象属性时：
       *    - 普通字符串属性：按添加顺序
       *    - 数字属性：会被提前，并按数值大小排序
       *    - 不要使用纯数字作为对象 key，否则顺序会被打乱
       *
       * 解决方案：
       * 手动定义字段顺序（keys），
       * 然后按顺序创建一个“新对象”，保证字段顺序一致
       */

      // 1. 导出字段
      const keys = [
        "id",
        "ruleNumber",
        "ruleName",
        "freeDuration",
        "chargeCeiling",
        "chargeType",
        "ruleNameView",
      ];
      // 2. 将原始数据 ruleList 转换为新数组 newDataList
      const newDataList = this.ruleList.map((item, index) => {
        const newObj = {};
        keys.forEach((keyStr) => {
          // 特殊字段处理
          if (keyStr === "chargeType") {
            // 将计费方式从编码转成文字
            newObj[keyStr] = this.chargeTypeObj[item[keyStr]];
          } else if (keyStr === "id") {
            // 序号：用当前索引 + 1
            newObj[keyStr] = index + 1;
          } else {
            // 普通字段：直接赋值
            newObj[keyStr] = item[keyStr];
          }
        });
        return newObj;
      });
      // 3. 创建工作簿
      const workbook = utils.book_new();
      // 4. 将数据数组转换为工作表
      const worksheet = utils.json_to_sheet(newDataList);
      // 5. 添加工作表到工作簿 + 设置 sheet 名称
      utils.book_append_sheet(workbook, worksheet, "停车计费规则");
      // 6. 字段名与中文名映射表
      const keyObj = {
        id: "序号",
        ruleNumber: "计费规则编号",
        ruleName: "计费规则名称",
        freeDuration: "免费时长(分钟)",
        chargeCeiling: "收费上限(元)",
        chargeType: "计费方式",
        ruleNameView: "计费规则",
      };
      // 7. 根据 keys 顺序生成中文表头，保证表头顺序与数据列完全一致
      const headerList = keys.map((item) => keyObj[item]);
      // 8. 将表头插入到 A1 位置
      utils.sheet_add_aoa(worksheet, [headerList], { origin: "A1" });
      // 9. 导出为 Excel 文件 + 命名
      writeFileXLSX(workbook, "行车管理-计费规则管理.xlsx");

      /**
       * 常见问题说明：
       *
       * Q: 数据和表头是如何对应的？
       * A: 通过 Object.keys() 按对象属性顺序生成列
       *
       * Q: 为什么列顺序会错乱？
       * A: 因为对象属性顺序不可控，尤其包含数字 key 时
       *
       * Q: 如何彻底解决？
       * A: 用 keys 手动控制顺序 + 重组新对象（推荐方案）
       */
    },
  },
};
</script>

<style lang="scss" scoped>
.rule-container {
  padding: 20px;
  background-color: #fff;
}

.rules .el-form-item {
  padding: 0 10px;
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
