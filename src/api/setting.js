import request from '@/utils/request'

/**
 * 获取角色列表
 */
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}

/**
 * 根据id查询企业
 */
export function getCompanyInfo(id) {
  return request({
    url: `/company/${id}`

  })
}

/**
 * 根据ID删除角色
 */
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}
/**
 * 根据ID更新角色
 */
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 根据ID获取角色详情
 */
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}
