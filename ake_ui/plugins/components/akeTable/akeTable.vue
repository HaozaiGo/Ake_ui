
<template>
  <div class="akeTableParent" @click="divCkick($event)">
    <div class="tableColum" @click="cardShow = false">
      <slot name="header" class="tableHeader"></slot>
      <!-- <i @click="cardShow = !cardShow" class="el-icon-more"></i> -->

      <div class="header-right">
        <slot name="header-right"></slot>
        <el-tooltip class="item" effect="dark" content="排序" placement="top">
          <i class="iconfont iconshaixuan1 tableICON" @click.stop="cardShow = !cardShow" v-if="sortShow"></i>
        </el-tooltip>
      </div>
    </div>
    <el-card v-show="cardShow" class="box-card" ref="tableCard" style="overflow: auto"
      :style="{ height: OverallHeight - 100 + 'px' }">
    <!-- <div slot="header" class="clearfix">
          <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>-->
      <div v-for="(tr, index) in tableList.tr" :key="index" class="text item">
        <div>
          <el-checkbox v-model="tr.isShow">{{ tr.label }}</el-checkbox>
          <i class="iconfont iconfanhui-copy-copy tableICON" v-show="index > 0" @click="TableColumnUp(index)"></i>
          <i class="iconfont iconfanhui-copy-copy-copy tableICON" v-show="tableList.tr.length - 1 > index"
            @click="TableColumnDown(index)"></i>
        </div>
      </div>
      <div v-if="sessionStroageSetting" style="
                border-top: 1px solid rgb(205, 206, 213);
                padding: 10px;
                text-align: center;
              ">
        <el-button type="primary" style="background: #3477fe; color: #363636" plain
          @click="sessionStroageConfirm">确认</el-button>
        <el-button type="primary" style="background: rgb(245, 245, 245); color: #363636" plain
          @click="sessionStroageCancel">返回</el-button>
      </div>
    </el-card>
    <!--   @select="select" -->
    <el-table highlight-current-row ref="multipleTable" :data="tableList.tableData" @current-change="TableCurrentChange"
      :key="tableKey" :style="{ width: width }" border stripe v-loading="loading" @row-dblclick="DblclckRow"
      @header-dragend="dragend" :height="tableHeight" @selection-change="handleSelectionChange"
      @expand-change="expandChange" :show-summary="showSummary" @sort-change="sortChange">
      <slot name="expand"></slot>
      <div slot="empty">
        <div>
          <div v-if="!loading">
            <img style="width: 150px; height: 110px" src="@/assets/empty.png" />
            <span style="
                      display: block;
                      font-size: 22px;
                      font-weight: 600;
                      margin-top: -25px;
                    ">暂无数据</span>
          </div>
        </div>
      </div>
      <el-table-column v-if="needIndex" type="index" width="49" fixed="left" :index="indexMethod" :label="'序号'">
      </el-table-column>
      <el-table-column v-if="checkbox" align="center" :selectable="checkboxT" fixed="left" type="selection"
        width="50"></el-table-column>
      <template v-for="(tableColumn, index) in tableList.tr">
        <!-- 如果是input类型 -->
        <el-table-column :key="index" align="center" v-bind="tableColumn" v-if="tableColumn.isShow && tableColumn.type">
          <template slot-scope="scope">
            <template v-if="tableColumn.type === 'input'">
              <span v-if="scope.row.disabled">{{
                scope.row[tableColumn.prop]
              }}</span>
              <el-input v-else type="text" :disabled="scope.row.disabled" v-model="scope.row[tableColumn.prop]" @change="
                () => {
                  $emit('changeInput', scope.row[tableColumn.prop]);
                }
              "></el-input>
            </template>
            <template v-if="tableColumn.type === 'number'">
              <span v-if="scope.row.disabled">{{
                scope.row[tableColumn.prop]
              }}</span>
              <el-input v-else type="number" :disabled="scope.row.disabled" v-model="scope.row[tableColumn.prop]" @change="
                () => {
                  $emit('changeInput', scope.row[tableColumn.prop]);
                }
              "></el-input>
            </template>
            <template v-if="tableColumn.type === 'flagRad'">
              <div :style="{ color: scope.row.isRead ? 'red' : 'black' }">
                {{ scope.row[tableColumn.prop] }}
              </div>
            </template>
            <!-- 如果是Popover费用组成类型 -->
            <template v-if="tableColumn.type === 'popoverCostCompose'">
              <el-popover placement="bottom-end" width="400" trigger="hover">
                <div slot="reference">
                  <div>
                    <span v-if="!isEmpty(scope.row.priceDetailData.third)">水资源税：固定单价
                    <!-- {{
                    scope.row["priceDetailData"].third.priceMode &&
                    scope.row["priceDetailData"].third.priceMode == 2
                      ? "阶梯算法"
                        : "固定单价"
                      }} -->
                      {{ "(" }}{{ scope.row["priceDetailData"].third.price1
                      }}{{ "元)" }}</span>
                    <span v-if="!isEmpty(scope.row.priceDetailData.second)">污水费：固定单价
                    <!-- {{
                    scope.row["priceDetailData"].second.priceMode &&
                    scope.row["priceDetailData"].second.priceMode == 2
                      ? "阶梯算法"
                      : 
                        "固定单价"
                      }} -->
                      {{ "(" }}{{ scope.row["priceDetailData"].second.price1
                      }}{{ "元)" }}</span>
                  </div>
                  <div>
                    基本水费：
                    {{
                      scope.row["priceDetailData"].first.priceMode &&
                      scope.row["priceDetailData"].first.priceMode == 2
                      ? "阶梯算法"
                      : "固定单价"
                    }}{{ "("
}}{{
  scope.row["priceDetailData"].first.priceMode == 1 &&
  scope.row["priceDetailData"].first.price1 != "0"
  ? scope.row["priceDetailData"].first.price1 + "元"
  : scope.row["priceDetailData"].first.peopleRelevent == 1
    ? "与阶梯人口数关联"
    : "与阶梯人口数不关联"
}}{{ ")" }}
                  </div>
                </div>
                <div>
                  <div>
                    <span v-if="!isEmpty(scope.row.priceDetailData.third)" style="margin-right: 10px">水资源税：固定单价 {{ "("
                    }}{{ scope.row["priceDetailData"].third.price1
}}{{ "元)" }}</span>
                    <span v-if="!isEmpty(scope.row.priceDetailData.second)">污水费：固定单价 {{ "("
                    }}{{ scope.row["priceDetailData"].second.price1
}}{{ "元)" }}</span>
                  </div>
                  <div>
                    基本水费：
                    {{
                      scope.row["priceDetailData"].first.priceMode &&
                      scope.row["priceDetailData"].first.priceMode == 2
                      ? "阶梯算法"
                      : "固定单价"
                    }}{{ "("
}}{{
  scope.row["priceDetailData"].first.priceMode == 1 &&
  scope.row["priceDetailData"].first.price1 != "0"
  ? scope.row["priceDetailData"].first.price1 + "元"
  : scope.row["priceDetailData"].first.peopleRelevent == 1
    ? "与阶梯人口数关联"
    : "与阶梯人口数不关联"
}}{{ ")" }}
                  </div>
                  <div v-if="
                    scope.row.priceDetailData.first &&
                    scope.row.priceDetailData.first.priceMode == 2
                  ">
                    <div>
                      <span style="margin-right: 10px">阶梯起始时间：{{
                        scope.row.priceDetailData.first.grdStartDate
                      }}</span>
                      <span>阶梯周期：{{
                        scope.row.priceDetailData.first.grdPeriodLabel
                      }}</span>
                    </div>
                    <table border="0" cellspacing="0" width="300px">
                      <tr>
                        <td></td>
                        <td>用水上限（m³）</td>
                        <td>单价（元）</td>
                      </tr>
                      <tr>
                        <td>第一阶梯</td>
                        <td>{{ scope.row.priceDetailData.first.grdQty1 }}</td>
                        <td>{{ scope.row.priceDetailData.first.grdPrice1 }}</td>
                      </tr>
                      <tr>
                        <td>第二阶梯</td>
                        <td>{{ scope.row.priceDetailData.first.grdQty2 }}</td>
                        <td>{{ scope.row.priceDetailData.first.grdPrice2 }}</td>
                      </tr>
                      <tr>
                        <td>第三阶梯</td>
                        <td>{{ scope.row.priceDetailData.first.grdQty3 }}</td>
                        <td>{{ scope.row.priceDetailData.first.grdPrice3 }}</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </el-popover>
            </template>
            <!-- 如果是Popover审核状态类型 -->
            <template v-if="tableColumn.type === 'approvalStatusDictText'">
              <span v-if="scope.row.approvalStatusDictText != '审核不通过'">{{
                scope.row.approvalStatusDictText
              }}</span>
              <el-popover v-else placement="bottom-end" width="400" trigger="click">
                <div slot="reference">
                  <div>
                    <span style="color: red">
                      {{ scope.row.approvalStatusDictText }}</span><i class="el-icon-warning el-icon--right"
                      style="color: red; font-size: 16px"></i>
                  </div>
                </div>
                <div>
                  <div style="color: rgb(217, 0, 27)">审核不通过原因</div>
                  <div>{{ scope.row.remark }}</div>
                </div>
              </el-popover>
            </template>
            <template v-if="tableColumn.type === 'flagRad'">
              <div :style="{ color: scope.row.isRead ? 'red' : 'black' }">
                {{ scope.row[tableColumn.prop] }}
              </div>
            </template>
            <template v-if="tableColumn.type === 'avgNum'">
              {{
                ((scope.row.temp1 === "" ? 0 : parseInt(scope.row.temp1)) +
                  (scope.row.temp2 === "" ? 0 : parseInt(scope.row.temp2)) +
                  (scope.row.temp3 === "" ? 0 : parseInt(scope.row.temp3))) /
                (scope.row.temp1 !== "" &&
                  scope.row.temp2 !== "" &&
                  scope.row.temp3 !== ""
                  ? 3
                  : scope.row.temp1 !== "" &&
                    scope.row.temp2 !== "" &&
                    scope.row.temp3 === ""
                    ? 2
                    : scope.row.temp1 !== "" &&
                      scope.row.temp2 === "" &&
                      scope.row.temp3 !== ""
                      ? 2
                      : scope.row.temp1 === "" &&
                        scope.row.temp2 !== "" &&
                        scope.row.temp3 !== ""
                        ? 2
                        : scope.row.temp1 === "" &&
                          scope.row.temp2 === "" &&
                          scope.row.temp3 !== ""
                          ? 1
                          : scope.row.temp1 === "" &&
                            scope.row.temp2 !== "" &&
                            scope.row.temp3 === ""
                            ? 1
                            : scope.row.temp1 !== "" &&
                              scope.row.temp2 === "" &&
                              scope.row.temp3 === ""
                              ? 1
                              : 1)
                ? parseInt(
                  ((scope.row.temp1 === ""
                    ? 0
                    : parseInt(scope.row.temp1)) +
                    (scope.row.temp2 === ""
                      ? 0
                      : parseInt(scope.row.temp2)) +
                    (scope.row.temp3 === ""
                      ? 0
                      : parseInt(scope.row.temp3))) /
                  (scope.row.temp1 !== "" &&
                    scope.row.temp2 !== "" &&
                    scope.row.temp3 !== ""
                    ? 3
                    : scope.row.temp1 !== "" &&
                      scope.row.temp2 !== "" &&
                      scope.row.temp3 === ""
                      ? 2
                      : scope.row.temp1 !== "" &&
                        scope.row.temp2 === "" &&
                        scope.row.temp3 !== ""
                        ? 2
                        : scope.row.temp1 === "" &&
                          scope.row.temp2 !== "" &&
                          scope.row.temp3 !== ""
                          ? 2
                          : scope.row.temp1 === "" &&
                            scope.row.temp2 === "" &&
                            scope.row.temp3 !== ""
                            ? 1
                            : scope.row.temp1 === "" &&
                              scope.row.temp2 !== "" &&
                              scope.row.temp3 === ""
                              ? 1
                              : scope.row.temp1 !== "" &&
                                scope.row.temp2 === "" &&
                                scope.row.temp3 === ""
                                ? 1
                                : 1)
                ).toFixed(1)
                : 0
              }}
            </template>
            <template v-if="tableColumn.type === 'column'">
              <div>
                {{
                  scope.row[tableColumn.prop.split(",")[0]]
                  ? scope.row[tableColumn.prop.split(",")[0]]
                  : "--"
                }}
              </div>
              <div>
                {{
                  scope.row[tableColumn.prop.split(",")[1]]
                  ? scope.row[tableColumn.prop.split(",")[1]]
                  : "--"
                }}
              </div>
            </template>
            <template v-if="tableColumn.type === 'unit'">
              {{ scope.row[tableColumn.prop.split(",")[0]] }}
              {{ scope.row[tableColumn.prop.split(",")[1]] }}
            </template>
            <template v-if="tableColumn.type === 'click'">
              <div style="color: #1b90ff; cursor: pointer" @click="
                clickTableBtn({ row: scope.row, label: tableColumn.label })
              ">
                {{ scope.row[tableColumn.prop.split(",")[0]] }}
              </div>
            </template>
            <template v-if="tableColumn.type === 'date'">
              <el-date-picker v-model="scope.row[tableColumn.prop]" type="datetime" placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 200px">
              </el-date-picker>
            </template>
            <template v-else-if="tableColumn.type === 'select'">
              <template v-if="sessionStroageName == 'six/Three2'">
                <template v-if="tableColumn.prop == 'unit'">
                  <!-- {{scope.row[tableColumn.assetTypeCode]}} -->
                  <el-select v-model="scope.row[tableColumn.prop]" placeholder="请选择"
                    :disabled="scope.row.assetTypeCode != '1034'">
                    <el-option v-for="item in tableColumn.select" :key="item[tableColumn.selectValue]"
                      :label="item[tableColumn.selectName]" :value="
                        /^\d+(\.\d+)?$/.test(item[tableColumn.selectValue])
                          ? Number(item[tableColumn.selectValue])
                          : item[tableColumn.selectValue]
                      "></el-option>
                  </el-select>
                </template>
                <template v-else>
                  <el-select v-model="scope.row[tableColumn.prop]" placeholder="请选择">
                    <el-option v-for="item in tableColumn.select" :key="item[tableColumn.selectValue]"
                      :label="item[tableColumn.selectName]" :value="
                        /^\d+(\.\d+)?$/.test(item[tableColumn.selectValue])
                          ? Number(item[tableColumn.selectValue])
                          : item[tableColumn.selectValue]
                      "></el-option>
                  </el-select>
                </template>
              </template>
              <template v-else>
                <el-select v-model="scope.row[tableColumn.prop]" placeholder="请选择">
                  <el-option v-for="item in tableColumn.select" :key="item[tableColumn.selectValue]"
                    :label="item[tableColumn.selectName]" :value="
                      /^\d+(\.\d+)?$/.test(item[tableColumn.selectValue])
                        ? Number(item[tableColumn.selectValue])
                        : item[tableColumn.selectValue]
                    "></el-option>
                </el-select>
              </template>
            </template>
          </template>
        </el-table-column>
        <!-- 如果是sex的话 自动转换 -->
        <el-table-column :key="index" align="center" v-bind="tableColumn"
          v-else-if="tableColumn.isShow && tableColumn.prop == 'sex'">
          <template slot-scope="scope">{{
            scope.row.sex == 1 ? "男" : "女"
          }}</template>
        </el-table-column>
        <!-- 如果是要有多个值一起显示 ~ -->
        <el-table-column :key="index" align="center" v-bind="tableColumn" :show-overflow-tooltip="true" min-width="120px"
          v-else-if="
            !tableColumn.Fixed &&
            tableColumn.isShow &&
            tableColumn.prop.indexOf('~') >= 0
          ">
          <template slot-scope="scope">
            {{ scope.row[tableColumn.prop.split("~")[0]] }}
            <span style="color: #363636">
              <br v-if="tableColumn.prop.split('~').length >= 2" />
              {{ scope.row[tableColumn.prop.split("~")[1]] }}
            </span>
            <br v-if="tableColumn.prop.split('~').length >= 3" />
            {{ scope.row[tableColumn.prop.split("~")[2]] }}
            <br v-if="tableColumn.prop.split('~').length >= 4" />
            {{ scope.row[tableColumn.prop.split("~")[3]] }}
          </template>
        </el-table-column>
        <el-table-column :key="index" align="center" v-bind="tableColumn" min-width="120px"
          v-else-if="tableColumn.isShow && tableColumn.prop.indexOf(',') >= 0">
          <template slot-scope="scope">
            {{
              scope.row[tableColumn.prop.split(",")[0]]
              ? scope.row[tableColumn.prop.split(",")[0]]
              : ""
            }}&nbsp;/&nbsp;{{
  scope.row[tableColumn.prop.split(",")[1]]
  ? scope.row[tableColumn.prop.split(",")[1]]
  : ""
}}&nbsp;/&nbsp;{{
  scope.row[tableColumn.prop.split(",")[2]]
  ? scope.row[tableColumn.prop.split(",")[2]]
  : ""
}}&nbsp;/&nbsp;{{
  scope.row[tableColumn.prop.split(",")[3]]
  ? scope.row[tableColumn.prop.split(",")[3]]
  : ""
}}
          </template>
        </el-table-column>
        <!-- 如果是要有多个值一起显示 - -->
        <el-table-column :key="index" align="center" v-bind="tableColumn" min-width="120px"
          v-else-if="tableColumn.isShow && tableColumn.prop.indexOf('-') >= 0">
          <template slot-scope="scope">
            {{ scope.row[tableColumn.prop.split("-")[0]] }}&nbsp;-&nbsp;{{
              scope.row[tableColumn.prop.split("-")[1]]
            }}
          </template>
        </el-table-column>
        <!-- 如果是要有多个值一起显示 & -->
        <el-table-column :key="index" align="center" v-bind="tableColumn" min-width="120px"
          v-else-if="tableColumn.isShow && tableColumn.prop.indexOf('&') >= 0">
          <template slot-scope="scope">
            <div style="text-algin: center">
              {{
                scope.row[tableColumn.prop.split("&")[0]]
                ? scope.row[tableColumn.prop.split("&")[0]]
                : "--"
              }}
            </div>
            <div style="text-algin: center">
              {{
                scope.row[tableColumn.prop.split("&")[1]]
                ? scope.row[tableColumn.prop.split("&")[1]]
                : "--"
              }}
            </div>
          </template>
        </el-table-column>
        <!-- 如果是要有多个值一起显示 ( -->
        <el-table-column :key="index" align="center" v-bind="tableColumn" min-width="120px"
          v-else-if="tableColumn.prop.indexOf('(') >= 0">
          <template slot-scope="scope">
            <div style="text-algin: center">
              {{
                scope.row[tableColumn.prop.split("(")[0]]
                ? scope.row[tableColumn.prop.split("(")[0]]
                : "--"
              }}
              (
              <span :style="{
                color:
                  scope.row[tableColumn.prop.split('(')[0] + 'Color'] ==
                    'black'
                    ? '#000'
                    : scope.row[tableColumn.prop.split('(')[0] + 'Color'] ==
                      'red'
                      ? '#f56c6c!important'
                      : scope.row[tableColumn.prop.split('(')[0] + 'Color'] ==
                        '#f56c6c'
                        ? '#f56c6c!important'
                        : scope.row[tableColumn.prop.split('(')[0] + 'Color'] ==
                          'green'
                          ? '#32C5FF!important'
                          : scope.row[tableColumn.prop.split('(')[0] + 'Color'] ==
                            '#32C5FF'
                            ? '#32C5FF!important'
                            : scope.row[tableColumn.prop.split('(')[0] + 'Color'] ==
                              'orange'
                              ? 'orange'
                              : '#000',
              }">
                {{ scope.row[tableColumn.prop.split("(")[1]] }}</span>
              )
            </div>
          </template>
        </el-table-column>
        <!-- 判断是否显示 -->
        <el-table-column :key="index" align="left" v-bind="tableColumn"
          v-else-if="tableColumn.readingStatus && tableColumn.isShow" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div style="text-algin: center">
              <div class="overTime flex">
                <span :style="{
                  color:
                    scope.row[tableColumn.prop + 'Color'] == 'black'
                      ? '#000'
                      : scope.row[tableColumn.prop + 'Color'] == 'red'
                        ? '#f56c6c!important'
                        : scope.row[tableColumn.prop + 'Color'] == 'blue'
                          ? '#0c9bf0!important'
                          : scope.row[tableColumn.prop + 'Color'] == 'green'
                            ? '#22ec25!important'
                            : scope.row[tableColumn.prop + 'Color'] == 'purple'
                              ? '#6A5ACD'
                              : scope.row[tableColumn.prop + 'Color'] == 'gray'
                                ? '#c1c1c1'
                                : '#363636 ',
                }">{{ scope.row[tableColumn.prop] }}</span>

                <!-- <i class="el-icon-time" style="mragin-right:10px"></i>  -->
                <span v-if="scope.row[tableColumn.status] == '2'" style="height: 18px; margin-left: 8px">
                  <el-tooltip class="item" effect="dark" :content="scope.row[tableColumn.remark]" placement="bottom">
                    <img :src="img" alt="" srcset="" style="width: 18px; height: 18px" />
                  </el-tooltip>
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :key="index" align="left" v-bind="tableColumn" v-else-if="tableColumn.isShow"
          :show-overflow-tooltip="true" :fixed="tableColumn.Fixed == undefined ? false : tableColumn.Fixed"
          :scoped-slot="brheader">
          <!-- 如果是要有多个值一起显示 -->
          <template slot-scope="scope">
            <div :style="{
              color:
                scope.row[tableColumn.prop + 'Color'] == 'black'
                  ? '#c1c1c1'
                  : scope.row[tableColumn.prop + 'Color'] == 'red'
                    ? '#f56c6c!important'
                    : scope.row[tableColumn.prop + 'Color'] == '#f56c6c'
                      ? '#f56c6c!important'
                      : scope.row[tableColumn.prop + 'Color'] == 'green'
                        ? '#32C5FF!important'
                        : scope.row[tableColumn.prop + 'Color'] == '#32C5FF'
                          ? '#32C5FF!important'
                          : scope.row[tableColumn.prop + 'Color'] == 'orange'
                            ? 'orange'
                            : '#c1c1c1',
            }">
              <span :class="[tableColumn.clickFlag ? 'cell-click' : '']" size="mini"
                @click="cellClick(tableColumn.clickFlag, scope)">
                {{ scope.row[tableColumn.prop.split("~")[0]] }}
              </span>
              <span>
                <br v-if="tableColumn.prop.split('~').length >= 2" />
                {{ scope.row[tableColumn.prop.split("~")[1]] }}
              </span>
              <br v-if="tableColumn.prop.split('~').length >= 3" />
              {{ scope.row[tableColumn.prop.split("~")[2]] }}
              <br v-if="tableColumn.prop.split('~').length >= 4" />
              {{ scope.row[tableColumn.prop.split("~")[3]] }}
              <!-- {{ scope.row[tableColumn.prop] }} -->
            </div>
          </template>
        </el-table-column>
        <!-- 判断是否显示 -->

      <!-- <el-table-column
            :key="index"
            align="center"
            v-bind="tableColumn"
            v-else-if="tableColumn.isShow"
            :fixed="tableColumn.Fixed == undefined ? false : tableColumn.Fixed"
              :render-header="brheader"
              ></el-table-column>-->
      </template>
      <slot name="operating"></slot>
    </el-table>
    <div class="block" v-if="paginaShow">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="[30, 50, 100, 200, 500]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isEmpty } from "lodash";
// import { sysPageColumnUpdate } from "@/api/index.js";

import variables from "@/styles/variables.scss";
/**
  * AKETable.
  * @module AKETable
  * @see module:AKETable
  * @example 
  * tableList: {
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
    // 页数
    currentPage: {
      type: Number,
      default: 1,
    },
    // 每页条数
    currentSize: {
      type: Number,
    },
    // 分页条数
    pageSize: {
      type: Number,
      default: 30,
    },
    //是否需要index
    needIndex: {
      type: Boolean,
      default: false,
    },
    // 设置table高度
    height: {
      default: "",
    },
    // 设置table宽度
    width: {
      default: "100%",
    },
    // 是否有checkbox
    checkbox: {
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
    lazy: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    //是否显示表头配置操作
    sessionStroageSetting: {
      type: Boolean,
      default: false,
    },
    // 合计
    showSummary: {
      type: Boolean,
      default: false,
    },
  * 
*/

export default {
  name: 'akeTable',
  props: {

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
    // 页数
    currentPage: {
      type: Number,
      default: 1,
    },
    // 每页条数
    currentSize: {
      type: Number,
    },
    // 分页条数
    pageSize: {
      type: Number,
      default: 30,
    },
    //是否需要index
    needIndex: {
      type: Boolean,
      default: false,
    },
    // 设置table高度
    height: {
      default: "",
    },
    // 设置table宽度
    width: {
      default: "100%",
    },
    // 是否有checkbox
    checkbox: {
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
    lazy: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    //是否显示表头配置操作
    sessionStroageSetting: {
      type: Boolean,
      default: false,
    },
    // 合计
    showSummary: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tableKey: true,
      img: require("@/assets/sigh.png"),
      cardShow: false,
      tableHeight: "",
      // iconUrl:require('./../../static/yuandian.png')
    };
  },
  computed: {
    ...mapGetters({
      collapse: "settings/collapse",
      OverallHeight: "settings/OverallHeight",
    }),
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.multipleTable.doLayout();
    });
  },
  beforeMount: function () {
    // 如果有传高度,那么使用传入高度
    // 如果没有传入,那么使用缓存高度
    if (this.height) {
      this.tableHeight = this.height;
    } else {
      this.tableHeight = this.paginaShow
        ? this.OverallHeight + "px"
        : this.OverallHeight + 30 + "px";
    }
  },

  methods: {
    //排序
     /** 
    * @event sortChange - 排序
    */ 
    sortChange(column, key, order) {
      this.$emit("sortChange", column);
    },
    isEmpty(val) {
      return isEmpty(val);
    },
    // 单击单元格
     /** 
    * @event cellClick - 单击单元格
    * @return {Object} - 返回当前行的数据
    */ 
    cellClick(flag, scope) {
      if (flag) {
        this.$emit("cellClick", scope.row);
      }
    },
    setHeight() { },
    // 自定义index
    indexMethod(index) {
      if (this.paginaShow) {
        return (this.currentPage - 1) * this.currentSize + index + 1;
      } else {
        return index + 1;
      }
    },
    brheader(h, { column, $index }) {
      // 表头换行
      let l = column.label.split("|")[0].length + 2;
      let f = 16; //每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
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
    TableColumnDown(index) {
      let temp = this.tableList.tr[index];
      this.$set(this.tableList.tr, index, this.tableList.tr[index + 1]);
      this.$set(this.tableList.tr, index + 1, temp);
      this.tableKey = !this.tableKey;
    },
    // 列排序往上
    TableColumnUp(index) {
      let temp = this.tableList.tr[index];
      this.$set(this.tableList.tr, index, this.tableList.tr[index - 1]);
      this.$set(this.tableList.tr, index - 1, temp);
      this.tableKey = !this.tableKey;
    },
    select(selection, row) {
      this.$refs.multipleTable.clearSelection();
      if (selection.length == 0) return;
      this.$refs.multipleTable.toggleRowSelection(row, true);
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

    // 点击行触发的方法
       /** 
    * @event clickRow - 点击行触发的方法
    * @return {Object} - 返回当前行的数据
    */ 
    clickRow(row) {
      this.$emit("clickRow", row);
    },
    // 双击行触发的方法
      /** 
    * @event DblclckRow - 双击行触发的方法
    * @return {Object} - 返回当前行的数据
    */ 
    DblclckRow(row) {
      this.$emit("DblclckRow", row);
    },
    // 获取table排序/是否显示
    getTableOrder() {
      let sessionTableItem = localStorage.getItem(this.sessionStroageName);
      if (sessionTableItem) {
        // debugger;
        sessionTableItem = sessionTableItem.split(",");
        if (sessionTableItem.length) {
          let temp = [];
          if (sessionTableItem.length != this.tableList.tr.length) {
            sessionTableItem = this.tableList.tr.map((item) => {
              return item.index + "";
            });
          }
          for (let i = 0; i < sessionTableItem.length; i++) {
            if (sessionTableItem[i].indexOf("!") > -1) {
              var item = sessionTableItem[i].split("!")[1];
              for (let j = 0; j < this.tableList.tr.length; j++) {
                if (item == this.tableList.tr[j].index) {
                  this.tableList.tr[j].isShow = false;
                  temp.push(this.tableList.tr[j]);
                }
              }
            } else {
              for (let j = 0; j < this.tableList.tr.length; j++) {
                if (sessionTableItem[i] == this.tableList.tr[j].index) {
                  this.tableList.tr[j].isShow = true;
                  temp.push(this.tableList.tr[j]);
                }
              }
            }
          }
          this.tableList.tr = temp;
          this.tableHeight = this.height;
        }
      }
    },
    // 获取表头显示的列
    getTableColumnOrder() {
      let newArr = this.tableList.tr
        .filter((item) => {
          return item.isShow;
        })
        .map((item) => {
          return item.prop;
        });
      return newArr;
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
     /** 
    * @event handleSizeChange - 每页显示条数改变时触发
    * @return {Number} - 返回当前页码显示条数
    
    */ 
    handleSizeChange(val) {
      this.$refs.multipleTable.clearSelection();
      this.$emit("handleSizeChange", val);
    },

    /** 
    * @event handleCurrentChange - 每页显示页数改变时触发
    * @return {Number} - 返回当前页数显示条数
    
    */ 
    handleCurrentChange(val) {
      this.$refs.multipleTable.clearSelection();
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
    expandChange(val, expandedRows) {
      // debugger;
      if (expandedRows.length > 1) {
        this.$refs.multipleTable.toggleRowExpansion(expandedRows[0]);
        expandedRows.shift();
      }
      this.$emit("expandChange", val);
    },
    clickTableBtn(val) {
      this.$emit("clickTableBtn", val);
    },
    TableCurrentChange(val) {
      this.$emit("TableCurrentChange", val);
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
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
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
  },

  created() {
    this.getTableOrder();
    this.getTablColumneWidth();
    var that = this;
    document.onclick = function () {
      that.cardShow = false;
    };
  },
  mounted() {
    // 解决滚动条到最下面错位问题
    this.srcoll = this.$refs.multipleTable.bodyWrapper;

    this.srcoll.addEventListener("scroll", () => {
      // 距离顶部的距离
      let scrollTop = this.srcoll.scrollTop;
      // windowHeight是可视区的高度
      const windowHeight = this.srcoll.clientHeight;
      // 变量scrollHeight是滚动条的总高度
      let scrollHeight = this.srcoll.scrollHeight;
      // console.log(scrollTop,windowHeight,scrollHeight);

      if (scrollTop + windowHeight === scrollHeight) {
        this.$refs.multipleTable.doLayout();
      }
    });
  },
  watch: {
    sessionStroageName() {
      this.getTableOrder();
    },
    "tableList.tr": {
      deep: true,
      handler: function (newVal, oldVal) {
        // code
        let sessionTableItem = [];
        for (let i = 0; i < newVal.length; i++) {
          if (newVal[i].isShow) {
            sessionTableItem.push(newVal[i].index);
          } else {
            sessionTableItem.push("!" + newVal[i].index);
          }
        }
        localStorage.setItem(this.sessionStroageName, sessionTableItem);
      },
    },
    height(newVal) {
      this.tableHeight = newVal;
    },
    srcoll(val) {
      console.log(val);
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

<style scoped lang='scss'>
.header-right {
  display: flex;
  align-items: center;

  >* {
    margin-left: 0.5em;
  }
}

.el-card.box-card.is-always-shadow {
  right: 1em;
  position: absolute;
  z-index: 10000;
  // height: 80%;
  // max-height: 80%;
  overflow: auto;
}

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
}

.tableColum {
  text-align: left;
  margin: 0.5em 0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 30px;
  background: #fff0;
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
}

.iconfont {
  vertical-align: sub;
  font-size: 20px !important;
  z-index: 1;
}

.block {
  display: flex;
  margin-top: 0em;
  text-align: right;
  justify-content: flex-end;
}

.cell-click {
  color: #0091ff !important;
  cursor: pointer;
  border-bottom: 1px solid #0091ff;
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

.cell.el-tooltip {
  width: 100% !important;
}

.tableICON {
  z-index: 1;
}
</style>