<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header :content="title" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <el-form
            ref="carInfo"
            :model="carInfoForm"
            :rules="carInfoRules"
            label-width="100px"
          >
            <el-form-item label="车主姓名" prop="personName">
              <el-input v-model="carInfoForm.personName" />
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="carInfoForm.phoneNumber" />
            </el-form-item>
            <el-form-item label="车辆号码" prop="carNumber">
              <el-input v-model="carInfoForm.carNumber" />
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input v-model="carInfoForm.carBrand" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">最新一次月卡缴费信息</div>
        <div class="form">
          <el-form
            ref="feeForm"
            :model="feeForm"
            :rules="feeFormRules"
            label-width="100px"
          >
            <el-form-item label="有效日期" prop="payTime">
              <!-- 
                v-model 绑定日期选择的值
                value-format：绑定值的格式
                type: 日期组件类型
                  date: 单独日期
                  daterange：2个日期范围
                range-separator：分隔符
              -->
              <el-date-picker
                v-model="feeForm.payTime"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input v-model="feeForm.paymentAmount" />
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="feeForm.paymentMethod" clearable>
                <el-option
                  v-for="item in payMethodList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetFn">重置</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { validMobile, validCarNum, validChineseName } from "@/utils/validate";
import { createCardAPI, getCardDetailAPI, updateCardAPI } from "@/apis/car";
export default {
  data() {
    return {
      // 车辆信息表单
      carInfoForm: {
        personName: "", // 车主姓名
        phoneNumber: "", // 联系方式
        carNumber: "", // 车牌号码
        carBrand: "", // 车辆品牌
      },
      // 缴费信息表单
      feeForm: {
        payTime: [], // 支付日期
        paymentAmount: null, // 支付金额
        paymentMethod: null, // 支付方式
      },
      // 车辆信息校验
      carInfoRules: {
        personName: [
          {
            required: true,
            message: "请输入车主姓名",
            trigger: "blur",
          },
          {
            validator: this.validatorPersonName,
            trigger: "blur",
          },
        ],
        phoneNumber: [
          {
            required: true,
            message: "请输入联系方式",
            trigger: "blur",
          },
          { validator: this.validatorPhoneNumber, trigger: "blur" },
        ],
        carNumber: [
          {
            required: true,
            message: "请输入车辆号码",
            trigger: "blur",
          },
          {
            validator: this.validatorCarNumber,
            trigger: "blur",
          },
        ],
        carBrand: [
          {
            required: true,
            message: "请输入车辆品牌",
            trigger: "blur",
          },
        ],
      },
      // 缴费校验
      feeFormRules: {
        payTime: [
          {
            required: true,
            message: "请选择支付时间",
          },
        ],
        paymentAmount: [
          {
            required: true,
            message: "请输入支付金额",
            trigger: "blur",
          },
        ],
        paymentMethod: [
          {
            required: true,
            message: "请选择支付方式",
            trigger: "change",
          },
        ],
      },
      // 支付方式
      payMethodList: [
        {
          id: "Alipay",
          name: "支付宝",
        },
        {
          id: "WeChat",
          name: "微信",
        },
        {
          id: "Cash",
          name: "线下",
        },
      ],
    };
  },
  mounted() {
    // 为了展示，给一个默认数据（实际工作时不需要）
    // this.carInfoForm = {
    //   personName: "小王",
    //   phoneNumber: "13311223344",
    //   carNumber: "川A12345",
    //   carBrand: "奔驰",
    // };
    // this.feeForm = {
    //   payTime: ["2026-02-02", "2026-03-02"],
    //   paymentAmount: 10,
    //   paymentMethod: "WeChat",
    // };
  },
  computed: {
    title() {
      return this.$route.query.id ? "编辑月卡" : "增加月卡";
    },
  },
  created() {
    // 只有在有 id 的情况下才请求详情数据
    if (this.$route.query.id) this.getDetail();
  },
  methods: {
    validatorPersonName(rule, value, callback) {
      if (validChineseName(value)) callback();
      else callback(new Error("请输入正确的中文名字2-10位"));
    },
    validatorPhoneNumber(rule, value, callback) {
      if (validMobile(value)) callback();
      else callback(new Error("请输入正确格式手机号"));
    },
    validatorCarNumber(rule, value, callback) {
      if (validCarNum(value)) callback();
      else callback(new Error("请输入正确格式的车牌号"));
    },
    // 确定按钮
    async confirmAdd() {
      // 1. 校验
      await this.$refs.carInfo.validate();
      await this.$refs.feeForm.validate();
      // 经验：当接口要求的参数名/个数/类型与前端代码不一致时，需要用 JS 代码对数据进行处理
      const formData = {
        ...this.carInfoForm,
        ...this.feeForm,
      };
      formData.cardStartDate = this.feeForm.payTime[0];
      formData.cardEndDate = this.feeForm.payTime[1];
      delete formData.payTime;
      // 2. 发请求
      if (this.$route.query.id) {
        // 编辑
        await updateCardAPI(formData);
      } else {
        // 新增
        await createCardAPI(formData);
      }
      // 3. 回到上一页
      this.$router.back();
    },
    // 重置按钮
    resetFn() {
      // el-form 组件第一次创建时，会把 model 属性接收的表单数据对象复制一份，
      // 作为将来 resetFields 调用时重置使用的数据
      this.$refs.carInfo.resetFields();
      this.$refs.feeForm.resetFields();
    },
    // 获取月卡详情
    async getDetail() {
      const res = await getCardDetailAPI(this.$route.query.id);
      // 数据回显
      const { personName, phoneNumber, carNumber, carBrand, carInfoId } =
        res.data;
      this.carInfoForm = {
        personName,
        phoneNumber,
        carNumber,
        carBrand,
        carInfoId,
      };
      const {
        rechargeId,
        cardStartDate,
        cardEndDate,
        paymentAmount,
        paymentMethod,
      } = res.data;
      this.feeForm = {
        rechargeId,
        paymentAmount,
        paymentMethod,
        payTime: [cardStartDate, cardEndDate],
      };
    },
  },
};
</script>

<style scoped lang="scss">
.add-card {
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
    .preview {
      img {
        width: 100px;
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
</style>
