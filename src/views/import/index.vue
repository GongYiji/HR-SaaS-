<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>

<script>
// 这里可以导入其他文件(比如: 组件、工具js、第三方插件js、json文件、图片文件...)
// 例如: import <组件名称> from '<组件路径>';
import UploadExcel from '@/components/UploadExcel/index.vue'
import { importEmployee } from '@/api/employees'
export default {
// import 引入的组件需要注入到对象中才能使用
  name: '',
  components: {
    UploadExcel
  },
  props: {},
  data() {
    // 这里存放数据
    return {
      type: this.$route.query.type
    }
  },

  // 计算属性 类似于 data 概念
  computed: {},
  // 监控 data 中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前 this 实例）
  created() {},
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
    async  success({ header, results }) {
      // 如果是导入员工
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []
      results.forEach(item => {
        const userInfo = {}
        Object.keys(item).forEach(key => {
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            console.log(new Date(this.formatDate(item[key]), '/'))
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key]), '/')
            return
          }
          userInfo[userRelations[key]] = item[key]
        })
        arr.push(userInfo)
      })
      console.log(arr)
      await importEmployee(arr) // 调用导入接口
      this.$message.success('导入成功')
      this.$router.back()
    },

    // 把excel文件中的日期格式的内容转回成标准时间
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>
<style scoped lang = 'less' >

</style>
