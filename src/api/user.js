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

export function getTeacherSubject(id) {
  return request({
    url: `/user/querySubject/${id}`,
    method: 'get',
  })
}

export function addTeacherSubject(ids) {
  if (!ids.length) {
    // 直接返回一个解决的Promise，可以传递任何你认为合适的值
    return Promise.resolve('No operation - no ids provided');
  }
  return request({
    url: `/user/addSubject/${ids.join(',')}`,
    method: 'post',
  })
}

export function deleteTeacherSubject(ids) {
  if (!ids.length) {
    // 直接返回一个解决的Promise，可以传递任何你认为合适的值
    return Promise.resolve('No operation - no ids provided');
  }
  return request({
    url: `/user/deleteSubject/${ids.join(',')}`,
    method: 'post',
  })
}

export function getStatistics(form) {
  return request({
    url: '/user',
    method: 'post',
    data:form
  })
}