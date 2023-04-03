<template>
  <div class="akeTableParent" @click="divCkick($event)">
    <div class="tableColum" @click="cardShow = false">
      <slot name="header" />
      <!-- <i @click="cardShow = !cardShow" class="el-icon-more"></i> -->
      <i
        v-if="sortShow"
        class="iconfont iconshaixuan1 tableICON"
        @click.stop="cardShow = !cardShow"
      />
    </div>
    <el-card v-show="cardShow" ref="tableCard" class="box-card">
      <!-- <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>-->
      <div v-for="(tr, index1) in tableList.tr" :key="index1" class="text item">
        <el-checkbox
          v-if="tr.label != ''"
          v-model="tr.isShow"
          @change="changecheckbox1(index1)"
        >
          {{ tr.label }}
        </el-checkbox>
        <div class="level-td">
          <div v-for="(td, index) in tr.td" :key="index">
            <el-checkbox v-model="td.isShow" @change="changecheckbox(index1)">
              {{ td.label }}
            </el-checkbox>
            <i
              v-show="index > 0"
              class="iconfont iconfanhui-copy-copy tableICON"
              @click="TableColumnUp(index1, index)"
            />
            <i
              v-show="tableList.tr[index1].td.length - 1 > index"
              class="iconfont iconfanhui-copy-copy-copy tableICON"
              @click="TableColumnDown(index1, index)"
            />
          </div>
        </div>
      </div>
    </el-card>

    <el-table
      ref="multipleTable"
      stripe
      border
      @row-dblclick="DblclckRow"
      :data="tableList.tableData"
      :span-method="objectSpanMethod"
      style="width: 100%"
      :height="tableHeight"
      @current-change="clickRow"
      @header-dragend="dragend"
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
        align="center"
        :selectable="checkboxT"
        fixed="left"
        type="selection"
        width="50"
      />
      <el-table-column
        v-if="needIndex && tableList.tr.length != 0"
        type="index"
        align="center"
        width="49"
        :index="indexMethod"
        label="序号"
      />
      <template v-for="(tableColumn, index) in tableList.tr">
        <!-- 判断是否显示 -->
        <template v-if="tableColumn.label != ''">
          <el-table-column
            v-if="tableColumn.isShow"
            :key="index"
            v-bind="tableColumn"
            align="center"
          >
            <template v-for="(tablerow, index1) in tableColumn.td">
              <!-- 如果是input类型 -->
              <el-table-column
                v-if="tablerow.isShow && tablerow.type"
                :key="index1 + 999"
                v-bind="tablerow"
                align="center"
              >
                <template slot-scope="scope">
                  <template
                    v-if="tablerow.type === 'input' && scope.row.name != '小计'"
                  >
                    <el-input
                      v-model="scope.row[tablerow.prop]"
                      :disabled="scope.row.disabled"
                      type="text"
                    />
                  </template>
                  <template
                    v-else-if="
                      tablerow.type === 'select' && scope.row.name != '小计'
                    "
                  >
                    <el-select
                      v-model="scope.row[tablerow.prop]"
                      multiple
                      placeholder="请选择"
                      @change="
                        changeselect(scope.row.planId, scope.row[tablerow.prop])
                      "
                    >
                      <el-option
                        v-for="(item, index2) in scope.row[tablerow.select]"
                        :key="index2 + 555"
                        :label="item[tablerow.selectName]"
                        :value="item[tablerow.selectValue]"
                      />
                    </el-select>
                  </template>
                </template>
              </el-table-column>
              <el-table-column
                v-else-if="tablerow.isShow"
                :show-overflow-tooltip="true"
                :key="index1 + 999"
                v-bind="tablerow"
                align="center"
                :render-header="brheader"
              />
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <template v-for="tablerow in tableColumn.td">
            <!-- 如果是input类型 -->
            <el-table-column
              v-if="tablerow.isShow && tablerow.type"
              v-bind="tablerow"
              align="center"
            >
              <template slot-scope="scope">
                <template
                  v-if="tablerow.type === 'input' && scope.row.name != '小计'"
                >
                  <el-input v-model="scope.row[tablerow.prop]" type="text" />
                </template>
                <template
                  v-else-if="
                    tablerow.type === 'select' && scope.row.name != '小计'
                  "
                >
                  <el-select
                    v-model="scope.row[tablerow.prop]"
                    multiple
                    placeholder="请选择"
                    @change="
                      changeselect(scope.row.planId, scope.row[tablerow.prop])
                    "
                  >
                    <el-option
                      v-for="(item, index4) in scope.row[tablerow.select]"
                      :key="index4"
                      :label="item[tablerow.selectName]"
                      :value="item[tablerow.selectValue]"
                    />
                  </el-select>
                </template>
              </template>
            </el-table-column>
            <!-- 如果是要有多个值一起显示 -->
            <el-table-column
              :key="index"
              align="center"
              v-bind="tablerow"
              min-width="120px"
              v-else-if="tablerow.isShow && tablerow.prop.indexOf('~') >= 0"
            >
              <template slot-scope="scope">
                {{ scope.row[tablerow.prop.split("~")[0]] }}
                <span style="color: #cfa1a1">
                  <br v-if="tablerow.prop.split('~').length >= 2" />
                  {{ scope.row[tablerow.prop.split("~")[1]] }}
                </span>
                <br v-if="tablerow.prop.split('~').length >= 3" />
                {{ scope.row[tablerow.prop.split("~")[2]] }}
                <br v-if="tablerow.prop.split('~').length >= 4" />
                {{ scope.row[tablerow.prop.split("~")[3]] }}
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="tablerow.isShow"
              :show-overflow-tooltip="true"
              v-bind="tablerow"
              align="center"
              :render-header="brheader"
            />
          </template>
        </template>
      </template>
      <slot name="operating" />
    </el-table>
    <div v-if="paginaShow" class="block">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[30, 50, 100, 200]"
        :page-size="30"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
  /**
* @description: akeTable3-special
* @module akeTable3-special
* @example   
    showsummary: {
      type: Boolean,
      default: true,
    },
    // table的数据
    tableList: {
      tableData: {
        type: Array,
        default: [],
      },
      tr: {
        type: Array,
        default: [],
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
    //是否需要index
    needIndex: {
      type: Boolean,
      default: false,
    },
    // 页数
    currentPage: {
      type: Number,
      default: 1,
    },
    //一页多少条
    currentSize: {
      type: Number,
    },
    // 设置table高度
    height: {
      default: "",
    },
    // 是否有checkbox
    checkbox: {
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
    //默认第一列合并
    firstname: {
      type: Boolean,
      default: false,
    },
    merge: {
      type: Boolean,
      default: true,
    },
*/ 
export default {
  name:"akeTable3-special",
  directives: {
    focus: {
      // 指令的定义
      inserted: function (el) {
        // el.focus();
      },
    },
  },
  props: {
    showsummary: {
      type: Boolean,
      default: true,
    },
    // table的数据
    tableList: {
      tableData: {
        type: Array,
        default: [],
      },
      tr: {
        type: Array,
        default: [],
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
    //是否需要index
    needIndex: {
      type: Boolean,
      default: false,
    },
    // 页数
    currentPage: {
      type: Number,
      default: 1,
    },
    //一页多少条
    currentSize: {
      type: Number,
    },
    // 设置table高度
    height: {
      default: "",
    },
    // 是否有checkbox
    checkbox: {
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
    //默认第一列合并
    firstname: {
      type: Boolean,
      default: false,
    },
    merge: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      spanArr: [],
      spanArr1: [],
      cardShow: false,
      tableHeight: "",
      // iconUrl:require('./../../static/yuandian.png')
    };
  },
  watch: {
    // "tableList.tr": {
    //   deep: true,
    //   handler: function(newVal, oldVal) {
    //     // code
    //     let sessionTableItem = [];
    //     for (let i = 0; i < newVal.length; i++) {
    //       for (let b = 0; b < newVal[i].td.length; b++) {
    //         if (newVal[i].td[b].isShow) {
    //         sessionTableItem.push(newVal[i].td[b].index);
    //       } else {
    //         sessionTableItem.push("!" + newVal[i].td[b].index);
    //       }
    //       }
    //     }
    //     localStorage.setItem(this.sessionStroageName, sessionTableItem);
    //   }
    // },
    "tableList.tableData": {
      deep: true,
      handler: function (newVal, oldVal) {
        this.getList();
      },
    },
    height(newVal) {
      this.tableHeight = newVal;
    },
  },
  beforeMount: function () {
    // 如果有传高度,那么使用传入高度
    // 如果没有传入,那么使用缓存高度
    if (this.height) {
      this.tableHeight = this.height;
    } else {
      this.tableHeight = this.paginaShow
        ? window.localStorage.getItem("height") - 330 + "px"
        : window.localStorage.getItem("height") - 190 + "px";
    }
  },
  created() {
    if (this.merge) {
      this.getTableOrder();
      this.getTablColumneWidth();
    }
    var that = this;
    document.onclick = function () {
      that.cardShow = false;
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 自定义index
    indexMethod(index) {
      if (this.paginaShow) {
        return (this.currentPage - 1) * this.currentSize + index + 1;
      } else {
        return index + 1;
      }
    },
    getList() {
      var arr = [];
      this.spanArr = [];
      this.spanArr1 = [];
      var tabletr = [...new Set(this.tableList.tr)];
      var tableData = [...new Set(this.tableList.tableData)];
      let contactDot = 0;
      for (let i = 0; i < tabletr[0].td.length; i++) {
        var label = { name: tabletr[0].td[i].label, value: [], num: 0 };
        this.spanArr1.push(label);
      }
      tableData.forEach((item, index) => {
        // item.index = index;
        if (index === 0) {
          this.spanArr.push(1);
          for (let i = 0; i < tabletr[0].td.length; i++) {
            this.spanArr1[i].value.push(1);
          }
        } else {
          // for (let i = 0; i < tabletr[0].td.length; i++) {
          //   if (tabletr[0].td[i].prop != undefined) {
          //     var value = tabletr[0].td[i].prop.split(".");
          //     if (
          //       value[1] != undefined &&
          //       item[value[0]][value[1] + "RegAddr"] ===
          //         tableData[index - 1][value[0]][value[1] + "RegAddr"] &&
          //       item[value[0]][value[1] + "RegAddr"] != undefined &&
          //       item[value[0]][value[1]] != "--"
          //     ) {
          //       this.spanArr1[i].value[this.spanArr1[i].num] += 1;
          //       this.spanArr1[i].value.push(0);
          //     }
          //   } else {
          //     this.spanArr1[i].value.push(1);
          //     this.spanArr1[i].num = index;
          //   }
          // }
          if (
            item["roomNameId"] === tableData[index - 1]["roomNameId"] ||
            item["roomNameId"] == null
          ) {
            this.spanArr[contactDot] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            contactDot = index;
          }
        }
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 && this.spanArr.length != 0 && this.firstname) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return { rowspan: _row, colspan: _col };
      }
      for (let i = 0; i < this.spanArr1.length; i++) {
        if (column.label === this.spanArr1[i].name) {
          if (this.spanArr1[i].value[rowIndex] != undefined) {
            const _row = this.spanArr1[i].value[rowIndex];
            const _col = _row > 0 ? 1 : 0;
            return { rowspan: _row, colspan: _col };
          }
        }
      }
    },
    brheader(h, { column, $index }) {
      // 表头换行
      let l = column.label.split("|")[0].length + 2;
      let f = 18; //每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
      column.minWidth = f * l; //字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度 //然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
      // return h('div',{class:'table-head',style:{width:'100%'}},[ column.label.split('|')[0]])
      if (column.label.split("|").length == 1) {
        return h("span", {}, [
          h(
            "span",
            { class: "table-head", style: { width: "100%" } },
            column.label.split("|")[0]
          ),
          h("span", {}, column.label.split("|")[1]),
        ]);
      } else {
        return h("span", {}, [
          h(
            "span",
            { class: "table-head", style: { width: "100%" } },
            column.label.split("|")[0]
          ),
          h("br"),
          h("span", {}, column.label.split("|")[1]),
        ]);
      }
    },
    divCkick(e) {
      e.stopPropagation();
    },
    // 列排序往下
    TableColumnDown(index1, index) {
      let temp = this.tableList.tr[index1].td[index];
      this.$set(
        this.tableList.tr[index1].td,
        index,
        this.tableList.tr[index1].td[index + 1]
      );
      this.$set(this.tableList.tr[index1].td, index + 1, temp);
    },
    // 列排序往上
    TableColumnUp(index1, index) {
      let temp = this.tableList.tr[index1].td[index];
      this.$set(
        this.tableList.tr[index1].td,
        index,
        this.tableList.tr[index1].td[index - 1]
      );
      this.$set(this.tableList.tr[index1].td, index - 1, temp);
    },

    // table宽度拖拽
    dragend(newWidth, oldWidth, column, event) {
      let prop = column.property;
      let tableItemWidth = [];
      for (let i = 0; i < this.tableList.tr.length; i++) {
        for (let b = 0; b < this.tableList.tr[i].td.length; b++) {
          if (this.tableList.tr[i].td[b].prop == prop) {
            this.tableList.tr[i].td[b].width = parseInt(newWidth);
          }
          tableItemWidth.push({
            prop: this.tableList.tr[i].td[b].prop,
            width: this.tableList.tr[i].td[b].width,
          });
        }
      }
      localStorage.setItem(
        this.sessionStroageName + "tableWidth",
        JSON.stringify(tableItemWidth)
      );
    },
    // 点击行触发的方法
    
    clickRow(row) {
      this.$emit("clickRow", row);
    },
    // 双击行触发的方法
    DblclckRow(row) {
      this.$emit("DblclckRow", row);
    },
    // 获取table排序/是否显示
    getTableOrder() {
      let sessionTableItem = localStorage.getItem(this.sessionStroageName);
      if (sessionTableItem) {
        sessionTableItem = sessionTableItem.split(",");
        if (sessionTableItem.length) {
          let sure = 0;
          let temp = [];
          let temp1 = [];
          let temp2 = [];
          for (let i = 0; i < sessionTableItem.length; i++) {
            if (sessionTableItem[i].indexOf("!") > -1) {
              var item = sessionTableItem[i].split("!")[1];
              for (let j = 0; j < this.tableList.tr.length; j++) {
                // if(j<2){
                for (let b = 0; b < this.tableList.tr[j].td.length; b++) {
                  if (item == this.tableList.tr[j].td[b].index) {
                    this.tableList.tr[j].td[b].isShow = false;
                    if (j == 0) {
                      temp.push(this.tableList.tr[j].td[b]);
                    } else if (j == 1) {
                      temp1.push(this.tableList.tr[j].td[b]);
                    } else if (j == 2) {
                      temp2.push(this.tableList.tr[j].td[b]);
                    }
                  }
                }
                // }
              }
            } else {
              for (let j = 0; j < this.tableList.tr.length; j++) {
                // if(j<2){
                for (let b = 0; b < this.tableList.tr[j].td.length; b++) {
                  if (sessionTableItem[i] == this.tableList.tr[j].td[b].index) {
                    this.tableList.tr[j].td[b].isShow = true;
                    if (j == 0) {
                      temp.push(this.tableList.tr[j].td[b]);
                    } else if (j == 1) {
                      temp1.push(this.tableList.tr[j].td[b]);
                    } else if (j == 2) {
                      temp2.push(this.tableList.tr[j].td[b]);
                    }
                  }
                }
              }
            }
          }
          this.tableList.tr[0].td = temp;
          if (this.tableList.tr[1] != undefined) {
            this.tableList.tr[1].td = temp1;
          }
          if (this.tableList.tr[2] != undefined) {
            this.tableList.tr[2].td = temp2;
          }
          for (let index = 0; index < this.tableList.tr.length; index++) {
            var str = 0;
            for (let j = 0; j < this.tableList.tr[index].td.length; j++) {
              if (this.tableList.tr[index].td[j].isShow) {
                str = str + 1;
              }
            }
            if (str == 0) {
              this.tableList.tr[index].isShow = false;
            }
          }
        }
      }
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
            if (j < 2) {
              for (let b = 0; b < this.tableList.tr[j].td.length; b++) {
                if (tablColumnList[i].prop == this.tableList.tr[j].td[b].prop) {
                  // 直接通过下标修改是不能触发视图修改的。
                  let itemTemp = this.tableList.tr[j].td[b];
                  itemTemp.width = tablColumnList[i].width;
                  this.$set(this.tableList.tr[j].td, b, itemTemp);
                }
              }
            }
          }
        }
      }
    },

    handleSizeChange(val) {
      this.$emit("handleSizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("handleCurrentChange", val);
    },
    // select勾选
    handleSelectionChange(val) {
      this.$emit("checkboxList", val);
    },
    // select勾选
    changeselect(planId, exchangeId) {
      this.$emit(
        "changeselect",
        planId,
        exchangeId == 0 || exchangeId.length > 0
          ? exchangeId.join(",")
          : exchangeId
      );
    },
    changecheckbox(num) {
      // code
      let sessionTableItem = [];
      for (let i = 0; i < this.tableList.tr.length; i++) {
        if (num == i) {
          this.tableList.tr[i].isShow = true;
        }
        for (let b = 0; b < this.tableList.tr[i].td.length; b++) {
          if (this.tableList.tr[i].td[b].isShow) {
            sessionTableItem.push(this.tableList.tr[i].td[b].index);
          } else {
            sessionTableItem.push("!" + this.tableList.tr[i].td[b].index);
          }
        }
      }
      var arr = this.tableList.tr;
      this.tableList.tr = [];
      setTimeout(() => {
        this.tableList.tr = arr;
      }, 5);
      localStorage.setItem(this.sessionStroageName, sessionTableItem);
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
    changecheckbox1(num) {
      // code
      let sessionTableItem = [];
      for (let i = 0; i < this.tableList.tr.length; i++) {
        if (i == num) {
          for (let b = 0; b < this.tableList.tr[i].td.length; b++) {
            if (this.tableList.tr[i].isShow) {
              this.tableList.tr[i].td[b].isShow = true;
              sessionTableItem.push(this.tableList.tr[i].td[b].index);
            } else {
              this.tableList.tr[i].td[b].isShow = false;
              sessionTableItem.push("!" + this.tableList.tr[i].td[b].index);
            }
          }
        } else {
          for (let b = 0; b < this.tableList.tr[i].td.length; b++) {
            if (this.tableList.tr[i].td[b].isShow) {
              sessionTableItem.push(this.tableList.tr[i].td[b].index);
            } else {
              sessionTableItem.push("!" + this.tableList.tr[i].td[b].index);
            }
          }
        }
      }
      var arr = this.tableList.tr;
      this.tableList.tr = [];
      setTimeout(() => {
        this.tableList.tr = arr;
      }, 5);
      this.tableHeight = this.height;
      localStorage.setItem(this.sessionStroageName, sessionTableItem);
    },
  },
};
</script>

<style scoped>
.akeTableParent {
  height: 100%;
  padding: 5px 13px 5px 5px;
  background: #fff;
  position: relative;
  left: 0px;
}
.el-card.box-card.is-always-shadow {
  right: 1em;
  position: absolute;
  z-index: 10000;
  height: auto;
  max-height: 90%;
  overflow: auto;
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
.level-td {
  margin-left: 20px;
}
.box-card {
  display: inline-block;
  /* width: 230px; */
}
.tableColum {
  text-align: right;
  margin: 1em 0 1.2em 0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.text.item .el-checkbox {
  margin-right: 5px !important;
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
<style lang="scss">
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

