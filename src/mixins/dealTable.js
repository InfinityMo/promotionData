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
    },
    timeTypeSelect () {
      if (this.searchForm.timeType === 0 || this.searchForm.timeType === 3) {
        if (this.searchForm.timeType === 0) {
          return this.timeSection.length > 0 ? `${this.timeSection[0]}~${this.timeSection[1]}` : ''
        } else {
          return this.searchForm.month
        }
      } else {
        const target = this.timeTypeArr.filter(i => i.value === this.searchForm.timeType)
        return target.length > 0 ? target[0].label : ''
      }
    },
    shopSelect () {
      const target = this.shopArr.filter(i => i.value === this.searchForm.shop)
      return target.length > 0 ? target[0].label : ''
    }

  },
  watch: {

  },
  methods: {
    _getSelectData (type) {
      const option = []
      return new Promise((resolve, reject) => {
        this.$request.post('/dropdownlist', { dropDownListType: type }).then(res => {
          if (res) {
            const dropData = res.data || []
            dropData.map((i) => {
              option.push({
                value: i.value,
                label: i.name
              })
            })
            resolve(option)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    _getCascader (type) {
      const option = []
      return new Promise((resolve, reject) => {
        this.$request.post('/dropdownlist', { dropDownListType: type }).then(res => {
          if (res) {
            const dropData = res.data || []
            dropData.map((i) => {
              option.push({
                value: i.value,
                label: i.name,
                children: i.children && i.children.length > 0 ? this._setChild(i.children) : []
              })
            })
            resolve(option)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    _setChild (arr) {
      const child = []
      arr.map(i => {
        child.push({
          value: i.value,
          label: i.name
        })
      })
      return child
    },
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
        // 默认为当月
        case 3:
          // eslint-disable-next-line no-case-declarations
          const nowDate = new Date()
          // eslint-disable-next-line no-case-declarations
          const year = nowDate.getFullYear()
          // eslint-disable-next-line no-case-declarations
          const month = nowDate.getMonth() + 1 > 10 ? nowDate.getMonth() + 1 : '0' + (nowDate.getMonth() + 1)
          this.searchForm.month = `${year}-${month}`
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
      return monthSpliceDay(this.searchForm.month)
    },
    resetForm (formName) {
      this.timeSection = []
      this.$refs[formName].resetFields()
    }
  }
}

export default mixins
