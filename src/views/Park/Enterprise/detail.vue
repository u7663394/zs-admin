<template>
  <div class="detail-enterprise">
    <header class="add-header">
      <el-page-header content="查看企业" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">租赁记录</div>
        <div class="table-container">
          <el-table :data="rentList" style="width: 100%" border>
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column prop="name" label="租赁楼宇" width="180" />
            <el-table-column label="租赁起止时间" width="280">
              <template #default="{ row }">
                {{ row.startTime }} - {{ row.endTime }}
              </template>
            </el-table-column>
            <el-table-column label="租赁合同(点击预览)">
              <template #default="{ row }">
                <a
                  style="color: blue"
                  :href="
                    row.contractUrl.split('.')[
                      row.contractUrl.split('.').length - 1
                    ] === 'doc'
                      ? previewURL + row.contractUrl
                      : row.contractUrl
                  "
                  target="_blank"
                  >{{ row.contractName }}</a
                >
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="录入时间" />
            <el-table-column prop="address" label="操作">
              <template v-slot="{ row }">
                <el-button type="text" @click="downLoadFn(row)"
                  >合同下载</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getEnterpriseDetailAPI, downloadFileAPI } from "@/apis/park";

export default {
  data() {
    return {
      rentList: [],
      // 浏览 doc 文件的 office 工具网站
      previewURL: "https://view.officeapps.live.com/op/view.aspx?src=",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表数据
    async getList() {
      const res = await getEnterpriseDetailAPI(this.$route.query.id);
      this.rentList = res.data.rent;
    },
    // 点击下载事件
    async downLoadFn(obj) {
      /**
       * 方式一：手动处理文件流
       * const res = await downloadFileAPI(obj.contractId)
       * console.log(res) // 后端返回的是“文件流”（二进制数据）
       *
       * 浏览器不能直接识别文件流，需要转换成文件对象（Blob）
       * Blob 可以理解为浏览器里的“文件数据容器”
       * const blob = new Blob([res])
       * console.log(blob)
       *
       * 将 Blob 转成浏览器可访问的临时地址（类似本地文件地址）
       * const url = URL.createObjectURL(blob)
       *
       * 创建一个 a 标签，用来触发浏览器下载
       * const theA = document.createElement('a')
       * theA.href = url                  // 文件地址
       * theA.download = obj.contractName // 下载时的文件名
       * theA.click()                     // 模拟点击，触发下载
       */

      // 方式二：推荐：axios 直接返回 blob
      // axios 已经帮我们把数据转成 blob，不需要再手动 new Blob
      const blob = await downloadFileAPI(obj.contractId);
      // console.log(blob);  已经是 Blob/File 对象
      // 将 Blob 转成浏览器临时地址
      const url = URL.createObjectURL(blob);
      // 创建 a 标签来触发下载
      const theA = document.createElement("a");
      theA.href = url; // 文件地址
      theA.download = obj.contractName; // 设置下载文件名
      // 模拟点击 a 标签，触发浏览器下载行为
      theA.click();
      // （可选）释放临时地址，避免内存占用
      URL.revokeObjectURL(url);
    },
  },
};
</script>

<style scoped lang="scss">
.detail-enterprise {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }
      .arrow {
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;
      margin-bottom: 20px;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }
    }
    .table-container {
      padding: 20px;
    }
    .preview {
      img {
        width: 100px;
      }
    }
  }
}
</style>
