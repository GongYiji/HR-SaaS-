<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 缺少treeNode -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
          <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <tree-tools slot-scope="obj" :tree-node="obj.data" @delDepts="getDepartments" @addDepts="addDepts" />
        </el-tree>
      </el-card>
      <!-- 放置新增弹层组件  -->
      <add-depts :show-dialog="showDialog" :tree-node="node" />
    </div>
  </div>

</template>

<script>
import { getDepartments } from '@/api/department'
import treeTools from './components/tree-tools.vue'
import addDepts from './components/add-dept.vue' // 引入新增部门组件
import { tranListToTreeData } from '@/utils/index'
export default {
  components: {
    treeTools,
    addDepts
  },

  data() {
    return {
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      showDialog: false, // 显示窗体
      node: {}
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const res = await getDepartments()
      console.log(res)
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(res.depts, '') // 需要将其转化为树形结构
    },
    addDepts(node) {
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击部门 ，此时这个部门应该记录下来
      this.node = node // 记录当前点击的node节点
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
