<template>
  <div class="app-container">
    <!--    我加入的组织表-->
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
      <el-table-column label="角色" min-width="10%" align="center">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.role === 0" >普通人员</el-tag>
          <el-tag type="warning" v-if="scope.row.role === 1" >管理员</el-tag>
          <el-tag type="error" v-else >创建者</el-tag>
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
import { getMyJoinedGroup, getUserList } from '@/api/groupUser'

export default {
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
        groupName: '',
        role: null,
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
      getMyJoinedGroup(this.queryForm).then(response => {
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
