<template>
  <div class="page">
    <Header-Top />
    <div class="main-content">
      <div class="search-wrap">
        <el-form :model="searchForm"
                 id="form"
                 label-width="70px"
                 ref="searchForm">
          <el-row class="row ">
            <el-col :span="8">
              <el-form-item label="时间类型：">
                <el-select placeholder="请选择时间类型"
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
              <el-form-item label="精确月份："
                            v-show="searchForm.timeType===3">
                <el-date-picker v-model="searchForm.month"
                                value-format="yyyy-MM"
                                format="yyyy-MM"
                                type="month"
                                placeholder="请选择选择月份">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="日期区间："
                            v-show="searchForm.timeType!==3">
                <el-date-picker v-model="timeSection"
                                :disabled="timeDisabled"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="~"
                                :picker-options="disabledTime"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="店铺选择：">
                <el-select placeholder="请选择店铺"
                           v-model="searchForm.shop">
                  <el-option v-for="item in shopArr"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row ">
            <el-col :span="8">
              <el-form-item label="推广工具：">
                <el-cascader :options="extendOptions"
                             :props="{ multiple: true }"
                             collapse-tags
                             clearable>
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item class="search-btn">
                <el-button>重置</el-button>
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
          <h4>列表</h4>
          <!-- <el-button type="primary"
                     class="flex-center add-btn">
            <i class="add-icon"></i>
            <label>新增商品</label>
          </el-button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tableMixin from '@/mixins/dealTable'
import HeaderTop from '@/components/header'
import { timeTypeArr, shopArr, extendOptions } from './data'

export default {
  mixins: [tableMixin],
  components: { HeaderTop },
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
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/common/styles/page-table";
@import "./index";
</style>
