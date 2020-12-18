<template>
  <div>
    <el-table :data="dealData"
              class="standard-table">
      <el-table-column v-for="column in columns"
                       :key="column.dataKey"
                       :label="column.title"
                       :width="column.width">
        <template slot-scope="scope">
          <operate v-if="column.render"
                   :render="column.render"
                   :row="scope.row"
                   :column="column">
          </operate>
          <template v-else>
            <el-tooltip class="item"
                        effect="dark"
                        placement="top">
              <span class="tool-tip"
                    slot="content"
                    v-if="column.isShowHtml"
                    v-html="scope.row[column.dataKey]"></span>
              <span class="tool-tip"
                    slot="content"
                    v-else>{{scope.row[column.dataKey]}}</span>
              <span class="ell"
                    v-if="column.align"
                    :class="['text-'+column.align]">{{ scope.row[column.dataKey] }}</span>
              <span class="ell"
                    v-else>
                <span v-if="column.isShowHtml"
                      v-html="scope.row[column.dataKey]"></span>
                <span v-else>{{ scope.row[column.dataKey] }}</span>
              </span>
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination"
                   background
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="pageChange.pageNum"
                   :page-sizes="[5, 10, 20, 50, 100]"
                   :page-size="pageChange.pageSize"
                   :layout="layout"
                   :total="total">
    </el-pagination>
  </div>
</template>
<script>
// import { deepClone } from '@/common/utils/funcStore'
import operate from './operate'
export default {
  components: { operate },
  props: {
    // 表格列
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    // 表格数据源
    dataSource: {
      type: Array,
      required: true,
      default: () => []
    },
    // 分页样式
    layout: {
      type: String,
      default: 'total, prev, pager, next, sizes, jumper'
    },
    // 表格分页
    pagination: {
      type: Object || Boolean,
      required: true,
      default: () => { }
    }
  },
  data () {
    return {
      pageChange: {
        pageNum: 1,
        pageSize: this.pagination.pageSize
      }
    }
  },
  computed: {
    dealData () {
      const isIndex = this.columns.some((item, index) => {
        return item.dataKey === '_index'
      })
      if (isIndex) {
        this.dataSource.forEach((item, index) => {
          this.dataSource[index]._index = (this.pageChange.pageNum - 1) * this.pageChange.pageSize + index + 1
        })
      }
      return this.dataSource
    },
    total () {
      return this.pagination.total
    }
  },
  mounted () {

  },
  methods: {
    handleSizeChange (pageSize) {
      this.pageChange.pageSize = pageSize
      // 页数大小发生变化时，手动将当前页设置为1
      this.pageChange.pageNum = 1
      this.$emit('tableChange', this.pageChange)
    },
    handleCurrentChange (pageNum) {
      this.pageChange.pageNum = pageNum
      this.$emit('tableChange', this.pageChange)
    }
  }
}
</script>
<style lang="less" scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-weight: normal;
  padding: 20px 5px;
}
</style>
