<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger" @click="exportData()">导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true ">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column prop="mobile" label="手机号" sortable="" />
          <el-table-column prop="workNumber" label="工号" sortable="" />
          <el-table-column prop="formOfEmployment" label="聘用形式" :formatter="formatEmployment" sortable="" />
          <el-table-column prop="departmentName" label="部门" sortable="" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable="">
            <template slot-scope="{row}">
              <!-- 将时间格式化 -->
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="enableState" label="账户状态" sortable="">
            <template slot-scope="{row}">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>

          <el-table-column prop="companyName" label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>

              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            :current-page.sync="page.page"
            :page-size="page.pagesize"
            :total="page.total"
            layout="prev,pager,next"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 放置组件 -->
    <!-- sync修饰符是 子组件去改变父组件数据的一个语法糖 -->
    <add-employee :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
// 这里可以导入其他文件(比如: 组件、工具js、第三方插件js、json文件、图片文件...)
// 例如: import <组件名称> from '<组件路径>';
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 引入员工的枚举对象
import AddEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters/index'
export default {
// import 引入的组件需要注入到对象中才能使用
  name: '',
  components: { AddEmployee },
  props: {},
  data() {
    // 这里存放数据
    return {

      loading: false,
      list: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1,
        size: 10,
        total: 0 // 记录总数
      },
      showDialog: false,
      roleForm: {},
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },

  // 计算属性 类似于 data 概念
  computed: {},
  // 监控 data 中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前 this 实例）
  created() {
    this.getEmployeeList()
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
    changePage(newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage// 将当前页码赋值给当前的最新页码
      this.getEmployeeList()
    },
    async getEmployeeList() {
      this.loading = true
      const res = await getEmployeeList(this.page)
      console.log(res)
      this.page.total = res.total
      this.list = res.rows
      this.loading = false
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1 对应的 值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知 '
    },
    async delEmployee(id) {
      try {
        await this.$confirm('是否删除该员工')
        // 点击了确定
        await delEmployee(id)

        this.$message.success('删除员工成功')
        this.getEmployeeList() // 重新拉去数据
      } catch (error) {
        console.log(error)
      }
    },
    exportData() {
      // 导出excel
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        console.log(rows)
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        console.log(data)
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data: data,
          filename: '员工工资表',
          multiHeader,
          merges
        })
      })
    },

    // 将表头数据和数据进行对应
    formatJson(headers, rows) {
      return rows.map(item => {
        // item是一个对象  { mobile: 132111,username: '张三'  }
        // ["手机号", "姓名", "入职日期" 。。]
        return Object.keys(headers).map(key => {
          // 需要判断 字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
        // ["132", '张三’， ‘’，‘’，‘’d]
      })
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
      // 需要处理时间格式问题
    }
  }
}
</script>
<style scoped lang = 'less' >

</style>
