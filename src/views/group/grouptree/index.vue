<template>
  <div class="app-container">
    <el-button type="primary" @click="dialogForJoin = true" >申请加入</el-button>
    <el-dialog v-model="dialogForJoin" title="申请加入" :close-on-click-modal='false'>
      <el-form>
        <el-form-item label="邀请码" :label-width="formLabelWidth" >
          <el-input v-model="inviteCode" autocomplete="off" @input="clearGroupName()" ></el-input>
          <el-button type="primary" @click="getGroupName" >查询组名</el-button>
        </el-form-item>
        <el-form-item label="组名" :label-width="formLabelWidth">
          <el-input v-model="groupName" autocomplete="off"  disabled/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogForJoin = false">取消</el-button>
          <el-button
            type="primary"
            @click="onJoin"
          >确认</el-button>
        </span>
      </template>
    </el-dialog>

    <el-input v-model="filterText" placeholder="根据组织名过滤" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      default-expand-all
      indent="30"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <el-tag @click="append(data)"> 增加</el-tag>
          <el-tag @click="remove(data)"> 删除 </el-tag>
        </span>
      </template>
    </el-tree>
    <el-dialog v-model="dialogFormVisible" :title="thisGroupName" :close-on-click-modal='false'>
      <el-form :model="form">
        <el-form-item label="节点类型">
          <el-radio-group v-model="form.parentGroup" size="large">
            <el-radio-button :label="parentGroup">兄弟节点</el-radio-button>
            <el-radio-button :label="thisGroupId">子节点</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="组名" :label-width="formLabelWidth">
          <el-input v-model="form.groupName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="onCreateGroup"
          >确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="dialogVisibleForDelete"
      width="30%"
      :close-on-click-modal='false'
    >
      <span>确认删除群组{{ deleteDialog.groupName }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisibleForDelete = false">取消</el-button>
          <el-button
            type="primary"
            @click="onDeleteGroup(deleteDialog.groupId)"
          >确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { createGroup, deleteGroup, getGroupNameByInviteCode, getGroupTree } from '@/api/group'
import { join } from '@/api/groupUser'

export default {

  data() {
    return {
      filterText: '',
      data2: null,
      defaultProps: {
        children: 'son',
        label: 'groupName'
      },
      form: {
        groupId: 0,
        groupName: '',
        parentGroup: 0
      },
      dialogFormVisible: false,
      dialogVisibleForDelete: false,
      dialogForJoin: false,
      groupName: '',
      inviteCode: '',
      formLabelWidth: '140px',
      parentGroup: 0,
      thisGroupId: 0,
      thisGroupName: '',
      deleteDialog: {},
      deleteTitle: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  mounted() {
    getGroupTree().then(response => {
      const data = response.data
      this.data2 = data
    })
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.groupName.indexOf(value) !== -1
    },

    append(data) {
      this.dialogFormVisible = true
      console.log(data)
      this.thisGroupId = data.groupId
      this.parentGroup = data.parentGroup
      this.thisGroupName = data.groupName
    },

    remove(data) {
      this.dialogVisibleForDelete = true
      this.deleteDialog = data
      this.deleteTitle = '确认删除组织:' + data.groupName
    },

    onCreateGroup() {
      createGroup(this.form).then((response) => {
        this.dialogFormVisible = false
        this.$message.success('创建成功')
      })
    },

    onDeleteGroup(groupId) {
      deleteGroup(groupId).then((response) => {
        this.$message.success('删除成功')
        this.dialogVisibleForDelete = false
      })
    },
    clearGroupName() {
      this.groupName = ''
    },

    onJoin() {
      join(this.inviteCode).then(() => {
        this.$message.success('成功加入')
        this.dialogForJoin = false
      })
    },
    getGroupName() {
      getGroupNameByInviteCode(this.inviteCode).then((response) => {
        this.groupName = response.data
      }).catch(() => {
        this.groupName = ''
      }
      )
    }

  }
}
</script>
<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  height: 40px;

}

</style>
