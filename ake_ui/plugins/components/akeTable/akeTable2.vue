<template>
  <div class="akeTableParent" style="position: relative">
    <div class="tableColum" @click="cardShow = false">
      <slot name="header" class="tableHeader"></slot>
      <!-- <i @click="cardShow = !cardShow" class="el-icon-more"></i> -->

      <div class="header-right">
        <slot name="header-right"></slot>
        <el-tooltip class="item" effect="dark" content="排序" placement="top">
          <i
            class="iconfont iconshaixuan1 tableICON"
            @click.stop="cardShow = !cardShow"
            v-if="sortShow"
          ></i>
        </el-tooltip>
        <!-- <img
          src="../assets/yuandian1.jpg"
          style="width: 16px;"
          @click="cardShow = !cardShow"
          v-if="sortShow"
          alt
        />-->
      </div>
    </div>
    <el-card
      v-show="cardShow"
      class="box-card"
      ref="tableCard"
      @click="divClick($event)"
    >
      <div v-for="(tr, index) in tableList.tr" :key="index" class="text item">
        <div>
          <el-checkbox v-model="tr.isShow">{{ tr.label }}</el-checkbox>
          <i
            class="iconfont iconfanhui-copy-copy tableICON"
            v-show="index > 0"
            @click="TableColumnUp(index)"
          ></i>
          <i
            class="iconfont iconfanhui-copy-copy-copy tableICON"
            v-show="tableList.tr.length - 1 > index"
            @click="TableColumnDown(index)"
          ></i>
        </div>
      </div>
      <div
        v-if="sessionStroageSetting"
        style="
          border-top: 1px solid rgb(205, 206, 213);
          padding: 10px;
          text-align: center;
        "
      >
        <el-button
          type="primary"
          style="background: #3477fe; color: #363636"
          plain
          @click="sessionStroageConfirm"
          >确认</el-button
        >
        <el-button
          type="primary"
          style="background: rgb(245, 245, 245); color: #363636"
          plain
          @click="sessionStroageCancel"
          >返回</el-button
        >
      </div>
    </el-card>

    <el-table
      ref="multipleTable"
      highlight-current-row
      :row-key="treeKey"
      @current-change="clickRow"
      border
      stripe
      :default-expand-all="defaultExpandAll"
      :expand-row-keys="[1]"
      :data="tableList.tableData"
      @header-dragend="dragend"
      :height="tableHeight"
      @selection-change="handleSelectionChange"
    >
      <div slot="empty">
        <div>
          <div>
            <img
              style="width: 150px; height: 110px"
              src="@/assets/empty.png"
            />
            <span
              style="
                display: block;
                font-size: 22px;
                font-weight: 600;
                margin-top: -25px;
              "
              >暂无数据</span
            >
          </div>
        </div>
      </div>
      <el-table-column
        v-if="checkbox"
        :selectable="checkboxT"
        fixed="left"
        type="selection"
        width="50"
      ></el-table-column>
      <template v-for="(tableColumn, index) in tableList.tr">
        <!-- 如果是sex的话 自动转换 -->
        <el-table-column
          :key="index"
          v-bind="tableColumn"
          v-if="tableColumn.isShow && tableColumn.prop == 'sex'"
        >
          <template slot-scope="scope">{{
            scope.row.sex == 1 ? "男" : "女"
          }}</template>
        </el-table-column>
        <el-table-column
          :key="index"
          v-bind="tableColumn"
          v-else-if="tableColumn.isShow && tableColumn.prop == 'area_type'"
        >
          <template slot-scope="scope">{{
            scope.row.area_type == 1001
              ? "公司"
              : scope.row.area_type == 1002
              ? "热源"
              : scope.row.area_type == 1003
              ? "片区"
              : scope.row.area_type == 1004
              ? "换热站"
              : scope.row.area_type == 1005
              ? "社区"
              : scope.row.area_type == 1006
              ? "楼栋"
              : scope.row.area_type == 1007
              ? "热力入口"
              : "--"
          }}</template>
        </el-table-column>
        <!-- <table-tree-column :key="index" :treeKey="treeKey" v-bind="tableColumn" v-else-if="tableColumn.isShow && tableColumn.prop == 'name'"></table-tree-column> -->
        <!-- 判断是否显示 -->
        <el-table-column
          :key="index"
          v-bind="tableColumn"
          align="left"
          :show-overflow-tooltip="true"
          v-else-if="tableColumn.isShow && index == 0"
        >
          <template slot-scope="scope">
            <span
              v-if="
                scope.row.children == undefined ||
                scope.row.children.length == 0
              "
            >
              <!-- <i class="iconfont iconwenjian-copy"></i> -->
              {{ scope.row[tableColumn.prop] }}
            </span>
            <span v-else>
              <!-- <i class="Treeicon el-icon-folder-opened"></i> -->
              {{ scope.row[tableColumn.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          :key="index"
          v-bind="tableColumn"
          v-else-if="tableColumn.isShow"
        ></el-table-column>
      </template>
      <slot name="operating"></slot>
    </el-table>
    <div class="block" v-if="paginaShow">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[3, 50, 100, 200]"
        :page-size="30"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
// import { sysPageColumnUpdate } from "@/api/index.js";
// import TableTreeColumn from "@/views/Core/TableTreeColumn";
  /**
* @description: 
* @module akeTable2
* @param {*}
* @param {*}
* @param {*}
* @example  // treeId
    treeKey: {
      type: String,
      default: "id",
    },
    // table的数据
    tableList: {
      tableData: {
        type: "Array",
      },
      tr: {
        type: "Array",
      },
    },
    // 每个table的名字，用于存储table的排序和列宽度
    sessionStroageName: {
      type: String,
    },
    // 总条数
    total: {
      type: Number,
      default: 0,
    },
    // 页数
    currentPage: {
      type: Number,
      default: 1,
    },
    // 设置table高度
    height: {
      type: String,
      default: window.localStorage.getItem("height") - 230 + "px",
    },
    // 是否有checkbox
    checkbox: {
      type: Boolean,
      default: false,
    },
    // 判断树表是否默认打开
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    // 是否显示分页
    paginaShow: {
      type: Boolean,
      default: true,
    },
    sortShow: {
      type: Boolean,
      default: true,
    },
    //是否显示表头配置操作
    sessionStroageSetting: {
      type: Boolean,
      default: false,
    },
*/ 
export default {
  name:"akeTable2",
  props: {
    // treeId
    treeKey: {
      type: String,
      default: "id",
    },
    // table的数据
    tableList: {
      tableData: {
        type: "Array",
      },
      tr: {
        type: "Array",
      },
    },
    // 每个table的名字，用于存储table的排序和列宽度
    sessionStroageName: {
      type: String,
    },
    // 总条数
    total: {
      type: Number,
      default: 0,
    },
    // 页数
    currentPage: {
      type: Number,
      default: 1,
    },
    // 设置table高度
    height: {
      type: String,
      default: window.localStorage.getItem("height") - 230 + "px",
    },
    // 是否有checkbox
    checkbox: {
      type: Boolean,
      default: false,
    },
    // 判断树表是否默认打开
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    // 是否显示分页
    paginaShow: {
      type: Boolean,
      default: true,
    },
    sortShow: {
      type: Boolean,
      default: true,
    },
    //是否显示表头配置操作
    sessionStroageSetting: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    // TableTreeColumn
  },
  data() {
    return {
      cardShow: false,
      tableHeight: "",
    };
  },
  beforeMount: function () {
    // 如果有传高度,那么使用传入高度
    // 如果没有传入,那么使用缓存高度
    if (this.height) {
      this.tableHeight = this.height;
    } else {
      this.tableHeight = this.paginaShow
        ? window.localStorage.getItem("height") - 218 + "px"
        : window.localStorage.getItem("height") - 180 + "px";
    }
  },
  methods: {
    // 表头缓存确认按钮
    sessionStroageConfirm() {
      let params = {
        tableKey: this.sessionStroageName,
        tableValue: localStorage.getItem(this.sessionStroageName),
      };
      // sysPageColumnUpdate(params).then((res) => {
      //   if (res.code === 200) {
      //     this.$baseMessage(res.msg, "success");
      //     this.cardShow = false;
      //   } else {
      //     this.$baseMessage(res.msg, "error");
      //   }
      // });
    },
    // 表头缓存收起按钮
    sessionStroageCancel() {
      this.cardShow = false;
    },
    // 列排序往下
    TableColumnDown(index) {
      let temp = this.tableList.tr[index];
      this.$set(this.tableList.tr, index, this.tableList.tr[index + 1]);
      this.$set(this.tableList.tr, index + 1, temp);
    },
    // 列排序往上
    TableColumnUp(index) {
      let temp = this.tableList.tr[index];
      this.$set(this.tableList.tr, index, this.tableList.tr[index - 1]);
      this.$set(this.tableList.tr, index - 1, temp);
    },

    // table宽度拖拽
    dragend(newWidth, oldWidth, column, event) {
      let prop = column.property;
      let tableItemWidth = [];
      for (let i = 0; i < this.tableList.tr.length; i++) {
        if (this.tableList.tr[i].prop == prop) {
          this.tableList.tr[i].width = parseInt(newWidth);
        }
        tableItemWidth.push({
          prop: this.tableList.tr[i].prop,
          width: this.tableList.tr[i].width,
        });
      }
      localStorage.setItem(
        this.sessionStroageName + "tableWidth",
        JSON.stringify(tableItemWidth)
      );
      setTimeout(() => {
        this.$refs.multipleTable.doLayout();
      }, 100);
    },

    // 获取table排序/是否显示
    getTableOrder() {
      let localTableItem = localStorage.getItem(this.sessionStroageName);
      if (localTableItem) {
        localTableItem = localTableItem.split(",");
        if (localTableItem.length) {
          let temp = [];
          for (let i = 0; i < localTableItem.length; i++) {
            if (localTableItem[i].indexOf("!") > -1) {
              var item = localTableItem[i].split("!")[1];
              for (let j = 0; j < this.tableList.tr.length; j++) {
                if (item == this.tableList.tr[j].index) {
                  this.tableList.tr[j].isShow = false;
                  temp.push(this.tableList.tr[j]);
                }
              }
            } else {
              for (let j = 0; j < this.tableList.tr.length; j++) {
                if (localTableItem[i] == this.tableList.tr[j].index) {
                  this.tableList.tr[j].isShow = true;
                  temp.push(this.tableList.tr[j]);
                }
              }
            }
          }
          this.tableList.tr = temp;
        }
      }
    },
    divClick(e) {
      e.stopPropagation();
    },
    // 获取table宽度
    getTablColumneWidth() {
      let tablColumnList = localStorage.getItem(
        this.sessionStroageName + "tableWidth"
      );
      // 如果有这个缓存,说明修改过，就通过遍历的方法将width的值重新写到tr的width，达到修改列宽度的效果。
      if (tablColumnList) {
        tablColumnList = JSON.parse(tablColumnList);

        for (let i = 0; i < tablColumnList.length; i++) {
          for (let j = 0; j < this.tableList.tr.length; j++) {
            if (tablColumnList[i].prop == this.tableList.tr[j].prop) {
              // 直接通过下标修改是不能触发视图修改的。
              let itemTemp = this.tableList.tr[j];
              itemTemp.width = tablColumnList[i].width;
              this.$set(this.tableList.tr, j, itemTemp);
            }
          }
        }
      }
    },
    checkboxT(row, index) {
      if (row.checkeddisabled) {
        return false;
      }
      if (row.checked == 0 && index != 0) {
        return false;
      } else {
        return true;
      }
    },
      /** 
    * @event handleSizeChange - 每页显示条数改变时触发
    * @return {Number} - 返回当前页码显示条数
    
    */ 
    handleSizeChange(val) {
      this.$emit("handleSizeChange", val);
    },
      /** 
    * @event handleCurrentChange - 每页显示页数改变时触发
    * @return {Number} - 返回当前页数显示条数
    
    */ 
    handleCurrentChange(val) {
      this.$emit("handleCurrentChange", val);
    },
    // select勾选
     /** 
    * @event handleSelectionChange - 勾选时触发
    * @return {Object} - 返回当前勾选的数据
    
    */ 
    handleSelectionChange(val) {
      this.$emit("checkboxList", val);
    },
    // 点击行触发的方法
     /** 
    * @event clickRow - 点击行时触发
    * @return {Object} - 返回当前点击的数据
    
    */ 
    clickRow(row) {
      this.$emit("clickRow", row);
    },
  },

  created() {
    this.getTableOrder();
    this.getTablColumneWidth();
  },
  watch: {
    sessionStroageName() {
      this.getTableOrder();
    },
    "tableList.tr": {
      deep: true,
      handler: function (newVal, oldVal) {
        // code
        let localTableItem = [];
        for (let i = 0; i < newVal.length; i++) {
          if (newVal[i].isShow) {
            localTableItem.push(newVal[i].index);
          } else {
            localTableItem.push("!" + newVal[i].index);
          }
        }
        localStorage.setItem(this.sessionStroageName, localTableItem);
        setTimeout(() => {
          this.$refs.multipleTable.doLayout();
        }, 100);
      },
    },
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: function (el) {
        // el.focus();
      },
    },
  },
};
</script>

<style scoped>
.el-card.box-card.is-always-shadow {
  right: 1em;
  position: absolute;
  z-index: 10000;
  height: auto;
  max-height: 90%;
  overflow: auto;
}
.el-table th {
  text-align: left !important;
}
/* list:[
  {url:'index'
    child:[
      {
        url:child1,
        uapdate:1,
        select:1,
        delete:0
        children:[]
      },
      {

        uapdate:1,
        select:1,
        delete:0
      }
    ]
  },

] */

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 12px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  display: inline-block;
  /* width: 230px; */
}
.tableColum {
  text-align: right;
  margin: 0.5em 0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.text.item .el-checkbox {
  margin-right: 5px !important;
}

.akeTableParent {
  height: 100%;
  padding: 5px 13px 5px 5px;
  background: #fff;
  position: relative;
  left: 0px;
  transition: left 0.3s ease 0s, width 0.3s ease 0s;
}
.iconfont {
  vertical-align: sub;
  font-size: 20px;
}
.block {
  display: flex;
  margin-top: 0em;
  text-align: right;
  justify-content: flex-end;
}
</style>

<style>
.el-card__header {
  display: none;
}
</style>

<style lang="scss">
.header-right {
  display: flex;
  align-items: center;
  > * {
    margin-left: 0.5em;
  }
}
.el-tooltip__popper {
  background: black !important;
  color: white !important;
}
.popper__arrow {
  // border-color: black !important;
  // background: black !important;
  // color: black !important;
}
</style>