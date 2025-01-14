<template>
  <div class="app-container">

    <!--组织成员-->
    <el-dialog v-model="userListTableVisible" title="组织成员">
      <el-table
        v-loading="userListLoading"
        :data="userList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="用户名" min-width="3%">
          <template #default="scope">
            {{ scope.row.username }}
          </template>
        </el-table-column>
        <el-table-column label="班级" min-width="3%">
          <template #default="scope">
            {{ scope.row.realGroup }}
          </template>
        </el-table-column>
        <el-table-column label="角色" min-width="3%">
          <template #default="scope">
            <el-tag v-if="scope.row.role===1" type="warning">管理员</el-tag>
            <el-tag v-if="scope.row.role===0" type="success">普通人员</el-tag>
            <el-tag v-if="scope.row.role===2" type="error">创建者</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="15%" align="center">
          <template #default="scope">
            <el-button
              v-if="scope.row.role === 1"
              type="primary"
              class="el-button--text"
              @click="onSetRole(scope.row, 0)"
            >设为普通人员
            </el-button>
            <el-button v-if="scope.row.role === 0" type="primary" class="el-button--text" @click="onSetRole(scope.row, 1)">
              设为管理员
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          :current-page="userListQuery.pageNum"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="userListQuery.pageSize"
          layout="total, sizes,prev, pager, next"
          :total="userListQuery.total"
          prev-text="上一页"
          next-text="下一页"
          @size-change="handleUserListQuerySizeChange"
          @current-change="handleUserListQueryCurrentChange"
        />
      </div>
    </el-dialog>

    <!--    我管理的组织表-->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="id" min-width="3%">
        <template #default="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="组织名" min-width="10%">
        <template #default="scope">
          {{ scope.row.groupName }}
        </template>
      </el-table-column>
      <el-table-column label="父组织名" min-width="10%" align="center">
        <template #default="scope">
          <span>{{ scope.row.parentGroupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邀请码" :show-overflow-tooltip="true" min-width="20%" align="center">
        <template #default="scope">
          {{ scope.row.inviteCode }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="15%" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            class="el-button--text"
            @click="getUserList(scope.row.id)"
          >查看成员
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        :current-page="queryForm.pageNum"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="queryForm.pageSize"
        layout="total, sizes,prev, pager, next"
        :total="total"
        prev-text="上一页"
        next-text="下一页"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

  </div>
</template>

<script>
import { getMyGroup, getUserList, setRole } from '@/api/groupUser'
import { ElMessage } from 'element-plus'

export default {

  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [
        {
          id: 0,
          groupName: '',
          parentGroupName: '',
          inviteCode: '',
          header: '',
          isSend: false,
          content: '',
          sendTime: '',
          groupId: 0
        }
      ],
      userList: [{
        id: 0,
        username: ''
      }],
      userListLoading: false,
      total: 0,
      listLoading: true,
      form: {
        header: '',
        content: '',
        groupName: '',
        groupId: 0
      },
      queryForm: {
        noticeName: '',
        isSend: null,
        pageNum: 1,
        pageSize: 10
      },
      userListQuery: {
        groupId: null,
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      userListTableVisible: false,
      formLabelWidth: '140px',
      formTitle: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getMyGroup(this.queryForm).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 分页
    handleSizeChange: function(size) {
      this.queryForm.pageSize = size
      this.fetchData()
    },
    handleCurrentChange: function(currentPage) {
      this.queryForm.pageNum = currentPage
      this.fetchData()
    },
    handleSelect(item) {
      this.form.groupId = item.id
    },
    getUserList(groupId) {
      this.userListTableVisible = true
      this.userListLoading = true
      this.userListQuery.groupId = groupId
      getUserList(this.userListQuery).then((response) => {
        this.userListLoading = false
        const data = response.data
        this.userList = data.records
        this.userListQuery.total = data.total
      })
    },
    // 分页
    handleUserListQuerySizeChange: function(size) {
      this.userListQuery.pageSize = size
      this.userListLoading = true
      getUserList(this.userListQuery).then((response) => {
        this.userListLoading = false
        const data = response.data
        this.userList = data.records
        this.userListQuery.total = data.total
      })
    },
    handleUserListQueryCurrentChange: function(currentPage) {
      this.userListQuery.pageNum = currentPage
      this.userListLoading = true
      getUserList(this.userListQuery).then((response) => {
        this.userListLoading = false
        const data = response.data
        this.userList = data.records
        this.userListQuery.total = data.total
      })
    },
    onSetRole(user, role) {
      setRole({ userId: user.id, groupId: this.userListQuery.groupId, role: role }).then(() => {
        user.role = role
        ElMessage({
          message: '修改角色成功',
          type: 'success'
        }
        )()
      })
    }
  }
}
</script>

<style scoped>
.el-button--text {
  margin-right: 15px;
  width: 30%;
  font-size: 62.5%;
  padding: 10px;
}

.el-select {
  width: 300px;
}

.el-input {
  width: 300px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
