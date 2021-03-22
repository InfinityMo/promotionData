export default {
  data () {
    return {
      option: {},
      legend: [],
      xAxisData: [],
      serisesData: []
    }
  },
  computed: {
    gobalReg () {
      return this.isNormalData ? /^_/ : /^st_/
    }
  },
  methods: {
    _setchartOptionData () {
      this.xAxisData = []
      this.tempFetchPromot.map((i, index) => {
        if (index === 0) {
          Object.keys(i.obj.data[0]).forEach(k => {
            if (this.gobalReg.test(k)) {
              if (this.isNormalData) {
                if (k.length > 7) {
                  this.xAxisData.push(`${k.substr(1, 4)}-${k.substr(5, 2)}-${k.substr(7)}`)
                } else {
                  this.xAxisData.push(`${k.substr(1, 4)}-${k.substr(5, 2)}`)
                }
              } else {
                this.xAxisData.push(`${k.substr(3, 4)}-${k.substr(7, 2)}`)
              }
            }
          })
        }
        this.listData(i.obj.data)
        this.legend.push(i.obj.name)
      })
      this.setSeries()
      return this._enclosureOPtion()
    },
    listData (list) {
      list.forEach(item => {
        item.timeDateData = []
        Object.keys(item).forEach(i => {
          if (this.gobalReg.test(i)) {
            if (item[i] === '-') {
              item.timeDateData.push(0)
            } else {
              if (item[i].indexOf('%') >= 0) {
                item.yIndex = 1
                item.timeDateData.push(Number(item[i].replace(/%/g, '')))
              } else {
                item.yIndex = 0
                item.timeDateData.push(Number(item[i].replace(/,/g, '')))
              }
            }
          }
        })
      })
    },
    setSeries () {
      const data = []
      this.tempFetchPromot.forEach(i => {
        data.push(i.obj.data[0])
      })
      data.map(i => {
        this.serisesData.push({
          name: i.promoType,
          type: 'bar',
          barWidth: '15%',
          data: i.timeDateData
        })
      })
    },
    _enclosureOPtion () {
      const chartOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'none'
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          top: '10%',
          containLabel: true
        },
        legend: {
          data: this.legend,
          top: '0',
          right: '10',
          textStyle: {
            color: '#333',
            fontSize: 14
          }
        },
        xAxis: {
          type: 'category',
          data: this.xAxisData,
          axisLine: {
            show: true, // 隐藏X轴轴线
            lineStyle: {
              color: '#333',
              width: 1
            }
          },
          axisTick: {
            show: true // 隐藏X轴刻度
          },
          axisLabel: {
            show: true,
            interval: 0,
            rotate: this.xAxisData.length > 15 ? 45 : 0,
            textStyle: {
              color: '#333', // X轴文字颜色
              fontSize: 12
            }
          }
        },
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisTick: {
            show: true
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#333',
              width: 1
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#333',
              fontSize: 12
            }
          }
        },
        {
          type: 'value',
          name: 'yPrecent',
          nameTextStyle: {
            color: '#fff',
            fontSize: 1
          },
          position: 'right',
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            formatter: '{value} %', // 右侧Y轴文字显示
            textStyle: {
              color: '#333',
              fontSize: 12
            }
          }
        }
        ],
        dataZoom: [{
          type: 'slider',
          show: true,
          height: 20,
          xAxisIndex: [0],
          bottom: '5',
          // left: 80,
          right: 90,
          start: 0,
          end: 100,
          handleIcon: `image://${this.dragPic}`,
          handleSize: '100%',
          handleStyle: {
            color: '#d3dee5'
          },
          textStyle: {
            fontSize: 12,
            color: '#333'
          },
          borderColor: '#90979c'
        }],
        series: this.serisesData
      }
      // console.log(chartOption)
      return chartOption
    }
  }
}
