<template>
  <div>
    <div class="head">
      <div class="head-content flex-between-center">
        <h4>推广工具数据查询系统</h4>
        <!-- 用户信息 -->
        <div class="flex-item-center user">
          <p class="journal"
             @click="viewJournal">查看操作日志</p>
          <div><img src="@/assets/img/custom/cat2.jpg"></div>
          <p>欢迎您！Infinity</p>
        </div>
      </div>
    </div>
    <el-dialog title="查看日志"
               custom-class="journal-dialog"
               width="1000px"
               top="40px"
               :modal="true"
               :destroy-on-close="true"
               :visible.sync="dialogVisible">
      <standard-table class="journal-table"
                      :dataSource="tableData"
                      :columns="columns"
                      layout="total, pager"
                      :pagination="PAGING"
                      @tableChange="tableChange" />
    </el-dialog>
  </div>

</template>

<script>

export default {
  data () {
    return {
      dialogVisible: false,
      PAGING: {
        total: 0,
        pageNum: 1,
        pageSize: 5
      },
      columns: [{
        dataKey: 'date',
        title: '日期',
        align: 'left',
        width: 150
      }, {
        dataKey: 'user',
        title: '用户',
        align: 'left',
        width: 80
      }, {
        dataKey: 'eventType',
        title: '操作类型',
        align: 'left',
        width: 80
      }, {
        dataKey: 'event',
        title: '操作',
        align: 'left'
      }, {
        dataKey: 'oldData',
        title: '操作前数据',
        align: 'left',
        width: 120
      }, {
        dataKey: 'newData',
        title: '操作后数据',
        align: 'left',
        width: 120
      }],
      tableData: [{
        date: '2020-12-18 19:00',
        user: 'TL-0001',
        eventType: '更改',
        event: '更改 “2020-12-12 品销宝/点击量” 数据',
        oldData: '20,051,687.00',
        newData: '90,051,687.00'
      }, {
        date: '2020-12-18 19:00',
        user: 'TL-0001',
        eventType: '更改',
        event: '更改',
        oldData: '687.00',
        newData: '87.00'
      }, {
        date: '2020-12-18 19:00',
        user: 'TL-0001',
        eventType: '更改',
        event: '更改',
        oldData: '687.00',
        newData: '87.00'
      }, {
        date: '2020-12-18 19:00',
        user: 'TL-0001',
        eventType: '更改',
        event: '更改',
        oldData: '687.00',
        newData: '87.00'
      }, {
        date: '2020-12-18 19:00',
        user: 'TL-0001',
        eventType: '更改',
        event: '更改',
        oldData: '687.00',
        newData: '87.00'
      }, {
        date: '2020-12-18 19:00',
        user: 'TL-0001',
        eventType: '更改',
        event: '更改',
        oldData: '687.00',
        newData: '87.00'
      }, {
        date: '2020-12-18 19:00',
        user: 'TL-0001',
        eventType: '更改',
        event: '更改',
        oldData: '687.00',
        newData: '87.00'
      }, {
        date: '2020-12-18 19:00',
        user: 'TL-0001',
        eventType: '更改',
        event: '更改',
        oldData: '687.00',
        newData: '87.00'
      }, {
        date: '2020-12-18 19:00',
        user: 'TL-0001',
        eventType: '更改',
        event: '更改',
        oldData: '687.00',
        newData: '87.00'
      }, {
        date: '2020-12-18 19:00',
        user: 'TL-0001',
        eventType: '更改',
        event: '更改',
        oldData: '687.00',
        newData: '87.00'
      }]
    }
  },
  methods: {
    viewJournal () {
      this.dialogVisible = false
    },
    // 表格分页的变化
    tableChange (changeParams) {
      this.PAGING.pageSize = changeParams.pageSize
      this.PAGING.pageNum = changeParams.pageNum
      this.getTableData()
    },
    getTableData () {

    }
  }
}
</script>

<style lang="less" scoped>
.head {
  position: fixed;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: #fff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
  z-index: 2501;
  .head-content {
    height: 100%;
    padding: 0 36px;
    h4 {
      font-size: 20px;
      color: #333;
    }
    .user {
      .journal {
        margin-right: 30px;
        font-size: 14px;
        color: #1890ff;
        cursor: pointer;
      }
      div {
        width: 36px;
        height: 36px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      p {
        font-size: 14px;
        margin-left: 10px;
        color: #333;
      }
    }
  }
}
</style>>
