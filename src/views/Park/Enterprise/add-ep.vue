<template>
  <div class="add-enterprise">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"
          ><i class="el-icon-arrow-left" />返回</span
        >
        <span>|</span>
        <span>添加企业</span>
      </div>
      <div class="right">黑马程序员</div>
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="form">
          <el-form
            ref="ruleForm"
            label-width="100px"
            :model="addForm"
            :rules="addRules"
          >
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              <el-input v-model="addForm.legalPerson" />
            </el-form-item>
            <el-form-item label="注册地址" prop="registeredAddress">
              <el-input v-model="addForm.registeredAddress" />
            </el-form-item>
            <el-form-item label="所在行业" prop="industryCode">
              <el-select v-model="addForm.industryCode">
                <el-option
                  v-for="item in industryList"
                  :key="item.industryCode"
                  :label="item.industryName"
                  :value="item.industryCode"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="企业联系人" prop="contact">
              <el-input v-model="addForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="addForm.contactNumber" />
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicenseId">
              <!-- 
               action 文件上传地址
              :show-file-list 显示已上传文件，默认true
              :on-success 文件上传成功钩子函数
              :http-request 覆盖默认上传行为
               -->
              <el-upload
                class="avatar-uploader"
                action="https://api-hmzs.itheima.net/tj/upload"
                :show-file-list="false"
                :on-success="handleLicenseSuccess"
                :before-upload="beforeLicenseUpload"
                :http-request="uploadFn"
                :headers="{
                  Authorization: `Bearer ${$store.state.user.token}`,
                }"
                :data="{ type: 'businessLicense' }"
              >
                <!-- 有图片显示图片，否则显示加号 -->
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button>重置</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import {
  getIndustryListAPI,
  uploadAPI,
  createEnterpriseAPI,
} from "@/apis/park";

export default {
  data() {
    return {
      addForm: {
        name: "",
        legalPerson: "",
        registeredAddress: "",
        contactNumber: "",
        industryCode: "", // 所在行业
        contact: "", // 企业联系人
        businessLicenseUrl: "", // 营业执照url
        businessLicenseId: "", // 营业执照id
      },
      addRules: {
        name: [{ required: true, message: "企业名称为必填", trigger: "blur" }],
        legalPerson: [
          { required: true, message: "法人为必填", trigger: "blur" },
        ],
        registeredAddress: [
          { required: true, message: "注册地址为必填", trigger: "blur" },
        ],
        industryCode: [
          { required: true, message: "所在行业为必填", trigger: "change" },
        ],
        contact: [
          { required: true, message: "企业联系人为必填", trigger: "blur" },
        ],
        contactNumber: [
          { required: true, message: "企业联系人电话为必填", trigger: "blur" },
        ],
        businessLicenseId: [
          { required: false, message: "请上传营业执照", trigger: "change" },
        ],
      },
      industryList: [], // 行业列表
      imageUrl: "", // 图片地址
    };
  },
  mounted() {
    this.addForm.name = "小王企业";
    this.addForm.legalPerson = "小王";
    this.addForm.registeredAddress = "测试地址";
    this.addForm.contact = "小王1";
    this.addForm.contactNumber = "13311112222";
  },
  created() {
    this.getIndustryList();
  },
  methods: {
    // 获取行业列表
    async getIndustryList() {
      const res = await getIndustryListAPI();
      this.industryList = res.data;
    },
    // 文件上传成功钩子
    handleLicenseSuccess(res) {
      // this.imageUrl = res.data.url
      // this.addForm.xxx = res.data.url
      // this.addForm.xxx = res.data.id
    },
    // 文件上传之前钩子
    beforeLicenseUpload(file) {
      const list = ["image/jpeg", "image/png"];
      const isJPG = list.includes(file.type);
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式 / JPEG / PNG!");
      }
      if (!isLt3M) {
        this.$message.error("上传头像图片大小不能超过 3MB!");
      }
      // return false 未通过校验, true 通过
      return isJPG && isLt3M ? true : Promise.reject("未通过校验");
    },
    // 自定义上传行为
    async uploadFn(fileObj) {
      // 1. 用户选择的 file
      const myFile = fileObj.file;
      // 本地前端预览: 把文件数据流转成一个临时 URL 地址
      // this.imageUrl = URL.createObjectURL(myFile);

      // 2. 调用接口，服务器返回图片实际 URL 地址
      const fd = new FormData();
      // 2.1. 添加 file 和 type
      fd.append("file", myFile);
      fd.append("type", "businessLicense");
      const res = await uploadAPI(fd);
      // 2.2. 使用 url 回显预览
      this.imageUrl = res.data.url;

      // 3. 手动关联表单，使其校验通过
      this.addForm.businessLicenseUrl = res.data.url;
      this.addForm.businessLicenseId = res.data.id;
      this.$refs.ruleForm.validateField("businessLicenseId");
    },
    // 确定按钮
    async confirmAdd() {
      await this.$refs.ruleForm.validate();
      // 校验通过，发请求
      await createEnterpriseAPI(this.addForm);
      this.$router.back();
    },
  },
};
</script>

<style scoped lang="scss">
.add-enterprise {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
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
      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .el-form {
          display: flex;
          flex-wrap: wrap;
          .el-form-item {
            width: 50%;
          }
        }
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
  }
}

::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
::v-deep .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
::v-deep .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
