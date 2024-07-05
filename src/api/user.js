import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data:data
  })
}

export function getInfo(token) {
  return request({
    url: `/user/info/${token}`,
    method: 'get',
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function register(form) {
  return request({
    url: '/user/register',
    method: 'post',
    data:form
  })
}

export function getTeacherPage(pageForm) {
  return request({
    url: '/user/page',
    method: 'post',
    data: pageForm
  })
}

export function deleteTeacher(ids) {
  return request({
    url: `/user/delete/${ids.join(',')}`,
    method: 'delete',
    // params: { token }
  })
}

export function getTeacherById(id) {
  return request({
    url: `/user/query/${id}`,
    method:'get'
  })
}

export function updateTeacher(form) {
  return request({
    url: '/user/update',
    method: 'put',
    data:form
  })
}