import request from '@/utils/request'

export function getSubjectPage(pageForm) {
  return request({
    url: '/subject/page',
    method: 'post',
    data: pageForm
  })
}

export function deleteSubject(ids) {
  return request({
    url: `/subject/delete/${ids.join(',')}`,
    method: 'delete'
  })
}

export function addSubject(form) {
  return request({
    url: `/subject/add`,
    method: 'post',
    data: form
  })
}

export function getSubject(id) {
  return request({
    url: `/subject/get/${id}`,
    method: 'get',
  })
}

export function updateSubject(form) {
  return request({
    url: `/subject/update`,
    method: 'put',
    data: form
  })
}