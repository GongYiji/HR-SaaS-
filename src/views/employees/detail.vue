<template>
  <div>
    <div>
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="登录账户设置" name="first">
            <el-form ref="userform" :model="userInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width: 300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input v-model="userInfo.password2" style="width: 300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情" name="second">
            <!-- <component :is="userInfo" /> -->
            <user-info />
          </el-tab-pane>
          <el-tab-pane label="工作信息" name="third">
            <jobInfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件(比如: 组件、工具js、第三方插件js、json文件、图片文件...)
// 例如: import <组件名称> from '<组件路径>';
import userInfo from './components/user-Info.vue'
import jobInfo from './components/job-info.vue'
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
export default {
// import 引入的组件需要注入到对象中才能使用
  name: '',
  components: {
    userInfo, jobInfo
  },
  props: {},
  data() {
    // 这里存放数据
    return {
      activeName: 'first',
      userId: this.$route.params.id,
      userInfo: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },

  // 计算属性 类似于 data 概念
  computed: {},
  // 监控 data 中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前 this 实例）
  created() {
    this.getUserDetailById()
  },
  // 生命周期 - 挂载完成（可以访问 DOM 元素）
  mounted() {},
  // 生命周期 - 创建之前
  beforeCreate() {},
  // 生命周期 - 挂载之前
  beforeMount() {},
  // 生命周期 - 更新之前
  beforeUpdate() {},
  // 生命周期 - 更新之后
  updated() {},
  // 生命周期 - 销毁之前
  beforeDestroy() {},
  // 生命周期 - 销毁完成
  destroyed() {},
  // 如果页面有 keep-alive 缓存功能，这个函数会触发
  activated() {},
  // 方法集合
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    saveUser() {
    //   try {
    //     await this.$refs.userform.validate()
    //     await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
    //     this.$message.success('保存成功')
    //   } catch (error) {
    //     console.log(error)
    //   }
      this.$refs.userform.validate(async() => {
        try {
          await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
          this.$message.success('保存成功')
        } catch (error) {
          console.log(error)
        }
      })
    }
  }
}
</script>
<style scoped lang = 'less' >

</style>
