import request from '@/utils/request'

/** *
 *
 * 获取组织架构数据
 * **/
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

/**
 * 删除部门
 */
export function deleteDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
/**
 * 新增部门
 */
export function addDepartments(data) {
  return request({
    url: `/company/department`,
    method: 'POST',
    data
  })
}
