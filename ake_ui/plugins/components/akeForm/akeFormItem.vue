<!--
 * @Author: hlong
 * @Description: 表单
 * @Date: 2022-04-06 10:13:22
 * @LastEditTime: 2023-04-03 16:54:19
 * @FilePath: \Water-Marketing-System1\src\components-util\akeFormItem.vue
-->

<template>
  <div>
    <el-form
      :inline="true"
      :model="formList.formData"
      ref="FormRules"
      :rules="FormRules"
      :label-position="formList.labelPosition"
      style="position: relative"
      :label-width="formList.labelWidth ? formList.labelWidth : '120px'"
    >
      <template>
        <slot name="header"></slot>
        <template v-for="(item, index, num) in formList.prop">
          <!-- 头部插槽 -->
          <el-form-item
            :key="num"
            :style="
              formList.formBottom
                ? 'margin-bottom:' + formList.formBottom
                : 'margin-bottom:3px'
            "
            :label="
              item.type == 'button' || item.type == 'buttonMore'
                ? ''
                : item.label + ':'
            "
            :label-width="item.labelWidth"
            :prop="index"
            :class="[item.labelBr ? 'labelBr' : '']"
            v-if="!item.isShow"
            v-show="
              formList.screenshow == undefined
                ? true
                : formList.screenshow || num == 0 || index == 'query'
            "
            :ref="index"
          >
            <!-- text -->
            <template v-if="item.type == 'text'">
              <p
                :style="
                  item.valueWidth ? 'width:' + item.valueWidth : 'width:100%;'
                "
              >
                {{ formList.formData[index] }}
              </p>
            </template>

            <!-- button -->
            <template v-if="item.type == 'button'">
              <el-button
                type="primary"
                size="mini"
                @click="query()"
                icon="iconfont iconsousuo"
                >查询</el-button
              >
            </template>
            <!-- 如果是Input -->
            <template v-if="item.type == 'input'">
              <el-input
                v-bind="item.editor"
                :clearable="!item.clearable"
                :placeholder="
                  item.placeholder ? item.placeholder : '请输入' + item.label
                "
                :style="
                  item.valueWidth ? 'width:' + item.valueWidth : 'width:180px;'
                "
                v-model.trim="formList.formData[index]"
                @input="item.changeInput"
                ><template v-if="item.append" slot="append">{{
                  item.appendText
                }}</template></el-input
              >
            </template>
            <template v-if="item.type == 'inputNumber'">
              <el-input-number
                v-bind="item.editor"
                :clearable="!item.clearable"
                :placeholder="
                  item.placeholder ? item.placeholder : '请输入' + item.label
                "
                :style="
                  item.valueWidth ? 'width:' + item.valueWidth : 'width:180px'
                "
                v-model="formList.formData[index]"
                @change="(val) => change(val, index)"
              ></el-input-number>
            </template>
            <!-- <template v-else-if="item.type == 'tree'">
            <tree
              v-model="formList.formData[index]"
              :placeholder="
                item.placeholder ? item.placeholder : '请选择' + item.label
              "
              :nodeKey="item.nodekey ? item.nodekey : 'id'"
              :treeSingle="item.treeSingle"
              :defaultProps="
                item.defaultProps
                  ? item.defaultProps
                  : { children: 'children', label: 'label' }
              "
              :ALLchecked="item.ALLchecked"
              :width="item.valueWidth ? item.valueWidth : '180px'"
              :data="item.data"
              @changeshow="item.changeshow"
            ></tree>
          </template> -->
            <!-- textarea -->
            <template v-else-if="item.type == 'textarea'">
              <el-input
                type="textarea"
                :placeholder="
                  item.placeholder ? item.placeholder : '请输入' + item.label
                "
                :clearable="!item.clearable"
                v-bind="item.editor"
                :style="
                  item.valueWidth ? 'width:' + item.valueWidth : 'width:495px'
                "
                v-model="formList.formData[index]"
              >
              </el-input>
            </template>
            <!-- switch -->
            <template v-else-if="item.type == 'switch'">
              <el-switch
                v-bind="item.editor"
                :style="
                  item.valueWidth ? 'width:' + item.valueWidth : 'width:180px'
                "
                v-model="formList.formData[index]"
              >
              </el-switch>
            </template>
            <!-- Cascader -->
            <template v-else-if="item.type == 'cascader'">
              <el-cascader
                v-model="formList.formData[index]"
                :options="item.options"
                v-bind="item.editor"
                :placeholder="
                  item.placeholder ? item.placeholder : '请选择' + item.label
                "
                @change="(val) => change(val, index)"
              >
              </el-cascader>
            </template>
            <!-- 如果是下拉框 select -->
            <template v-else-if="item.type == 'select'">
              <el-select
                v-model="formList.formData[index]"
                :clearable="!item.clearable"
                :style="
                  item.valueWidth ? 'width:' + item.valueWidth : 'width:180px'
                "
                collapse-tags
                v-bind="item.editor"
                :placeholder="
                  item.placeholder ? item.placeholder : '请选择' + item.label
                "
                @change="(val) => change(val, index)"
              >
                <el-option
                  v-for="i in item.options"
                  :key="
                    i[item.optionsValue] ? i[item.optionsValue] : i.dictValue
                  "
                  :label="
                    i[item.optionsLabel] ? i[item.optionsLabel] : i.dictLabel
                  "
                  :value="
                    i[item.optionsValue] ? i[item.optionsValue] : i.dictValue
                  "
                >
                </el-option>
              </el-select>
            </template>
            <!-- 如果是下拉框 多select -->
            <template v-else-if="item.type == 'moreSelect'">
              <el-select
                v-model="formList.formData[index]"
                :clearable="!item.clearable"
                :style="
                  item.valueWidth ? 'width:' + item.valueWidth : 'width:180px'
                "
                multiple
                filterable
                v-bind="item.editor"
                :placeholder="
                  item.placeholder ? item.placeholder : '请选择' + item.label
                "
                @change="(val) => change(val, index)"
              >
                <!-- collapse-tags -->
                <el-option
                  v-for="i in item.options"
                  :key="
                    i[item.optionsValue] ? i[item.optionsValue] : i.dictValue
                  "
                  :label="
                    i[item.optionsLabel] ? i[item.optionsLabel] : i.dictLabel
                  "
                  :value="
                    i[item.optionsValue] ? i[item.optionsValue] : i.dictValue
                  "
                >
                </el-option>
              </el-select>
            </template>

            <!-- 如果是单选框 radio -->
            <template v-else-if="item.type == 'radio'">
              <el-radio-group
                v-model="formList.formData[index]"
                v-bind="item.editor"
                @change="(val) => change(val, index)"
                :style="
                  item.valueWidth ? 'width:' + item.valueWidth : 'width:180px'
                "
              >
                <el-radio
                  v-for="(i, l) in item.options"
                  :label="
                    i[item.optionsValue] ? i[item.optionsValue] : i.dictValue
                  "
                  :key="l"
                  :disabled="i.disabled"
                  >{{
                    i[item.optionsLabel] ? i[item.optionsLabel] : i.dictLabel
                  }}
                </el-radio>
              </el-radio-group>
            </template>
            <!-- 如果是多选框 checkbox -->
            <template v-else-if="item.type == 'checkbox'">
              <el-checkbox-group
                @change="(val) => change(val, index)"
                v-model="formList.formData[index]"
                v-bind="item.editor"
                :style="
                  item.valueWidth ? 'width:' + item.valueWidth : 'width:180px'
                "
              >
                <el-checkbox
                  v-for="(i, l) in item.options"
                  :label="
                    i[item.optionsValue] ? i[item.optionsValue] : i.dictValue
                  "
                  :key="l"
                  :disabled="i.disabled"
                  >{{
                    i[item.optionsLabel] ? i[item.optionsLabel] : i.dictLabel
                  }}</el-checkbox
                >
              </el-checkbox-group>
            </template>
            <!-- time -->
            <template v-else-if="item.type == 'timePicker'">
              <el-time-picker
                v-model="formList.formData[index]"
                :clearable="!item.clearable"
                :style="
                  item.valueWidth ? 'width:' + item.valueWidth : 'width:180px'
                "
                type="date"
                v-bind="item.editor"
                :placeholder="
                  item.placeholder ? item.placeholder : '请选择' + item.label
                "
                @change="(val) => change(val, index)"
              />
            </template>
            <!-- datetime -->
            <template v-else-if="item.type == 'datetime'">
              <el-date-picker
                v-model="formList.formData[index]"
                :clearable="!item.clearable"
                :style="
                  item.valueWidth ? 'width:' + item.valueWidth : 'width:180px'
                "
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                v-bind="item.editor"
                :placeholder="
                  item.placeholder ? item.placeholder : '请选择' + item.label
                "
                @change="(val) => change(val, index)"
              />
            </template>
            <!-- date -->
            <template v-else-if="item.type == 'datePicker'">
              <el-date-picker
                v-model="formList.formData[index]"
                :clearable="!item.clearable"
                :style="
                  item.valueWidth ? 'width:' + item.valueWidth : 'width:180px'
                "
                type="date"
                v-bind="item.editor"
                value-format="yyyy-MM-dd"
                :placeholder="
                  item.placeholder ? item.placeholder : '请选择' + item.label
                "
                @change="(val) => change(val, index)"
              />
            </template>
            <!-- month -->
            <template v-else-if="item.type == 'monthPicker'">
              <el-date-picker
                v-model="formList.formData[index]"
                :clearable="!item.clearable"
                :style="
                  item.valueWidth ? 'width:' + item.valueWidth : 'width:180px'
                "
                type="month"
                v-bind="item.editor"
                value-format="yyyy-MM"
                :placeholder="
                  item.placeholder ? item.placeholder : '请选择' + item.label
                "
                @change="(val) => change(val, index)"
              />
            </template>
            <!-- week -->
            <template v-else-if="item.type == 'weekPicker'">
              <el-date-picker
                v-model="formList.formData[index]"
                :clearable="!item.clearable"
                :style="
                  item.valueWidth ? 'width:' + item.valueWidth : 'width:180px'
                "
                type="week"
                format="yyyy 第 WW 周"
                v-bind="item.editor"
                value-format="yyyy-MM-dd"
                :placeholder="
                  item.placeholder ? item.placeholder : '请选择' + item.label
                "
                @change="(val) => change(val, index)"
              />
            </template>
            <!-- year -->
            <template v-else-if="item.type == 'yearPicker'">
              <el-date-picker
                v-model="formList.formData[index]"
                :clearable="!item.clearable"
                :style="
                  item.valueWidth ? 'width:' + item.valueWidth : 'width:180px'
                "
                type="year"
                v-bind="item.editor"
                value-format="yyyy"
                :placeholder="
                  item.placeholder ? item.placeholder : '请选择' + item.label
                "
                @change="(val) => change(val, index)"
              />
            </template>
            <!-- daterange -->
            <template v-else-if="item.type == 'daterange'">
              <el-date-picker
                v-model="formList.formData[index]"
                :clearable="!item.clearable"
                :style="
                  item.valueWidth ? 'width:' + item.valueWidth : 'width:180px'
                "
                type="daterange"
                v-bind="item.editor"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                @change="(val) => change(val, index)"
              />
            </template>
            <!-- monthrange -->
            <template v-else-if="item.type == 'monthrange'">
              <el-date-picker
                v-model="formList.formData[index]"
                :clearable="!item.clearable"
                :style="
                  item.valueWidth ? 'width:' + item.valueWidth : 'width:180px'
                "
                type="monthrange"
                v-bind="item.editor"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM"
                @change="(val) => change(val, index)"
              />
            </template>
            <!-- datetimerange -->
            <template v-else-if="item.type == 'datetimerange'">
              <el-date-picker
                v-model="formList.formData[index]"
                :clearable="!item.clearable"
                :style="
                  item.valueWidth ? 'width:' + item.valueWidth : 'width:180px'
                "
                type="datetimerange"
                v-bind="item.editor"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="(val) => change(val, index)"
              />
            </template>
          </el-form-item>
          <template v-if="item.br"><br /></template>
          <!-- 尾部插槽 -->
        </template>
        <slot name="footer"></slot>
        <!-- <el-form-item
          v-show="JSON.stringify(formList).indexOf('query') != -1"
          style="position: absolute; top: 0px; right: 10px"
        >
          <el-button
            size="mini"
            type="primary"
            class="screenBtn"
            :title="!formList.screenshow ? '展开' : '收起'"
            @click="formList.screenshow = !formList.screenshow"
          >
            {{ "更多操作" }}
            <i
              :title="!formList.screenshow ? '展开' : '收起'"
              :class="
                'iconfont ' +
                (!formList.screenshow ? 'icon-xiangxia' : 'icon-xiangshang')
              "
            ></i>
          </el-button>
        </el-form-item> -->
      </template>
    </el-form>
  </div>
</template>

<script>
 /**
* @description: 表单
* @module akeFormItem
* @example 
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

*/ 
export default {
  name:'akeFormItem',
  props: {
    formList: {
      type: Object,
      default: {
        prop: {},
        formData: {},
        formVisible: false,
        width: "800px",
      },
    },
  },
  data() {
    return {
      FormRules: {},
    };
  },
  activated() {
  
    for (let key in this.formList.prop) {
      let item = this.formList.prop[key];
      let message = item.validator
        ? ""
        : item.type == "input" || item.type == "textarea"
        ? `请填写${item.label}`
        : `请选择${item.label}`;
      this.FormRules[key] = [
        {
          required: item.required == undefined ? false : item.required,
          message,
          trigger: "change",
          validator: item.validator,
        },
      ];
    }
  },
  created() {
   
    for (let key in this.formList.prop) {
      let item = this.formList.prop[key];
      let message = item.validator
        ? ""
        : item.type == "input" || item.type == "textarea"
        ? `请填写${item.label}`
        : `请选择${item.label}`;
      this.FormRules[key] = [
        {
          required: item.required == undefined ? false : item.required,
          message,
          trigger: "change",
          validator: item.validator,
        },
      ];
    }
    // this.FormRules = { ...this.formList.slotRules, ...this.FormRules }
    // console.log(this.FormRules);
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  },
  watch: {
    "formList.prop": {
      deep: true,
      handler: function (newVal, oldVal) {
        this.FormRules = {};
        for (let key in newVal) {
          let item = newVal[key];
          let message = item.validator
            ? ""
            : item.type == "input" || item.type == "textarea"
            ? `请填写${item.label}`
            : `请选择${item.label}`;
          this.FormRules[key] = [
            {
              required: item.required == undefined ? false : item.required,
              message,
              trigger: "change",
              validator: item.validator,
            },
          ];
        }
      },
    },
  },
  mounted() {},
  methods: {
    change(val, key) {
      // val - > select选中value值
      // key - > 当前绑定对象中的key  可根据返回key判断点击的formItem
      this.$emit("change", val, key);
    },
    // 校验
      /** 
    * @event justify - 表单校验
    */ 
    async justify() {
      try {
        return await this.$refs["FormRules"].validate();
      } catch (err) {
        return false;
      }
    },
    // 表单重置

    /** 
    * @event resetFields - 表单重置
    */ 
    resetFields() {
      this.$refs["FormRules"].resetFields();
      this.$refs["FormRules"].clearValidate();
    },
    // button
    query() {
      this.$emit("query");
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