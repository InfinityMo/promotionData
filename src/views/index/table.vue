<template>
  <div>
    <el-table :data="tableData"
              style="width: 100%"
              border
              height="250">
      <!-- <el-table-column fixed
                       prop="date"
                       label="日期"
                       width="150">
      </el-table-column>
      <el-table-column prop="province"
                       label="省份"
                       width="120">
        <template slot="header">
          111
        </template>
      </el-table-column> -->
      <el-table-column v-for="(cloumn ,index) in columns"
                       :fixed="cloumn.isFixed"
                       :width="cloumn.width"
                       :align="cloumn.align"
                       :key="cloumn.key"
                       :prop="cloumn.key"
                       :label="cloumn.value">
        <template slot="header"
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
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { column } from './column'
import { tableData } from './tableData'
export default {
  data () {
    return {
      columns: [],
      tableData: tableData
    }
  },
  computed: {
  },
  created () {
    this.getColumns()
  },
  methods: {
    getColumns () {
      this.columns = column
      this.columns.forEach(i => {
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
      console.log(this.columns)
    },
    toEdit (index) {
      // console.log(this.columns[index])

      const target = JSON.parse(JSON.stringify(this.columns[index]))
      target.isEdit = true

      // this.$set(this.columns, index, target)
      // this.columns[index].isEdit = true
      // console.log(this.columns)
    }
  }
}
</script>
<style lang="less" scoped>
@import "./table";
</style>
