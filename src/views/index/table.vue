<template>
  <div>
    <el-form :model="editTable">
      <el-table :data="tableData"
                style="width: 100%"
                :span-method="rowMerge"
                border
                height="460">
        <el-table-column v-for="(cloumn,index) in columns"
                         :fixed="cloumn.isFixed"
                         :width="cloumn.width"
                         :align="cloumn.align"
                         :key="cloumn.randomKey"
                         :prop="cloumn.key"
                         :label="cloumn.value">
          <!-- 插槽-自定义表头 -->
          <template #header
                    v-if="cloumn.edit">
            <div class="reset-header flex-item-center flex-between">
              <i class="edit-success-icon"
                 v-if="cloumn.isEdit"></i>
              <i class="edit-icon"
                 @click="toEdit(index)"
                 v-else></i>
              <span>{{cloumn.value}}</span>
            </div>
          </template>
          <!-- 插槽-自定义表格 -->
          <template slot-scope="scope">
            <div v-if="cloumn.edit&&cloumn.isEdit">
              <el-form-item :prop="cloumn.key+scope.$index"
                            :rules="[{ required: true, message: '请输入', trigger: 'blur' }]">
                <el-input v-model="editTable[cloumn.key+scope.$index]"></el-input>
              </el-form-item>
            </div>
            <div v-else>{{scope.row[cloumn.key]}}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>
<script>
import { column } from './column'
import { tableData } from './tableData'
export default {
  data () {
    return {
      columns: [],
      tableData: [],
      editTable: {},
      promotIdArr: []
    }
  },
  computed: {
    randomKey () {
      return Math.random() * 100000000
    }
  },
  created () {
    this.getColumns()
    this.getTableData()
  },
  methods: {
    getColumns () {
      this.columns = column
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
    },
    getTableData () {
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
        this.tableData.map((item, index) => {
          this.$set(this.editTable, columnKey + index, item[columnKey])
        })
      }
      console.log(this.editTable)
    },
    // 合并行
    rowMerge ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const fiterArr = this.promotIdArr.filter(i => i === row.promoID)
        console.log(fiterArr)
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
