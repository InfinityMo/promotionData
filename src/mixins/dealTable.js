// import { resolve, reject } from 'core-js/fn/promise'

const mixins = {
  data () {
    return {
      PAGING: {
        total: 0,
        pageNum: 1,
        pageSize: 5
      }
    }
  },
  methods: {
    // 公共获取下拉框接口，
    // type：1、店铺 2、品牌 3、链接 4、模板名称 5、模板类型 6、主品牌 7、违禁词 8、有效的违禁词
    _getSelectData (type) {
      const option = []
      return new Promise((resolve, reject) => {
        this.$request.post('/getdropdownlist', { dropDownListType: type }).then(res => {
          const dropData = res.data || []
          dropData.map((i) => {
            option.push({
              value: i.guid,
              label: i.name
            })
          })
          resolve(option)
        }).catch(err => {
          reject(err)
        })
      })
    },
    _isLastPage () {
      const lastPage = Math.ceil(this.PAGING.total / this.PAGING.pageSize)
      // 最后一页的条数
      const lastPageLength = this.PAGING.total % this.PAGING.pageSize
      // 判断当前页是否是最后一页
      if (this.PAGING.pageNum === lastPage) {
        if (this.PAGING.pageNum !== 1) {
          if (lastPageLength === 1) {
            this.PAGING.pageNum--
          }
        }
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}

export default mixins
