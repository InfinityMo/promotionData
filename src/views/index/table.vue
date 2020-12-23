<template>
  <div>
    <el-form :model="editTable"
             ref="editTable">
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
                <div class="input-wrap">
                  <el-input placeholder="请输入"
                            :class="{'input-indent':scope.row.dataID === 3}"
                            v-model="editTable[cloumn.key+scope.$index].updateData"></el-input>
                  <span v-if="scope.row.dataID === 3">%</span>
                </div>
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
      columnKeyArr: [], // 当前column的所有集合
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
        this.getColumns().then(res => {
          if (res) {
            this.getTableData()
          }
        })
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
    this.getColumns().then(res => {
      if (res) {
        this.getTableData()
      }
    })
  },
  methods: {
    ...mapMutations({ SAVECACHEDATA: 'SAVECACHEDATA' }),
    getColumns () {
      this.columns = []
      this.columnKeyArr = []
      return new Promise((resolve, reject) => {
        this.$store.commit('SETSPINNING', true)
        this.$request.post('/getColumn', this.form, true).then(res => {
          this.columns = res.data
          this.columns.forEach(i => {
            i.randomKey = createUUID()
            if (i.edit) {
              i.isEdit = false
              this.columnKeyArr.push(i.key)
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
          this.$store.commit('SETSPINNING', false)
          resolve(true)
        })
      })
    },
    getTableData () {
      this.tableData = []
      this.promotIdArr = []
      this.$store.commit('SETSPINNING', true)
      this.$request.post('/getList', this.form, true).then(res => {
        this.tableData = res.data || []
        this.tableData.map(i => {
          this.promotIdArr.push(i.promoID)
        })
        // 刷新table dom
        this.tableKey = createUUID()
        //  通知父组件表格dom已渲染完成
        this.$nextTick(() => {
          this.$emit('tableRender', true)
        })
      })
    },
    toEdit (index) {
      // 每次编辑一行
      const columnsLen = this.columns.length
      for (let k = 0; k < columnsLen; k++) {
        if (this.columns[k].edit) {
          this.columns[k].isEdit = false
        }
      }
      const target = this.columns[index]
      target.isEdit = true
      target.randomKey = createUUID()
      this.$set(this.columns, index, target)
      if (this.columnKeyArr.length > 0) {
        const columnKey = target.key
        const cacheArr = []
        const len = this.tableData.length
        for (let i = 0; i < len; i++) {
          const item = this.tableData[i]
          if (item.cellEdit) {
            if (item.promoID === 1 && item.dataID === 3) {
              // 缓存当前列可编辑的数据
              cacheArr.push({
                dataID: item.dataID,
                cacheKey: columnKey + i,
                updateData: isNaN(String(Number(item[columnKey].replace(/%/g, '')))) ? '0' : String(Number(item[columnKey].replace(/%/g, '')))
              })
              this.$set(this.editTable, columnKey + i, {
                updateDate: columnKey,
                promoID: item.promoID,
                dataID: item.dataID,
                dataType: item.dataType,
                updateData: isNaN(String(Number(item[columnKey].replace(/%/g, '')))) ? '0' : String(Number(item[columnKey].replace(/%/g, '')))
              })
            } else {
              // 缓存当前列可编辑的数据
              cacheArr.push({
                dataID: item.dataID,
                cacheKey: columnKey + i,
                updateData: isNaN(String(parseInt(item[columnKey].replace(/,/g, '')))) ? '0' : String(parseInt(item[columnKey].replace(/,/g, '')))
              })
              this.$set(this.editTable, columnKey + i, {
                updateDate: columnKey,
                promoID: item.promoID,
                dataID: item.dataID,
                dataType: item.dataType,
                updateData: isNaN(String(parseInt(item[columnKey].replace(/,/g, '')))) ? '0' : String(parseInt(item[columnKey].replace(/,/g, '')))
              })
            }
          }
        }
        // this.tableData.forEach((item, index) => {

        // })
        // this.tableData.forEach((item, index) => {
        //   if (item.cellEdit) {
        //     if (item.promoID === 1 && item.dataID === 3) {
        //       // 缓存当前列可编辑的数据
        //       cacheArr.push({
        //         dataID: item.dataID,
        //         cacheKey: columnKey + index,
        //         updateData: isNaN(String(Number(item[columnKey].replace(/%/g, '')))) ? '0' : String(Number(item[columnKey].replace(/%/g, '')))
        //       })
        //       this.$set(this.editTable, columnKey + index, {
        //         updateDate: columnKey,
        //         updateShop: '',
        //         promoID: item.promoID,
        //         dataID: item.dataID,
        //         dataType: item.dataType,
        //         updateData: isNaN(String(Number(item[columnKey].replace(/%/g, '')))) ? '0' : String(Number(item[columnKey].replace(/%/g, '')))
        //       })
        //     } else {
        //       // 缓存当前列可编辑的数据
        //       cacheArr.push({
        //         dataID: item.dataID,
        //         cacheKey: columnKey + index,
        //         updateData: isNaN(String(parseInt(item[columnKey].replace(/,/g, '')))) ? '0' : String(parseInt(item[columnKey].replace(/,/g, '')))
        //       })
        //       this.$set(this.editTable, columnKey + index, {
        //         updateDate: columnKey,
        //         updateShop: '',
        //         promoID: item.promoID,
        //         dataID: item.dataID,
        //         dataType: item.dataType,
        //         updateData: isNaN(String(parseInt(item[columnKey].replace(/,/g, '')))) ? '0' : String(parseInt(item[columnKey].replace(/,/g, '')))
        //       })
        //     }
        //   }
        // })
        this.SAVECACHEDATA(cacheArr)
      }
      // 刷新table dom
      // this.tableKey = createUUID()
    },
    submitData () {
      this.$refs.editTable.validate((valid) => {
        if (valid) {
          const copyEdittable = JSON.parse(JSON.stringify(this.editTable))
          // 如果缓存的当前列为空，则当前整列为不可编辑。
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
              if (copyEdittable[key].dataID === 3) {
                copyEdittable[key].updateData /= 100
              }
              submitArr.push(copyEdittable[key])
            })

            this.$request.post('/edit', {
              shop: this.form.shop,
              dataJson: JSON.stringify(submitArr)
            }).then(res => {
              if (res.errorCode === 1) {
                if (res.data) {
                  this.$message.warning(res.data)
                } else {
                  this.$message.success('保存成功')
                  this.getColumns()
                  this.getTableData()
                }
              }
            })
          }
        } else {
          this.$message.warning('输入有误，请核查数据')
          return false
        }
      })
    },
    viewMonthData (columnKey) {
      this.$emit('monthDialog', columnKey)
    },
    tableRowClassName ({ row, rowIndex }) {
      const newArr = this.formatRowspanAndColspan(this.tableData, 'promoID')
      console.log(newArr)
      // const indexArr = newArr.filter(item => item.num > 0)
      const indexArr = []
      newArr.map(i => {
        if (i.num > 0) {
          indexArr.push(i.num)
        }
      })
      const datalength = indexArr.reduce((prev, cur) => {
        return prev + cur
      }, 0)
      for (let i = 0; i < datalength; i++) {
        // if(rowIndex<)
      }
      // console.log(indexArr)
      // indexArr.reduce((prev, cur) => {
      //   console.log(cur.num)
      //   return prev + cur.num
      // }, 0)
      // const oldLength = this.filterLength
      // const fiterArr = this.promotIdArr.filter(i => i === row.promoID)
      // this.filterLength = fiterArr.length
      // if (fiterArr.length >= 0) {
      //   debugger
      //   if (rowIndex <= fiterArr.length + oldLength) {
      //     return 'column-stripe'
      //   } else {
      //     return 'column-normal'
      //   }
      // } else {
      //   return ''
      // }
    },
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
