<template>
  <div class="app-container">
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
          <el-tag :type="statusFilter(scope.row.state)">{{ scope.row.isSend }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sendTime" label="发布时间" min-width="15%">
        <template #default="scope">
          <i class="el-icon-time" />
          <span v-if="scope.row.isSend">{{ scope.row.sendTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="ctime" label="创建时间" min-width="15%">
        <template #default="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.ctime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="15%" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            class="el-button--text"
            @click="onRead(scope.row.id)"
          >阅读
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="pageSize"
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
import { createNotice, getReceivedList, read, readInfo, sendNotice, updateNotice } from '@/api/notice'
import { queryGroup } from '@/api/groupUser'

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
      readInfoList: [{
        id: 0,
        username: ''
      }],
      readInfoLoading: false,
      pageNum: 1,
      pageSize: 5,
      total: 0,
      listLoading: true,
      form: {
        header: '',
        content: '',
        groupName: '',
        groupId: 0
      },
      updateForm: {
        header: '',
        content: '',
        groupName: '',
        groupId: 0
      },
      dialogFormVisible: false,
      updateFormVisible: false,
      readInfoTableVisible: false,
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
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    fetchData() {
      this.listLoading = true
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      getReceivedList(data).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    queryMyGroup(groupName, cb) {
      queryGroup(groupName).then(response => {
        const groupList = response.data
        cb(groupList)
      })
    },
    onSendNotice(noticeId) {
      sendNotice({ noticeId: noticeId }).then(response => {
        console.log(response)
      }).catch(e => {
        console.log(e)
      })
    },
    // 分页
    handleSizeChange: function(size) {
      this.pageSize = size
      this.fetchData()
    },
    handleCurrentChange: function(currentPage) {
      this.pageNum = currentPage
      this.fetchData()
    },
    handleSelect(item) {
      this.form.groupId = item.groupId
    },
    // 创建
    createButton() {
      this.dialogFormVisible = true
    },
    onCreateNotice() {
      createNotice(this.form).then(() => {
        this.dialogFormVisible = false
      })
    },
    // 更新
    updateButton(row) {
      this.updateFormVisible = true
      this.updateForm = row
    },
    onUpdateNotice() {
      updateNotice(this.updateForm).then(() => {
        this.updateFormVisible = false
      })
    },
    queryReadInfo(noticeId) {
      this.readInfoTableVisible = true
      this.readInfoLoading = true
      readInfo(noticeId).then((response) => {
        this.readInfoLoading = false
        const data = response.data
        this.readInfoList = data
      })
    },
    onRead(noticeId) {
      read(noticeId).then(() => {
        this.$message.success('已读')
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
