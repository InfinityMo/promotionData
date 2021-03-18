<template>
  <div class="trend-wrap">
    <div class="title-wrap flex-between-center">
      <div class="title">{{title}}数据趋势对比图</div>
      <div class="flex-item-center">
        <p>选择数据类型(最多选8种)：</p>
        <el-select class="select"
                   :multiple-limit=8
                   v-model="dataType"
                   multiple
                   collapse-tags
                   placeholder="请选择数据类型"
                   @change="selectChange">
          <el-option v-for="item in promotOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="chart-wrap"
         ref="chart"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { dealTrendData, setChartOption } from './trendSeting'
import { Base64 } from 'js-base64'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      nData: '',
      title: '',
      trendChart: null,
      dataType: [],
      cacheDataType: [],
      promotOptions: [],
      filterData: [] // 当前图表数据源
    }
  },
  computed: {
    ...mapGetters([
      'getTableAllData'
    ])
  },
  watch: {

  },
  mounted () {
    this.nData = Base64.decode(this.$route.query.nData)
    this.getChartData(Base64.decode(this.$route.query.promotId))
    // debugger
    // 窗口变化重置图表
    window.addEventListener('resize', this.resizeChart, false)
  },
  methods: {
    getChartData (promotId) {
      // eslint-disable-next-line
      this.filterData = this.getTableAllData.filter(i => i.promoID == promotId)
      this.title = this.filterData[0].promoType
      this.setPromotOption() // 生成选择数据类型
    },
    setPromotOption () {
      this.filterData.forEach(i => {
        this.promotOptions.push({
          value: i.dataID,
          label: i.dataType
        })
      })
      // 默认选择前两项类型
      this.dataType = [this.promotOptions[0].value, this.promotOptions[1].value]
      dealTrendData(this.filterData, this.dataType, this.nData)
      this.createChart()
    },
    createChart () {
      this.trendChart = echarts.init(this.$refs.chart)
      this.setChart()
    },
    setChart (trendChart) {
      this.trendChart.setOption({}, true)
      this.trendChart.setOption(setChartOption())
    },
    selectChange (value) {
      if (value.length === 1) {
        this.cacheDataType = value
      }
      if (value.length === 0) {
        this.$message.warning('请至少选择一个数据类型')
        this.dataType.push(this.cacheDataType[0])
      }
      dealTrendData(this.filterData, this.dataType, this.nData)
      this.setChart()
    },
    resizeChart () {
      this.trendChart.resize()
    }
  },
  beforeRouteLeave (to, from, next) {
    // 页面走掉把事件给清除掉
    window.removeEventListener('resize', this.resizeChart, false)
    next()
  }
}
</script>
<style lang="less" scoped>
@import "./promot";
</style>
