import request from '@/utils/request'

export function getQuestionPage(pageForm) {
  return request({
    url: '/question/page',
    method: 'post',
    data: pageForm
  })
}

export function deleteQuestion(ids) {
  return request({
    url: `/question/delete/${ids.join(',')}`,
    method: 'delete',
  })
}

export function addQuestion(form) {
  return request({
    url: `/question/add`,
    method: 'post',
    data:form
  })
}

export function updateQuestion(form) {
  return request({
    url: `/question/update`,
    method: 'put',
    data: form
  })
}

export function getQuestion(id) {
  return request({
    url: `/question/get/${id}`,
    method: 'get',
  })
}