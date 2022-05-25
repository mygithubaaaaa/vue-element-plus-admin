<template>
  <div class="app-container">

    <el-form :inline="true" :model="queryForm">
      <el-form-item label="用户名">
        <el-input v-model="queryForm.username" placeholder="用户名" />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="queryForm.role" placeholder="角色">
          <el-option label="老师" value="1" />
          <el-option label="学生" value="0" />
          <el-option label="所有" value="null" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
    </el-form>

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
      <el-table-column label="用户名" min-width="10%">
      <template #default="scope">
        {{ scope.row.username }}
      </template>
    </el-table-column>
      <el-table-column label="角色" :show-overflow-tooltip="true" min-width="20%" align="center">
        <template #default="scope">
            <el-tag v-if="scope.row.role===1" type="warning">老师</el-tag>
            <el-tag v-if="scope.row.role===0" type="success">普通人员</el-tag>
            <el-tag v-if="scope.row.role===2" type="error">管理员</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="15%" align="center">
        <template #default="scope">
          <el-button
            v-if="scope.row.role === 1"
            type="primary"
            class="el-button--text"
            @click="onSetRole(scope.row, 0)"
          >设为学生
          </el-button>
          <el-button v-if="scope.row.role === 0" type="primary" class="el-button--text" @click="onSetRole(scope.row, 1)">
            设为老师
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
import { ElMessage } from 'element-plus'
import { pageQueryUser, setUserRole } from '@/api/user'

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
          username: '',
          role: ''
        }
      ],
      total: 0,
      listLoading: true,
      queryForm: {
        username: '',
        role: null,
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      pageQueryUser(this.queryForm).then(response => {
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
    onSetRole(user, role) {
      setUserRole({ userId: user.id, role: role }).then(() => {
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
