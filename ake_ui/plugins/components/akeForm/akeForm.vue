<!--
 * @Author: xiaoHao
-->
<!--
 * @Author: hlong
 * @Description: 表单
 * @Date: 2022-04-06 10:13:22
 * @LastEditTime: 2023-04-03 16:55:24
 * @FilePath: \Water-Marketing-System1\src\components-util\akeForm.vue
 /** 
配置项及数据
  formList: {
    formVisible,    弹出框开关
    width,          弹出框宽度 默认700
    title,          弹出框标题
    prop: {
      key: {
        type,           类型  (input，textarea，select，radio，checkbox，datetime,datePicker，monthPicker，weekPicker，yearPicker，daterange，monthrange)
        name,           绑定属性
        label,        
        style,
        placeholder,
        required,       是否必填
        validator,      自定义校验规则 
        append,         input单位
        options,        列表
        optionsLabel,   自定义绑定label值
        optionsValue,   自定义绑定value值
        editor,         各表单可配置项
        isShow,         是否显示
        valueWidth,     修改width
      }
    },
    formData: {},     绑定列表
  }

插槽
 #header/v-slot:header 首部
 #footer/v-slot:footer 尾部

提交表单
  @submit
弹窗关闭
  @closeDialog
表单重置
  @resetFields
change事件
  @change

**/
-->





<template>
  <div>
    <!--  -->
    <el-dialog :close-on-click-modal="false" :title="formList.title" :width="formList.width ? formList.width : '700px'"
      :visible.sync="show" :before-close="closeDialog">
      <akeFormItem @change="change" :formList="formList" ref="akeFormItem">
        <template #header>
          <slot name="header"></slot>
        </template>
        <template #footer>
          <slot name="footer"></slot>
        </template>
      </akeFormItem>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="iconfont iconbianji" plain @click="submitForm('FormRules')">
          {{ formList.btnName || "确 定" }}
        </el-button>
        <el-button type="danger" plain icon="iconfont iconquxiao" @click="closeDialog">
          取 消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import akeFormItem from "./akeFormItem";
  /**
* @description: 表单
* @module akeForm
* @param {Object} formList - 表单配置项
* @example 
 formList: {
      type: Object,
      default: function () {
        return {
          prop: {},
          formData: {},
          formVisible: false,
          width: "800px",
        }

      },
    },
*/ 
export default {
  name: 'akeForm',
  components: {

    akeFormItem,
  },
  watch: {
    "formList.formVisible": {
      handler(val) {
        this.show = val;
      },
      immediate: true,
    },
  },
  props: {
    formList: {
      type: Object,
      default: function () {
        return {
          prop: {},
          formData: {},
          formVisible: false,
          width: "800px",
        }

      },
    },
  },
  data() {
    return {
      FormRules: {},
      show: false,
    };
  },
  created() {

  },
  methods: {
    /**
     * @event change - 提交表单
     * @param {*} val - select选中value值
     * @param {Number} key - 当前绑定对象中的key  可根据返回key判断点击的formItem
     * @return {Object} 
     */    
    change(val, key) {
      // val - > select选中value值
      // key - > 当前绑定对象中的key  可根据返回key判断点击的formItem
      this.$emit("change", val, key);
    },
    // 弹窗确认
      /**
     * @event submit - 提交表单
    
     */  
    async submitForm() {
      let flag = await this.$refs.akeFormItem.justify();
      if (flag) {
        this.$emit("submit");
      }
    },
    // 弹窗关闭
     /**
     * @event closeDialog - 弹窗关闭
    
     */  
    closeDialog() {
      this.resetFields();
      this.show = false;
    },
    // 表单重置
     /**
     * @event resetFields - 表单重置
    
     */  
    resetFields() {
      this.$refs.akeFormItem.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.labelBr {
  display: inline-flex !important;
  align-items: center !important;
}

.labelBr ::v-deep label.el-form-item__label {
  line-height: 17px !important;
}
</style>