import request from '@/utils/request'

export function getAllSchool() {
  return request({
    url: '/school',
    method: 'get',
    params:{}
  })
}

export function getSchoolPage(pageForm) {
  return request({
    url: '/school/page',
    method: 'post',
    data:pageForm
  })
}

export function deleteSchool(ids) {
  return request({
    url: `/school/delete/${ids.join(',')}`,
    method:'delete'
  })
}

export function addSchool(form) {
  return request({
    url: `/school/add`,
    method: 'post',
    data:form
  })
}

export function getSchool(id) {
  return request({
    url: `/school/get/${id}`,
    method: 'get',
  })
}

export function updateSchool(form) {
  return request({
    url: `/school/update`,
    method: 'put',
    data: form
  })
}