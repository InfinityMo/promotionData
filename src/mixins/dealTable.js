import { getLastSevenDay, getLastThirtyDay, prevWeek, prevYear, recentYear, monthSpliceDay } from '../common/utils/timeCalc'
const mixins = {
  data () {
    return {
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime()
          if (maxDate) {
            this.pickerMinDate = ''
          }
        },
        disabledDate: (time) => {
          // 时间最大选择区间为30天，且当前时间不可选择
          if (this.pickerMinDate) {
            const thirtyDay = (30 - 1) * 24 * 3600 * 1000
            let maxTime = this.pickerMinDate + thirtyDay
            const minTime = this.pickerMinDate - thirtyDay
            if (maxTime > new Date()) {
              maxTime = new Date()
            }
            return time.getTime() > maxTime || time.getTime() < minTime
          }
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

  },
  methods: {
    // 处理时间
    timeTypeChange (timeType) {
      this.timeSection = []
      this.searchForm.month = ''
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
      this.timeSection = []
      this.$refs[formName].resetFields()
    }
  }
}

export default mixins
