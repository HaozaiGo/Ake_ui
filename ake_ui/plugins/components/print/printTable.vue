<template>
  <div ref="print" class="printtable">
    <!-- <div class="title">{{ printData.transTypeDictText }}收据</div> -->
    <div class="title">汾阳自来水公司水费收据</div>

    <!-- {{ tableName }} -->
    <div class="subTit">
      <span> 交款日期：{{ printData.dealDt }}</span>
      <span>票据编号： {{ printData.seqnoCur }}</span>
    </div>
    <table
      border="1px"
      cellspacing="0"
      cellpadding="0"
      width="100%"
      id="pTable"
    >
      <tr>
        <td rowspan="2" style="width: 15%; text-align: center">
          交款单位<br />（交款人）
        </td>
        <td style="border-right-style: none">
          用户编号: {{ printData.customerCode }}
        </td>
        <td colspan="2">用户姓名: {{ printData.customerName }}</td>
        <!-- <td>账号: {{ printData.code }}</td> -->
      </tr>
      <tr>
        <td colspan="3">住 址：{{ printData.address }}</td>
      </tr>
      <tr>
        <td style="text-align: center">收款项目</td>
        <td>{{ printData.transTypeDictText }}</td>
        <td colspan="2">付款方式：{{ printData.paymentTypeDictText }}</td>
      </tr>
      <tr>
        <td colspan="4">
          金额（大写）：<span style="padding-left: 20px"
            >{{ printData.amtBig }}
            <span style="margin-left: 150px; border-top-style: none"
              >￥{{ printData.dealAmt }}</span
            ></span
          >
        </td>
      </tr>
      <!-- <tr>
        <td colspan="4" style="text-align: right; padding-right: 120px">
          
        </td>
      </tr> -->
      <tr>
        <td rowspan="2" style="text-align: center">备注</td>
        <td colspan="3">无收款章，无收费名章无效</td>
        <!-- <td colspan="2">
          {{ printData.transTypeDictText }}前余额：¥{{ printData.beforeAmt }}
        </td>

        <td>
          {{ printData.transTypeDictText }}后余额：¥{{ printData.afterAmt }}
        </td> -->
      </tr>

      <!-- <tr>
        <td colspan="3">阀门控制状态为：{{ printData.ctrlStatusName }}</td>
      </tr> -->
    </table>
    <div class="tips">
      <span>{{ printData.describe }}</span>
    </div>
    <div class="bottomTips">
      <!-- <span>收款单位：{{ printData.payeeDept }}</span> -->
      <!-- <span>收款人：{{ printData.nickName }}</span>
      <span>出纳：{{ printData.cashier }}</span> -->
      <span>收款单位：（章）</span>
      <span>收款人：{{ printData.nickName }}</span>
      <span>开票人：{{ printData.cashier }}</span>
    </div>
  </div>
</template>

<script>
import { getNowDateAll, getTomorrowDateStartDt } from "@/utils/datetime";
  /**
* @description: 
* @module 打印组件
* @example 
  tableName: {
      default: "预付费充值收据",
    },
    printData: {},
*/ 
export default {
  name: "printTable",
  data() {
    return {
      nowDate: getNowDateAll(),
    };
  },
  created() {},
  props: {
    tableName: {
      default: "预付费充值收据",
    },
    printData: {},
  },
};
</script>

<style lang="scss" scoped>
.tips {
  margin: 5px 0px;
  float: right;
  font-size: 12px;
}
#pTable td {
  border: solid #000 1px;
}
.title {
  text-align: center;
  font-size: 18px;
  font-weight: 500;
}
.printtable {
  width: 750px;
  // color: black;
}
.subTit {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-top: 18px;
  margin-bottom: 5px;
}
table {
  margin: 0;
  padding: 0;
  border-collapse: collapse;

  border: 1px solid black;
  td {
    height: 40px;
    padding-left: 5px;
  }
}
.bottomTips {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-top: 20px;
  width: 80%;
}
</style>