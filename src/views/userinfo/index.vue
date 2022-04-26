<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px" :disabled="!isEditing">
      <el-form-item label="用户名" disabled="true">
        <el-input v-model="form.username" disabled/>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="班级">
        <el-input v-model="form.realGroup" />
      </el-form-item>
    </el-form>
    <div class="btn">
      <el-button type="primary" class="btn" :disabled="isEditing" @click="onEdit">
        编辑
      </el-button>
      <el-button type="primary" class="btn" :disabled="!isEditing" @click="onSave">
        保存
      </el-button>
      <el-button type="primary" @click="dialogFormVisible=true">
        更改密码
      </el-button>
    </div>

    <el-dialog v-model="dialogFormVisible" title="更改密码">
      <el-form :model="passwordForm" :rules="passwordRules">
        <el-form-item label="原密码" :label-width="formLabelWidth" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" autocomplete="off" type="password" show-password />
        </el-form-item>
        <el-form-item
          label="新密码"
          :label-width="formLabelWidth"
          prop="newPassword"
        >
          <el-input
            v-model="passwordForm.newPassword"
            autosize
            type="password"
            autocomplete="off"
            show-password
          />
        </el-form-item>
        <el-form-item
          label="确认密码"
          :label-width="formLabelWidth"
          prop="newPasswordAgain"
        >
          <el-input
            v-model="passwordForm.newPasswordAgain"
            autosize
            type="password"
            autocomplete="off"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="onUpdatePassword"
          >确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getInfo, save, updatePassword } from '@/api/user'

export default {
  data() {
    return {
      form: {
        username: '',
        email: '',
        phone: '',
        realGroup: ''
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        newPasswordAgain: ''
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: '请填写原密码', trigger: 'blur' },
          { min: 8, max: 64, message: '长度必须是8-64', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码' },
          { min: 8, max: 64, message: '长度必须是8-64', trigger: 'blur' }
        ],
        newPasswordAgain: [
          { required: true, message: '请二次确认密码' },
          { min: 8, max: 64, message: '长度必须是8-64', trigger: 'blur' }
        ]
      },
      isEditing: false,
      dialogFormVisible: false,
      formLabelWidth: '140px'
    }
  },
  created() {
    getInfo().then(response => {
      const { data } = response
      this.form = data
    })
  },
  methods: {
    onEdit() {
      this.isEditing = true
    },
    onSave() {
      save(this.form).then(() => {
        this.isEditing = false
        this.$message.success('用户信息更新成功')
      })
    },
    async onUpdatePassword() {
      if (this.passwordForm.newPassword.trim() === this.passwordForm.newPasswordAgain.trim()) {
        updatePassword(this.passwordForm).then(() => {
          this.$message.success('密码更新成功')
        })
      } else {
        this.$message.error('两次新密码不相同')
      }
    }

  }
}
</script>

<style scoped>
.btn{
  text-align: center;
  align-self: center;
  vertical-align: center;
  horiz-align: center;
}
</style>
