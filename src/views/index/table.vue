<template>
  <div>
    <el-form :model="editTable">
      <el-table :data="tableData"
                class="custom-table"
                :span-method="rowMerge"
                :key="tableKey"
                border
                :max-height="calcHeight">
        <el-table-column v-for="(cloumn,index) in columns"
                         :fixed="cloumn.isFixed"
                         :width="cloumn.width"
                         :resizable="false"
                         :align="cloumn.align"
                         :key="cloumn.randomKey"
                         :prop="cloumn.key"
                         :label="cloumn.value">
          <!-- 插槽-自定义表头 -->
          <template #header
                    v-if="cloumn.edit">
            <div class="reset-header flex-item-center flex-between">
              <i class="edit-success-icon"
                 @click="submitData"
                 v-if="cloumn.isEdit"></i>
              <i class="edit-icon"
                 @click="toEdit(index)"
                 v-else></i>
              <span v-if="isViewMonth"
                    @click="viewMonthData(cloumn.key)"
                    class="view-month">{{cloumn.value}}</span>
              <span v-else>{{cloumn.value}}</span>
            </div>
          </template>
          <!-- 插槽-自定义表格 -->
          <template slot-scope="scope">
            <div v-if="cloumn.edit&&cloumn.isEdit&&scope.row.cellEdit"
                 class="has-input">
              <el-form-item :prop="cloumn.key+scope.$index+'.updateData'"
                            class="table-input"
                            :rules="[{ required: true, message: '请输入', trigger: 'blur' },
                            { pattern: /^\d+(\.\d{0,2})?$/, message: '请输入正确的数字', trigger: 'blur' },
                            {max: 13 , message: '最大长度13位', trigger: 'blur' }]">
                <el-input placeholder="请输入"
                          v-model="editTable[cloumn.key+scope.$index].updateData"></el-input>
              </el-form-item>
            </div>
            <div v-else
                 class="normal-cell">{{scope.row[cloumn.key]}}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>
<script>

// import { tableData } from './tableData'
// import { column } from './column'
import { createUUID } from '@/common/utils/funcStore'
import { mapMutations, mapGetters } from 'vuex'
export default {
  props: {
    form: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      columns: [],
      tableData: [],
      editTable: {},
      promotIdArr: [],
      filterLength: 0,
      isViewMonth: false,
      tableKey: 1
    }
  },
  watch: {
    form: {
      handler (val, oldval) {
        this.getColumns()
        this.getTableData()
        // 判断表格数据为月份
        this.isViewMonth = !!(val.timeType === 5 || val.timeType === 6)
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters([
      'getCacheData'
    ]),
    calcHeight () {
      let height = 0
      const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
      height = clientHeight - 165
      return height
    }
  },
  created () {
    // console.log(this.form)
    this.getColumns()
    this.getTableData()
  },
  methods: {
    ...mapMutations({ SAVECACHEDATA: 'SAVECACHEDATA' }),
    getColumns () {
      this.$request.post('/getColumn', this.form).then(res => {
        this.columns = res.data
        this.columns.forEach(i => {
          i.randomKey = createUUID()
          if (i.edit) {
            i.isEdit = false
          }
          if (i.key === 'promoType' || i.key === 'dataType') {
            i.isFixed = true
            i.align = 'left'
            if (i.key === 'promoType') {
              i.width = '153'
            }
            if (i.key === 'dataType') {
              i.width = '196'
            }
          } else {
            if (i.key === 'yearCompare' || i.key === 'monthCompare') {
              i.width = '92'
            } else {
              const clientHeight = document.documentElement.clientWidth || document.body.clientWidth
              if (clientHeight < 1920) {
                i.width = '153'
              } else {
                if (this.columns.length > 11) {
                  i.width = '153'
                }
              }
            }
            i.align = 'right'
            i.isFixed = false
          }
        })
      })
    },
    getTableData () {
      this.tableData = []
      this.promotIdArr = []
      this.$request.post('/getList', this.form).then(res => {
        this.tableData = res.data || []
        this.tableData.map(i => {
          this.promotIdArr.push(i.promoID)
        })
        // 刷新table dom
        this.tableKey = createUUID()
        this.$emit('tableRender', true)
        // console.log(this.promotIdArr)
        console.log(this.tableKey)
      })
    },
    toEdit (index) {
      // 每次编辑一行
      const columnKeyArr = []
      this.columns.map((item, index) => {
        if (item.edit) {
          this.columns[index].isEdit = false
          columnKeyArr.push(item.key)
        }
      })
      const target = this.columns[index]
      target.isEdit = true
      target.randomKey = createUUID()
      this.$set(this.columns, index, target)
      this.$forceUpdate()
      if (columnKeyArr.length > 0) {
        const columnKey = target.key
        const cacheArr = []
        this.tableData.map((item, index) => {
          if (item.cellEdit) {
            // 缓存当前列可编辑的数据
            cacheArr.push({
              cacheKey: columnKey + index,
              updateData: isNaN(String(parseInt(item[columnKey].replace(/,/g, '')))) ? '0' : String(parseInt(item[columnKey].replace(/,/g, '')))
            })
            this.$set(this.editTable, columnKey + index, {
              updateDate: columnKey,
              updateShop: '',
              promoID: item.promoID,
              dataType: item.dataType,
              updateData: isNaN(String(parseInt(item[columnKey].replace(/,/g, '')))) ? '0' : String(parseInt(item[columnKey].replace(/,/g, '')))
            })
          }
        })
        this.SAVECACHEDATA(cacheArr)
      }
      // 刷新table dom
      this.tableKey = createUUID()
    },
    submitData () {
      const copyEdittable = JSON.parse(JSON.stringify(this.editTable))
      if (this.getCacheData.length > 0) {
        Object.keys(this.editTable).forEach(eachKey => {
          const target = this.getCacheData.filter(i => i.cacheKey === eachKey)
          if (target.length > 0) {
            if (this.editTable[eachKey].updateData === target[0].updateData) {
              delete copyEdittable[eachKey]
            }
          }
        })
      }
      if (Object.keys(copyEdittable).length > 0) {
        const submitArr = []
        Object.keys(copyEdittable).map(key => {
          submitArr.push(copyEdittable[key])
        })
        this.$request.post('/edit', {
          shop: this.form.shop,
          dataJson: JSON.stringify(submitArr)
        }).then(res => {
          if (res.errorCode === 1) {
            this.$message.success('保存成功')
            this.getTableData()
          }
        })
      }
    },
    viewMonthData (columnKey) {
      this.$emit('monthDialog', columnKey)
    },
    // tableRowClassName ({ row, rowIndex }) {
    //   const oldLength = this.filterLength
    //   const fiterArr = this.promotIdArr.filter(i => i === row.promoID)
    //   this.filterLength = fiterArr.length
    //   if (fiterArr.length >= 0) {
    //     debugger
    //     if (rowIndex <= fiterArr.length + oldLength) {
    //       return 'column-stripe'
    //     } else {
    //       return 'column-normal'
    //     }
    //   } else {
    //     return ''
    //   }
    // },
    // 合并行

    formatRowspanAndColspan (tableData, tableKey) {
      const newArr = []
      // 分类检出tempList中的数据push到newArr中
      for (let i = 0; i < tableData.length;) {
        let count = 0
        for (let j = i; j < tableData.length; j++) {
          if (tableKey === 'promoID') {
            if (tableData[i].promoID === tableData[j].promoID) {
              count++
            }
          }
        }
        if (tableKey === 'promoID') {
          newArr.push({
            data: tableData[i].promoID,
            num: count
          })
        }
        i += count
      }
      // 格式化newArr中的数据
      for (let k = 0; k < newArr.length; k++) {
        if (newArr[k].num > 1 || newArr[k].num === 0) {
          for (let w = k; w < newArr[k].num + k - 1; w++) {
            newArr.splice(w + 1, 0, {
              data: newArr[k].data,
              num: 0
            })
          }
        }
      }
      return newArr
    },
    rowMerge ({ row, column, rowIndex, columnIndex }) {
      // 合并第一列
      const newArr = this.formatRowspanAndColspan(this.tableData, 'promoID')
      if (columnIndex === 0) {
        const num = newArr[rowIndex].num
        if (num > 1) {
          return {
            rowspan: num,
            colspan: 1
          }
        } else if (num < 1) {
          return {
            rowspan: 1,
            colspan: num
          }
        } else {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "./table";
</style>
