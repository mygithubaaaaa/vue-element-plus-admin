<template>
  <div class="app-container">
    <el-button type="primary" @click="createButton">
      <span>创建通知</span>
    </el-button>
    <!--    创建通知对话-->
    <el-dialog v-model="dialogFormVisible" title="创建通知">
      <el-form :model="form">
        <el-form-item label="通知名" :label-width="formLabelWidth">
          <el-input v-model="form.header" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="通知内容"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.content"
            autosize
            type="textarea"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="发送到那个组" :label-width="formLabelWidth">
          <el-autocomplete
            v-model="form.groupName"
            value-key="groupName"
            :fetch-suggestions="queryMyGroup"
            :trigger-on-focus="false"
            clearable
            placeholder="请输入组名"
            @select="handleSelect"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="onCreateNotice"
          >确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!--    更新通知对话-->
    <el-dialog v-model="updateFormVisible" title="更新通知">
      <el-form :model="updateForm">
        <el-form-item label="通知名" :label-width="formLabelWidth">
          <el-input v-model="updateForm.header" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="通知内容"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="updateForm.content"
            autosize
            type="textarea"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="发送到那个组" :label-width="formLabelWidth">
          <el-autocomplete
            v-model="updateForm.groupName"
            value-key="groupName"
            :fetch-suggestions="queryMyGroup"
            :trigger-on-focus="false"
            clearable
            placeholder="请输入组名"
            @select="handleSelect"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="updateFormVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="onUpdateNotice"
          >确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!--已读信息-->
    <el-dialog v-model="readInfoTableVisible" title="已读情况">
      <el-table
        v-loading="readInfoLoading"
        :data="readInfoList"
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
        <el-table-column label="真实群组" min-width="3%">
          <template #default="scope">
            {{ scope.row.realGroup }}
          </template>
        </el-table-column>
        <el-table-column label="是否已读" min-width="3%">
          <template #default="scope">
            <el-tag v-if="scope.row.read" class="ml-2" type="success">已读</el-tag>
            <el-tag v-else class="ml-2" type="danger">未读</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--    已发送通知表-->
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
          <el-tag v-if="scope.row.isSend" type="success">已发送</el-tag>
          <el-tag v-else type="danger">待发送</el-tag>
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
            v-if="!scope.row.isSend"
            type="primary"
            class="el-button--text"
            @click="onSendNotice(scope.row.id)"
          >发送通知
          </el-button>
          <el-button v-if="!scope.row.isSend" type="primary" class="el-button--text" @click="updateButton(scope.row)">
            更新通知
          </el-button>
          <el-button
            v-if="scope.row.isSend"
            type="primary"
            class="el-button--text"
            @click="queryReadInfo(scope.row.id)"
          >查看已读情况
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
import { createNotice, getCreatedList, readInfo, sendNotice, updateNotice } from '@/api/notice'
import { queryGroup } from '@/api/groupUser'

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
        groupId: 0,
        id: 0
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
    fetchData() {
      this.listLoading = true
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      getCreatedList(data).then(response => {
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
    // 发送
    onSendNotice(noticeId) {
      sendNotice({ noticeId: noticeId }).then(response => {
        this.$message.success('发送成功')
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
      this.form.groupId = item.id
    },
    // 创建
    createButton() {
      this.dialogFormVisible = true
    },
    onCreateNotice() {
      createNotice(this.form).then(() => {
        this.dialogFormVisible = false
        this.$message.success('创建成功')
      })
    },
    // 更新
    updateButton(row) {
      this.updateFormVisible = true
      this.updateForm = row
    },
    onUpdateNotice() {
      const req = {
        noticeId: this.updateForm.id,
        header: this.updateForm.header,
        content: this.updateForm.content,
        groupId: this.updateForm.groupId
      }
      updateNotice(req).then(() => {
        this.updateFormVisible = false
        this.$message.success('更新成功')
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
