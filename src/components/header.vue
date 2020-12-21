<template>
  <div>
    <div class="head">
      <div class="head-content flex-between-center">
        <h4>推广工具数据查询系统</h4>
        <!-- 用户信息 -->
        <div class="flex-item-center user">
          <p class="journal"
             @click="viewJournal">查看操作日志</p>
          <el-popover placement="bottom"
                      trigger="click"
                      popper-class="user-popover">
            <div slot="reference">
              <div class="flex-item-center user-info">
                <div><img :src="userData.userImg"></div>
                <p>欢迎您！{{userData.userName}}</p>
              </div>
            </div>
            <div class="user-operate">
              <p class="flex-item-center"
                 @click="editPwd"><i class="edit-pwd-icon"></i><span>修改密码</span></p>
              <p class="flex-item-center"
                 @click="logout"><i class="log-out-icon"></i><span>退出登录</span></p>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
    <el-dialog title="查看日志"
               custom-class="journal-dialog"
               width="1000px"
               top="40px"
               :modal="true"
               :destroy-on-close="true"
               :visible.sync="journalShow">
      <standard-table class="journal-table"
                      :dataSource="tableData"
                      :columns="columns"
                      layout="total, pager"
                      :pagination="PAGING"
                      @tableChange="tableChange" />
    </el-dialog>
    <el-dialog title="更改密码"
               custom-class="edit-pwd"
               :visible.sync="pwdShow"
               :destroy-on-close="true"
               width="452px">
      <el-form :model="editForm"
               :rules="editRules"
               label-width="96px"
               ref="editForm">
        <el-form-item prop="oldPwd"
                      label="旧密码："
                      class="form-item">
          <el-input placeholder="请输入旧密码"
                    v-model="editForm.oldPwd"
                    show-password>
          </el-input>
        </el-form-item>
        <el-form-item prop="newPwdOne"
                      label="新密码："
                      class="form-item">
          <el-input placeholder="请输入新密码"
                    v-model="editForm.newPwdOne"
                    show-password>
          </el-input>
        </el-form-item>
        <el-form-item prop="newPwdTwo"
                      label="确认新密码："
                      class="form-item">
          <el-input placeholder="请输入确认新密码"
                    v-model="editForm.newPwdTwo"
                    show-password>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer user-edit">
        <el-button @click="pwdShow = false">取 消</el-button>
        <el-button type="primary"
                   @click="editHandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    var checkPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.editForm.newPwdOne) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      journalShow: false,
      pwdShow: false,
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
      }],
      editForm: {
        oldPwd: '',
        newPwdOne: '',
        newPwdTwo: ''
      },
      editRules: {
        oldPwd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPwdOne: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          // 密码至少包含 数字和英文，长度6-20
          { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/, message: '密码至少包含数字和英文，长度为6-20个字符', trigger: 'blur' }
        ],
        newPwdTwo: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: checkPwd, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({ userData: 'getUserData' })
  },
  methods: {
    viewJournal () {
      this.journalShow = true
    },
    editPwd () {
      this.pwdShow = true
    },
    // 表格分页的变化
    tableChange (changeParams) {
      this.PAGING.pageSize = changeParams.pageSize
      this.PAGING.pageNum = changeParams.pageNum
      this.getTableData()
    },
    getTableData () {

    },
    editHandle () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
        } else {
          return false
        }
      })
    },
    logout () {
      // 清除用户session
      this.$router.push('./')
      sessionStorage.removeItem('userData')
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
      .user-info {
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
      .user-info:hover {
        cursor: pointer;
      }
    }
  }
}
</style>>
