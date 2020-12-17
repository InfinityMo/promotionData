<template>
  <div class="page">
    <div class="main-wrap">
      <Header-Top />
      <div class="main-content">
        <div class="search-wrap">
          <el-form :model="searchForm"
                   id="form"
                   ref="searchForm"
                   label-width="70px">
            <el-row class="row ">
              <el-col :span="8">
                <el-form-item label="时间类型："
                              prop="timeType">
                  <el-select placeholder="请选择时间类型"
                             popper-class="reset-select"
                             @change="timeTypeChange"
                             v-model="searchForm.timeType">
                    <el-option v-for="item in timeTypeArr"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <div class="flex-center">
                  <el-form-item label="精确月份："
                                prop="month"
                                v-show="searchForm.timeType===3">
                    <el-date-picker v-model="searchForm.month"
                                    value-format="yyyy-MM"
                                    format="yyyy-MM"
                                    type="month"
                                    placeholder="请选择选择月份">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="日期区间："
                                class="time-range"
                                v-show="searchForm.timeType!==3">
                    <el-date-picker v-model="timeSection"
                                    :disabled="timeDisabled"
                                    value-format="yyyy-MM-dd"
                                    format="yyyy-MM-dd"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    range-separator="~"
                                    :picker-options="pickerOptions"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="flex-end">
                  <el-form-item label="店铺选择："
                                prop="shop">
                    <el-select placeholder="请选择店铺"
                               v-model="searchForm.shop">
                      <el-option v-for="item in shopArr"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row class="row ">
              <el-col :span="8">
                <el-form-item label="推广工具："
                              prop="extend">
                  <el-cascader v-model="searchForm.extend"
                               :options="extendOptions"
                               :props="{ multiple: true }"
                               collapse-tags
                               clearable>
                  </el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item class="search-btn">
                  <el-button @click="resetForm('searchForm')">重置</el-button>
                  <el-button type="primary"
                             @click="searchHandle">查询</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="table-wrap"
             ref="table">
          <div class="flex-between-center table-info">
            <div class="flex-item-center">
              <!-- 表格标题 -->
              <h4>列表</h4>
              <p class="select-tip"
                 v-show="timeTypeSelect!==''||shopSelect!==''">（<span>{{timeTypeSelect}}</span><em v-show="timeTypeSelect!==''&&shopSelect!==''">，</em><span>{{shopSelect}}</span>）</p>
            </div>
            <!-- 右侧功能 -->
            <div class="btn-gather">
              <el-link type="primary"
                       class="down-btn flex-item-center"
                       :underline="false">
                <el-tooltip class="item"
                            effect="dark"
                            content="请使用表格模板导入数据"
                            placement="top">
                  <i class="down-template"></i>
                </el-tooltip>
                <span class="down-text">下载表格模板</span>
              </el-link>
              <el-button plain
                         class="import-btn"><i class="import-icon"></i>导入数据</el-button>
              <el-button type="primary"><i class="export-icon"></i>下载报表</el-button>
            </div>
          </div>
          <!-- table -->
          <Table />
        </div>
      </div>
    </div>

    <el-backtop target=".main-content"></el-backtop>
  </div>
</template>
<script>
import tableMixin from '@/mixins/dealTable'
import HeaderTop from '@/components/header'
import { scrollTo } from '@/common/utils/funcStore'
import { timeTypeArr, shopArr, extendOptions } from './data'
import Table from './table'
export default {
  mixins: [tableMixin],
  components: { HeaderTop, Table },
  data () {
    return {
      searchForm: {
        timeType: '',
        month: '', // 日期
        shop: '',
        extend: ''
      },
      timeSection: [], // 时间范围
      timeTypeArr: timeTypeArr,
      shopArr: shopArr,
      extendOptions: extendOptions
    }
  },
  watch: {

  },
  async created () {

  },
  mounted () {

  },
  methods: {
    searchHandle () {
      if (this.searchForm.month) {
        this.fromatMonth()
      }
      scrollTo(135)
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/common/styles/page-table";
@import "./index";
</style>
