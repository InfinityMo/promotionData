// eslint-disable-next-line no-unused-vars
import { getLastSevenDay, getLastThirtyDay, prevWeek, prevYear, recentYear, monthSpliceDay } from '../common/utils/timeCalc'
const mixins = {
  data () {
    return {
      disabledTime: {
        disabledDate: (time) => {
          return time.getTime() > Date.now() - 1 * 24 * 3600 * 1000
        }
      }
    }
  },
  computed: {
    timeDisabled () {
      let flag = true
      this.searchForm.timeType === 0 ? flag = false : flag = true
      return flag
    }
  },
  watch: {
    'searchForm.timeType' (oldValue, newVal) {
      this.searchForm.timeSection = ''
      this.searchForm.month = ''
    }
  },
  methods: {
    // 处理时间
    timeTypeChange (timeType) {
      switch (timeType) {
        // 最近7天
        case 1:
          this.timeSection = getLastSevenDay()
          break
        // 上周
        case 2:
          this.timeSection = prevWeek()
          break
        // 最近三十天
        case 4:
          this.timeSection = getLastThirtyDay()
          break
        // 最近一年
        case 5:
          this.timeSection = recentYear()
          break
        // 去年
        case 6:
          this.timeSection = prevYear()
          break
      }
    },
    // 格式化月份时间
    fromatMonth () {
      monthSpliceDay(this.searchForm.month)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}

export default mixins
