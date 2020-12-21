<template>
  <div>
    <el-form :model="editTable">
      <el-table :data="tableData"
                class="custom-table"
                :span-method="rowMerge"
                border
                :height="calcHeight">
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

import { tableData } from './tableData'
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
      isViewMonth: false
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
    },
    randomKey () {
      return Math.random() * 100000000
    }
  },
  created () {
    console.log(this.form)
    this.getColumns()
    this.getTableData()
  },
  methods: {
    ...mapMutations({ SAVECACHEDATA: 'SAVECACHEDATA' }),
    getColumns () {
      this.$request.post('/getColumn', this.form).then(res => {
        this.columns = res.data
        this.columns.forEach(i => {
          i.randomKey = Math.random() * 100000000
          if (i.edit) {
            i.isEdit = false
          }
          if (i.key === 'toolType' || i.key === 'dataType') {
            i.isFixed = true
            i.align = 'left'
            if (i.key === 'toolType') {
              i.width = '153'
            }
            if (i.key === 'dataType') {
              i.width = '196'
            }
          } else {
            if (i.key === 'yearCompare' || i.key === 'monthCompare') {
              i.width = '92'
            } else {
              i.width = '153'
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
      this.tableData = tableData
      this.tableData.map(i => {
        this.promotIdArr.push(i.promoID)
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
      target.randomKey = Math.random() * 100000000
      this.$set(this.columns, index, target)
      if (columnKeyArr.length > 0) {
        const columnKey = target.key
        const cacheArr = []
        this.tableData.map((item, index) => {
          if (item.cellEdit) {
            // 缓存当前列可编辑的数据
            cacheArr.push({
              cacheKey: columnKey + index,
              updateData: String(parseInt(item[columnKey].replace(/,/g, '')))
            })
            this.$set(this.editTable, columnKey + index, {
              updateDate: columnKey,
              updateShop: '',
              promoID: item.promoID,
              dataType: item.dataType,
              updateData: String(parseInt(item[columnKey].replace(/,/g, '')))
            })
          }
        })
        this.SAVECACHEDATA(cacheArr)
      }
      // console.log(this.editTable)
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
      console.log(Object.keys(copyEdittable).length)
      // console.log(copyEdittable)
      if (Object.keys(copyEdittable).length > 0) {
        const submitArr = []
        Object.keys(copyEdittable).map(key => {
          submitArr.push(copyEdittable[key])
        })
        console.log(submitArr)
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
    rowMerge ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const fiterArr = this.promotIdArr.filter(i => i === row.promoID)
        if (fiterArr.length > 0) {
          if (rowIndex % fiterArr.length === 0) {
            return {
              rowspan: fiterArr.length,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
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
