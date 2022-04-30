<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="通知名">
        <el-input v-model="queryForm.noticeName" placeholder="通知名" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryForm.isSend" placeholder="状态">
          <el-option label="已发送" value="true" />
          <el-option label="未发送" value="false" />
          <el-option label="所有" value="null" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
    </el-form>
    <!--收到通知表-->
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
      <el-table-column label="通知名" min-width="10%">
        <template #default="scope">
          {{ scope.row.header }}
        </template>
      </el-table-column>
      <el-table-column label="通知发送群组" min-width="10%" align="center">
        <template #default="scope">
          <span>{{ scope.row.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="通知内容" :show-overflow-tooltip="true" min-width="20%" align="center">
        <template #default="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" min-width="5%" align="center">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.isSend" >已读</el-tag>
          <el-tag type="danger" v-else >未读</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sendTime" label="发布时间" min-width="15%">
        <template #default="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.sendTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="15%" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            class="el-button--text"
            @click="onRead(scope.row)"
            v-if="!scope.row.isSend"
          >阅读
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
import { getReceivedList, read } from '@/api/notice'

export default {

  data() {
    return {
      list: [
        {
          id: 0,
          header: '',
          isSend: false,
          content: '',
          sendTime: '',
          groupId: 0
        }
      ],
      total: 0,
      listLoading: true,
      queryForm: {
        noticeName: '',
        isSend: null,
        pageNum: 1,
        pageSize: 10
      },
      updateForm: {
        header: '',
        content: '',
        groupName: '',
        groupId: 0
      },
      dialogFormVisible: false,
      formLabelWidth: '140px',
      formTitle: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'danger',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    fetchData() {
      this.listLoading = true
      getReceivedList(this.queryForm).then(response => {
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
      this.form.groupId = item.groupId
    },

    onRead(notice) {
      read(notice.id).then(() => {
        this.$message.success('已读')
        notice.isSend = true
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
